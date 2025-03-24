import React, { useState, useEffect } from 'react';
import { 
  Box, Button, FormControl, InputLabel, MenuItem, Select, 
  Slider, Typography, Paper, Grid, CircularProgress, TextField
} from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, AreaChart, Area, ResponsiveContainer 
} from 'recharts';
import { getElements, calculateConcentrations, CalculationParams, CalculationResult } from '../services/api';

const MetalCalculator: React.FC = () => {
  const [elements, setElements] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [feedstockType, setFeedstockType] = useState<string>('basalt');
  const [applicationRates, setApplicationRates] = useState<number[]>([0, 25, 50, 75, 100]);
  const [soilDepthRange, setSoilDepthRange] = useState<[number, number]>([0.05, 0.3]);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  useEffect(() => {
    const loadElements = async () => {
      try {
        const elementsList = await getElements();
        setElements(elementsList);
        if (elementsList.length > 0) {
          setSelectedElement(elementsList[0]);
        }
      } catch (error) {
        console.error('Failed to load elements:', error);
      }
    };
    
    loadElements();
  }, []);
  
  const handleCalculate = async () => {
    if (!selectedElement) return;
    
    setLoading(true);
    
    try {
      const params: CalculationParams = {
        element: selectedElement,
        feedstock_type: feedstockType,
        application_rates: applicationRates,
        soil_depth_min: soilDepthRange[0],
        soil_depth_max: soilDepthRange[1]
      };
      
      const data = await calculateConcentrations(params);
      setResult(data);
    } catch (error) {
      console.error('Calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare data for distribution chart
  const prepareDistributionData = () => {
    if (!result) return [];
    
    return result.distributions.bin_centers.map((x, i) => ({
      x,
      feedstock: result.distributions.feedstock[i],
      soil: result.distributions.soil[i]
    }));
  };
  
  // Prepare data for concentration charts
  const prepareConcentrationData = () => {
    if (!result) return {};
    
    // Create histogram data for each application rate
    const concentrationData: Record<string, { x: number; y: number }[]> = {};
    
    Object.keys(result.concentrations).forEach(rate => {
      const values = result.concentrations[rate];
      const min = Math.min(...values);
      const max = Math.max(...values);
      const bins = 50;
      const binSize = (max - min) / bins;
      
      const histogram = Array(bins).fill(0);
      values.forEach(val => {
        const binIndex = Math.min(Math.floor((val - min) / binSize), bins - 1);
        histogram[binIndex]++;
      });
      
      concentrationData[rate] = Array(bins).fill(0).map((_, i) => ({
        x: min + (i + 0.5) * binSize,
        y: histogram[i] / values.length
      }));
    });
    
    return concentrationData;
  };
  
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Heavy Metal Concentration Calculator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Element</InputLabel>
              <Select
                value={selectedElement}
                onChange={(e) => setSelectedElement(e.target.value as string)}
                label="Element"
              >
                {elements.map(elem => (
                  <MenuItem key={elem} value={elem}>{elem}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Feedstock Type</InputLabel>
              <Select
                value={feedstockType}
                onChange={(e) => setFeedstockType(e.target.value as string)}
                label="Feedstock Type"
              >
                <MenuItem value="basalt">Basalt</MenuItem>
                <MenuItem value="peridotite">Peridotite</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>
              Soil Depth Range (m)
            </Typography>
            <Slider
              value={soilDepthRange}
              onChange={(_, newValue) => setSoilDepthRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0.01}
              max={1}
              step={0.01}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{soilDepthRange[0].toFixed(2)}</Typography>
              <Typography variant="body2">{soilDepthRange[1].toFixed(2)}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>
              Application Rates (t/ha)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {applicationRates.map((rate, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    type="number"
                    value={rate}
                    onChange={(e) => {
                      const newRates = [...applicationRates];
                      newRates[i] = Number(e.target.value);
                      setApplicationRates(newRates);
                    }}
                    size="small"
                    sx={{ width: 80 }}
                  />
                  {i < applicationRates.length - 1 && <Typography sx={{ mx: 1 }}>,</Typography>}
                </Box>
              ))}
              <Button
                size="small"
                onClick={() => setApplicationRates([...applicationRates, 0])}
                variant="outlined"
              >
                Add Rate
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleCalculate}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {result && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Element Distributions
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={prepareDistributionData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  label={{ value: 'Concentration (mg/kg)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis label={{ value: 'Density', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="soil" fill="#000000" fillOpacity={0.6} stroke="#000000" />
                <Area type="monotone" dataKey="feedstock" fill="#4682b4" fillOpacity={0.6} stroke="#4682b4" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Resulting Concentrations
            </Typography>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  label={{ value: 'Concentration (mg/kg)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis label={{ value: 'Density', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                
                {result.thresholds && result.thresholds.map((threshold, i) => (
                  <Line
                    key={`threshold-${i}`}
                    type="monotone"
                    data={[{ x: threshold, y: 0 }, { x: threshold, y: 1 }]}
                    dataKey="y"
                    stroke="#ff0000"
                    strokeDasharray="5 5"
                    name={`Threshold ${result.threshold_agencies?.[i] || ''}`}
                  />
                ))}
                
                {Object.entries(prepareConcentrationData()).map(([rate, data], i) => (
                  <Line
                    key={`rate-${rate}`}
                    type="monotone"
                    data={data}
                    dataKey="y"
                    stroke={`hsl(${i * 40}, 70%, 50%)`}
                    name={`${rate} t/ha`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Statistics
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Soil</Typography>
                <Typography>Mean: {result.statistics.soil_mean.toFixed(2)} mg/kg</Typography>
                <Typography>Median: {result.statistics.soil_median.toFixed(2)} mg/kg</Typography>
                <Typography>95th Percentile: {result.statistics.soil_95_percentile.toFixed(2)} mg/kg</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Feedstock</Typography>
                <Typography>Mean: {result.statistics.feedstock_mean.toFixed(2)} mg/kg</Typography>
                <Typography>Median: {result.statistics.feedstock_median.toFixed(2)} mg/kg</Typography>
                <Typography>95th Percentile: {result.statistics.feedstock_95_percentile.toFixed(2)} mg/kg</Typography>
              </Grid>
              
              {applicationRates.map(rate => (
                <Grid item xs={12} md={4} key={`stats-${rate}`}>
                  <Typography variant="h6">{rate} t/ha Application</Typography>
                  <Typography>Mean: {result.statistics[`application_${rate}_mean`]?.toFixed(2) || 'N/A'} mg/kg</Typography>
                  <Typography>Median: {result.statistics[`application_${rate}_median`]?.toFixed(2) || 'N/A'} mg/kg</Typography>
                  <Typography>95th Percentile: {result.statistics[`application_${rate}_95_percentile`]?.toFixed(2) || 'N/A'} mg/kg</Typography>
                  
                  {result.thresholds && result.thresholds.length > 0 && (
                    <Typography>
                      % Above Threshold: {result.statistics[`application_${rate}_pct_above_threshold`]?.toFixed(2) || 'N/A'}%
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default MetalCalculator;