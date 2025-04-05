from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from scipy.stats import gamma
from typing import List, Dict
from pydantic import BaseModel
from fitter import Fitter
from scipy.stats import truncnorm
from scipy.stats import gaussian_kde

app = FastAPI(title="Enhanced Rock Weathering Heavy Metal Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

soil_data = pd.read_csv('data/cleaned_soil_data.csv')
basalt_feedstock_data = pd.read_csv('data/cleaned_feedstock_data_basalt.csv')
peridotite_feedstock_data = pd.read_csv('data/cleaned_feedstock_data_peridotite.csv')
threshold_data = pd.read_csv('data/model_thresholds.csv')

class ThresholdEntry(BaseModel):
    agency: str
    threshold: float

class ThresholdResult(BaseModel):
    Total: List[ThresholdEntry]
    Aqua_regia: List[ThresholdEntry]
    Other_very_strong_acid: List[ThresholdEntry]

class PresetCalculationParams(BaseModel):
    element: str
    feedstock_type: str

class CustomCalculationParams(BaseModel):
    soil_conc: float
    soil_conc_sd: float
    soil_d: float
    soil_d_err: float
    dbd: float
    dbd_err: float
    feed_conc: float
    feed_conc_sd: float
    application_rate: float 
    element: str
    feedstock_type: str

class CalculationResult(BaseModel):
    distributions: Dict[str, Dict[str, List[float]]]
    concentrations: Dict[str, List[float]]

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
    

def calc_feedstock_conc(feedstock_conc, soil_d, dbd, t):
    """Calculate the concentration contribution from feedstock application"""
    return (feedstock_conc * (t/10))/soil_d/dbd

def calc_soil_conc(soil_conc):
    """Calculate the concentration contribution from existing soil"""
    return soil_conc

def calc_element_conc(soil_d, feedstock_conc, soil_conc, dbd, t):
    """Calculate total element concentration by combining feedstock and soil contributions"""
    feedstock_contribution = calc_feedstock_conc(feedstock_conc, soil_d, dbd, t)
    soil_contribution = calc_soil_conc(soil_conc)
    return feedstock_contribution + soil_contribution

def calc_soil_conc_dist(soil_conc, n=10000):
    """Calculate distribution of soil concentrations"""
    rng = np.random.default_rng()
    total_conc_list = [
        calc_soil_conc(rng.choice(soil_conc, 1)[0])
        for _ in range(n)
    ]
    return total_conc_list

def calc_feedstock_conc_dist(feedstock_conc, soil_d, dbd, t, n=10000):
    """Calculate distribution of feedstock concentrations"""
    rng = np.random.default_rng()
    total_conc_list = [
        calc_feedstock_conc(rng.choice(feedstock_conc, 1)[0], max(rng.choice(soil_d, 1)[0], 1), rng.choice(dbd, 1)[0], t)
        for _ in range(n)
    ]
    return total_conc_list

def calc_element_conc_dist(t, dbd_dist, soil_d_dist, feedstock_dist, soil_dist, n=10000):
    """Calculate distribution of total element concentrations for given application rate"""
    rng = np.random.default_rng()
    total_conc_list = [
        calc_element_conc(
            max(rng.choice(soil_d_dist, 1)[0], 1),  # Ensure soil_d >= 1
            rng.choice(feedstock_dist, 1)[0],
            rng.choice(soil_dist, 1)[0],
            rng.choice(dbd_dist, 1)[0],
            t
        )
        for _ in range(n)
    ]
    return total_conc_list

def get_dbd_dist():
    """Get bulk density distribution"""
    n= 1000
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
    

def get_thresh(element) -> ThresholdResult:
    """Get threshold values for an element, categorized by extraction type"""
    # Clean threshold values by removing commas
    threshold_data['Threshold Level (mg/kg)'] = threshold_data['Threshold Level (mg/kg)'].apply(
        lambda x: x.replace(',', '') if isinstance(x, str) and ',' in x else x
    )
    
    # Filter for the specific element
    element_data = threshold_data[threshold_data['Metal'] == element]
    
    # Initialize the result dictionary
    thresholds = {
        "Total": [],
        "Aqua_regia": [],
        "Other_very_strong_acid": []
    }
    
    # Process each row and categorize by extraction type
    for _, row in element_data.iterrows():
        extraction_type = row['Total, Aqua regia, extractable, or other (specify)']
        if pd.isna(extraction_type):
            continue
            
        # Clean and convert threshold value
        try:
            threshold_value = float(row['Threshold Level (mg/kg)'])
        except (ValueError, TypeError):
            continue
            
        threshold_entry = ThresholdEntry(
            agency=row['Agency'],
            threshold=threshold_value
        )
        
        # Categorize based on extraction type
        if "total" in extraction_type.lower():
            thresholds["Total"].append(threshold_entry)
        elif "aqua regia" in extraction_type.lower():
            thresholds["Aqua_regia"].append(threshold_entry)
        else:
            thresholds["Other_very_strong_acid"].append(threshold_entry)
    
    return ThresholdResult(**thresholds)

def calculate_normalized_kde(data, num_points=200):
    """Calculate KDE for the given data and normalize to percentages"""
    # Remove any negative values as they don't make sense for concentrations
    data = data[data >= 0]
    
    # Calculate the KDE
    kde = gaussian_kde(data)
    
    # Generate points to evaluate the KDE
    x_range = np.linspace(min(data), max(data), num_points)
    y_values = kde(x_range)
    
    # Normalize y-values to percentages (0-100)
    y_values = (y_values / np.max(y_values)) * 100
    
    return x_range.tolist(), y_values.tolist()

@app.get("/elements")
def get_elements(feedstock_type: str):
    """Get list of available elements based on feedstock type"""
    if feedstock_type == 'basalt':
        elements = ['Ni', 'Cu', 'Zn', 'V', 'Pb', 'Co', 'Cd', 'Se', 'Cr', 'Mn', 'Sb',
                   'Be', 'As', 'Ag', 'Hg']
    elif feedstock_type == 'peridotite':
        elements = ['Ni', 'Cu', 'Zn', 'V', 'Pb', 'Co', 'Cd', 'Se', 'Cr', 'Mn', 'Sb',
                   'Be', 'As', 'Ag', 'Ba']
    else:
        return {"error": "Invalid feedstock type. Must be either 'basalt' or 'peridotite'"}
    
    return {"elements": elements}

@app.post("/calculate-preset")
def calculate_preset(params: PresetCalculationParams):
    """Calculate metal concentrations using preset parameters"""
    element_short = params.element
    element = f"{element_short} (mg/kg)"
    feedstock_type = params.feedstock_type
    
    if feedstock_type == 'basalt':
        feedstock_data = basalt_feedstock_data
    elif feedstock_type == 'peridotite':
        feedstock_data = peridotite_feedstock_data
    
    # Create distributions using preset data
    soil_d_dist = np.random.uniform(0.05, 0.3, 10000)  # Standard soil depth range
    dbd_dist = get_dbd_dist()
    feedstock_dist = get_dist(feedstock_data, element)
    soil_dist = get_dist(soil_data, element)
    
    # Calculate KDE for feedstock and soil distributions
    feedstock_x, feedstock_y = calculate_normalized_kde(feedstock_dist)
    soil_x, soil_y = calculate_normalized_kde(soil_dist)
    
    # Determine application rates based on feedstock type
    if feedstock_type == 'basalt':
        application_rates = list(range(0, 126, 25))  # t = tonnes
    elif feedstock_type == 'peridotite':
        application_rates = list(range(0, 26, 5))    # t = tonnes
    else:
        return {"error": "Invalid feedstock type. Must be either 'basalt' or 'peridotite'"}
    
    # Calculate concentrations for each application rate
    concentrations = {}
    for rate in application_rates:
        conc_list = calc_element_conc_dist(rate, dbd_dist, soil_d_dist, feedstock_dist, soil_dist)
        x_kde, y_kde = calculate_normalized_kde(np.array(conc_list))
        concentrations[str(rate)] = {
            "x": x_kde,
            "y": y_kde
        }
    
    return {
        "distributions": {
            "feedstock": {
                "x": feedstock_x,
                "y": feedstock_y
            },
            "soil": {
                "x": soil_x,
                "y": soil_y
            }
        },
        "concentrations": concentrations,
        "element": element_short,
        "feedstock_type": feedstock_type
    }

@app.post("/calculate-custom")
def calculate_custom(params: CustomCalculationParams):
    """Calculate metal concentrations using custom parameters"""
    # Create distributions using custom parameters
    n = 10000
    rng = np.random.default_rng()
    feedstock_dist = rng.normal(loc=params.feed_conc, scale=params.feed_conc_sd, size=n)
    soil_dist = rng.normal(loc=params.soil_conc, scale=params.soil_conc_sd, size=n)
    dbd_dist = rng.normal(loc=params.dbd, scale=params.dbd_err, size=n)
    soil_d_dist = rng.normal(loc=params.soil_d, scale=params.soil_d_err, size=n)
    
    # Calculate KDEs for feedstock and soil distributions
    feedstock_x, feedstock_y = calculate_normalized_kde(feedstock_dist)
    soil_x, soil_y = calculate_normalized_kde(soil_dist)

    concentrations = {}
    conc_list = calc_element_conc_dist(params.application_rate, dbd_dist, soil_d_dist, feedstock_dist, soil_dist)
    x_kde, y_kde = calculate_normalized_kde(np.array(conc_list))
    concentrations[str(params.application_rate)] = {
            "x": x_kde,
            "y": y_kde
        }
    
    return {
        "distributions": {
            "feedstock": {
                "x": feedstock_x,
                "y": feedstock_y
            },
            "soil": {
                "x": soil_x,
                "y": soil_y
            }
        },
        "concentrations": concentrations,
        "element": params.element,
        "feedstock_type": params.feedstock_type
    }

@app.get("/thresholds")
def get_thresholds(element: str) -> ThresholdResult:
    """Get threshold values for a specific element"""
    return get_thresh(element)