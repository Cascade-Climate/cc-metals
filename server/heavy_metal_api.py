from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from scipy.stats import gamma
import matplotlib.pyplot as plt
import seaborn as sns
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import io
import base64
from fitter import Fitter

app = FastAPI(title="Heavy Metal Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

soil_data = pd.read_csv('cleaned_soil_data.csv')
feedstock_data = pd.read_csv('cleaned_feedstock_data.csv')
threshold_data = pd.read_csv('model_thresholds.csv')

class CalculationParams(BaseModel):
    element: str
    feedstock_type: str
    application_rates: List[float]
    soil_depth_min: float = 0.05
    soil_depth_max: float = 0.3
    # Custom mode parameters
    custom_mode: bool = False
    feed_conc: Optional[float] = None
    feed_conc_sd: Optional[float] = None
    soil_conc: Optional[float] = None
    soil_conc_sd: Optional[float] = None
    dbd: Optional[float] = None
    dbd_err: Optional[float] = None
    soil_d: Optional[float] = None
    soil_d_err: Optional[float] = None

class CalculationResult(BaseModel):
    distributions: Dict[str, Dict[str, List[float]]]
    concentrations: Dict[str, List[float]]
    thresholds: Optional[List[float]] = None
    statistics: Dict[str, Any]

# Copy the key functions from heavy_metal_tool.py
def get_dist(df, element, sample_size=10000):
    """Get distribution of metal concentrations"""
    f = Fitter(df[element].dropna(), distributions=['gamma'])
    f.fit()
    
    best_fit = f.get_best(method='sumsquare_error')
    dist_type = list(best_fit.keys())[0]
    
    a = best_fit[dist_type]['a']
    loc = best_fit[dist_type]['loc']
    scale = best_fit[dist_type]['scale']
    
    rv = gamma(a, loc, scale)
    return rv.rvs(size=sample_size)

def calc_element_conc(soil_d, feedstock_conc, soil_conc, dbd, t):
    """Calculate element concentration"""
    total_conc_feedstock = (feedstock_conc * (t/10))/soil_d/dbd
    total_conc = total_conc_feedstock + soil_conc
    return total_conc

def get_thresh(df_thresh, element_short):
    """Get threshold values for an element"""
    df_thresh['Threshold Level (mg/kg)'] = df_thresh['Threshold Level (mg/kg)'].apply(
        lambda x: x.replace(',', '') if isinstance(x, str) and ',' in x else x
    )
    
    thresh = df_thresh[df_thresh['Metal'] == element_short]['Threshold Level (mg/kg)'].dropna().astype('float').to_list()
    thresh_agency = df_thresh[df_thresh['Metal'] == element_short]['Agency'].to_list()
    
    return thresh, thresh_agency

def calc_conc(t, dbd_dist, soil_d_dist, feedstock_dist, soil_dist, n=10000):
    """Calculate concentrations for given application rate"""
    total_conc_list = []
    rng = np.random.default_rng()
    
    for i in range(n):
        feedstock_conc = rng.choice(feedstock_dist, 1)[0]
        soil_conc = rng.choice(soil_dist, 1)[0]
        dbd = rng.choice(dbd_dist, 1)[0]
        soil_d = rng.choice(soil_d_dist, 1)[0]
        
        if soil_d < 0:
            soil_d = 1
            
        total_conc = calc_element_conc(soil_d, feedstock_conc, soil_conc, dbd, t)
        total_conc_list.append(total_conc)
        
    return total_conc_list

# Create bulk density distribution
from scipy.stats import truncnorm

def get_dbd_dist(n=1000):
    mean = 1250
    std_dev = 250
    a = 800  # Lower bound
    b = 1700  # Upper bound
    
    truncated_normal = truncnorm(
        (a - mean) / std_dev,
        (b - mean) / std_dev,
        loc=mean,
        scale=std_dev
    )
    
    return truncated_normal.rvs(size=n)

# API endpoints
@app.get("/")
def read_root():
    return {"message": "Heavy Metal Analysis API is running"}

@app.get("/elements")
def get_elements():
    """Get list of available elements"""
    elements = [col.split(' ')[0] for col in feedstock_data.columns if ' (mg/kg)' in col]
    return {"elements": elements}

@app.post("/calculate")
def calculate(params: CalculationParams):
    """Calculate metal concentrations based on input parameters"""
    element_short = params.element
    element = f"{element_short} (mg/kg)"
    feedstock_type = params.feedstock_type
    
    # Create distributions
    if params.custom_mode:
        # Custom mode distributions
        rng = np.random.default_rng()
        feedstock_dist = rng.normal(loc=params.feed_conc, scale=params.feed_conc_sd, size=10000)
        soil_dist = rng.normal(loc=params.soil_conc, scale=params.soil_conc_sd, size=10000)
        dbd_dist = rng.normal(loc=params.dbd, scale=params.dbd_err, size=10000)
        soil_d_dist = rng.normal(loc=params.soil_d, scale=params.soil_d_err, size=10000)
    else:
        # Standard mode distributions
        soil_d_dist = np.random.uniform(params.soil_depth_min, params.soil_depth_max, 10000)
        dbd_dist = get_dbd_dist()
        feedstock_dist = get_dist(feedstock_data, element)
        soil_dist = get_dist(soil_data, element)
    
    # Get thresholds
    thresholds, agencies = get_thresh(threshold_data, element_short)
    
    # Determine application rates based on feedstock type
    if not params.custom_mode:
        if feedstock_type == 'basalt':
            application_rates = list(range(0, 126, 25))  # t = tonnes
        elif feedstock_type == 'peridotite':
            application_rates = list(range(0, 26, 5))    # t = tonnes
        else:
            application_rates = params.application_rates
    else:
        application_rates = params.application_rates
    
    # Calculate concentrations for each application rate
    concentrations = {}
    for rate in application_rates:
        conc_list = calc_conc(rate, dbd_dist, soil_d_dist, feedstock_dist, soil_dist)
        concentrations[str(rate)] = conc_list
    
    # Prepare distribution data for frontend
    # Convert to histograms with fixed bins for consistent visualization
    bins = np.linspace(0, np.percentile(feedstock_dist, 99), 100)
    
    feedstock_hist, bin_edges = np.histogram(feedstock_dist, bins=bins, density=True)
    soil_hist, _ = np.histogram(soil_dist, bins=bins, density=True)
    
    # Calculate statistics
    statistics = {
        "soil_mean": float(np.mean(soil_dist)),
        "soil_median": float(np.median(soil_dist)),
        "soil_95_percentile": float(np.percentile(soil_dist, 95)),
        "feedstock_mean": float(np.mean(feedstock_dist)),
        "feedstock_median": float(np.median(feedstock_dist)),
        "feedstock_95_percentile": float(np.percentile(feedstock_dist, 95)),
    }
    
    # For each application rate, calculate statistics
    for rate, conc_list in concentrations.items():
        statistics[f"application_{rate}_mean"] = float(np.mean(conc_list))
        statistics[f"application_{rate}_median"] = float(np.median(conc_list))
        statistics[f"application_{rate}_95_percentile"] = float(np.percentile(conc_list, 95))
        
        if thresholds:
            min_threshold = min(thresholds)
            statistics[f"application_{rate}_pct_above_threshold"] = (
                sum(1 for x in conc_list if x > min_threshold) / len(conc_list) * 100
            )
    
    return {
        "distributions": {
            "bin_centers": [(bin_edges[i] + bin_edges[i+1])/2 for i in range(len(bin_edges)-1)],
            "feedstock": feedstock_hist.tolist(),
            "soil": soil_hist.tolist()
        },
        "concentrations": concentrations,
        "thresholds": thresholds,
        "threshold_agencies": agencies,
        "statistics": statistics
    }