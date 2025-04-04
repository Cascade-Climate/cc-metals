import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import colors from '../assets/colors';
import {
  calculatePresetConcentrations,
  calculateCustomConcentrations,
  CalculationResult,
  getElements,
  PresetCalculationParams,
  CustomCalculationParams,
} from '../services/api';

const MetalCalculator: React.FC = () => {
  const [elements, setElements] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [feedstockType, setFeedstockType] = useState<string>('basalt');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  console.log(result?.distributions.feedstock);

  const [customParams, setCustomParams] = useState<CustomCalculationParams>({
    element: '',
    feedstock_type: '',
    soil_conc: 15,
    soil_conc_sd: 1,
    soil_d: 0.18,
    soil_d_err: 0.02,
    dbd: 1300,
    dbd_err: 100,
    feed_conc: 1500,
    feed_conc_sd: 250,
    application_rate: 2,
  });

  useEffect(() => {
    const loadElements = async () => {
      const elementsList = await getElements(feedstockType);
      setElements(elementsList);
      setSelectedElement('');
    };
    void loadElements().catch(console.warn);
  }, [feedstockType]);

  const handleCalculate = async () => {
    setLoading(true);

    try {
      if (isCustom) {
        if (customParams.element === '') {
          setCustomParams({
            ...customParams,
            element: 'Custom element',
          });
        }
        if (customParams.feedstock_type === '') {
          setCustomParams({
            ...customParams,
            feedstock_type: 'Custom feedstock type',
          });
        }
        const data = await calculateCustomConcentrations(customParams);
        setResult(data);
      } else {
        if (selectedElement === '') {
          return;
        }
        const params: PresetCalculationParams = {
          element: selectedElement,
          feedstock_type: feedstockType,
        };
        const data = await calculatePresetConcentrations(params);
        setResult(data);
      }
    } catch (error) {
      console.warn('Calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomParamChange =
    (field: keyof CustomCalculationParams) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomParams({
        ...customParams,
        [field]: parseFloat(event.target.value) || 0,
      });
    };

  return (
    <Box height="100%" width="100%">
      <Paper sx={{ p: 3, mb: 3 }}>
        <ToggleButtonGroup
          value={isCustom}
          exclusive
          sx={{
            mb: 3,
            width: '20%',
            '& .MuiToggleButton-root': {
              flex: 1,
              fontWeight: 'bold',
              fontSize: '1rem',
              py: 0.5,
              textTransform: 'none',
            },
          }}
        >
          <ToggleButton
            onClick={() => setIsCustom(false)}
            value={false}
            sx={{
              '&.Mui-selected': {
                backgroundColor: colors.Green.Dark,
                color: 'white',
                '&:hover': {
                  backgroundColor: colors.Green.Dark,
                },
              },
            }}
          >
            Preset
          </ToggleButton>
          <ToggleButton
            onClick={() => setIsCustom(true)}
            value={true}
            sx={{
              '&.Mui-selected': {
                backgroundColor: colors.Green.Dark,
                color: 'white',
                '&:hover': {
                  backgroundColor: colors.Green.Dark,
                },
              },
            }}
          >
            Custom
          </ToggleButton>
        </ToggleButtonGroup>
        {!isCustom ? (
          <Grid container spacing={3} sx={{ width: '100%' }}>
            <Grid width="40%">
              <FormControl fullWidth>
                <InputLabel>Feedstock Type</InputLabel>
                <Select
                  value={feedstockType}
                  onChange={(e) => setFeedstockType(e.target.value)}
                  label="Feedstock Type"
                >
                  <MenuItem value="basalt">Basalt</MenuItem>
                  <MenuItem value="peridotite">Peridotite</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid width="40%">
              <FormControl fullWidth>
                <InputLabel>Element</InputLabel>
                <Select
                  value={selectedElement}
                  onChange={(e) => setSelectedElement(e.target.value)}
                  label="Element"
                >
                  {elements.map((elem) => (
                    <MenuItem key={elem} value={elem}>
                      {elem}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={1} sx={{ width: '100%' }}>
            <Grid>
              <Typography variant="h6" gutterBottom>
                Name of Element and Feedstock Type (optional)
              </Typography>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Element"
                    value={customParams.element}
                    onChange={(e) =>
                      setCustomParams({
                        ...customParams,
                        element: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Feedstock Type"
                    value={customParams.feedstock_type}
                    onChange={(e) =>
                      setCustomParams({
                        ...customParams,
                        feedstock_type: e.target.value,
                      })
                    }
                  />
                </Grid>{' '}
              </Grid>
            </Grid>

            <Grid>
              <Typography variant="h6" gutterBottom>
                Soil Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Metal Concentration (mg/kg)"
                    type="number"
                    value={customParams.soil_conc}
                    onChange={handleCustomParamChange('soil_conc')}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Metal Concentration Error (stdev)"
                    type="number"
                    value={customParams.soil_conc_sd}
                    onChange={handleCustomParamChange('soil_conc_sd')}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Soil Depth (m)"
                    type="number"
                    value={customParams.soil_d}
                    onChange={handleCustomParamChange('soil_d')}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Soil Depth Error (stdev)"
                    type="number"
                    value={customParams.soil_d_err}
                    onChange={handleCustomParamChange('soil_d_err')}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Soil Bulk Density (g/cm^3)"
                    type="number"
                    value={customParams.dbd}
                    onChange={handleCustomParamChange('dbd')}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Soil Bulk Density Error (stdev)"
                    type="number"
                    value={customParams.dbd_err}
                    onChange={handleCustomParamChange('dbd_err')}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid>
              <Typography variant="h6" gutterBottom>
                Feedstock Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Metal Concentration (mg/kg)"
                    type="number"
                    value={customParams.feed_conc}
                    onChange={handleCustomParamChange('feed_conc')}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Metal Concentration Error (stdev)"
                    type="number"
                    value={customParams.feed_conc_sd}
                    onChange={handleCustomParamChange('feed_conc_sd')}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Ton Feedstock/Application (t/ha)"
                    type="number"
                    value={customParams.application_rate}
                    onChange={handleCustomParamChange('application_rate')}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleCalculate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              bgcolor: colors.Green.Light,
              '&:hover': { bgcolor: colors.Green.Dark },
              py: 1,
              px: 3,
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </Button>
        </Box>
      </Paper>
      {result && (
        <Paper sx={{ px: 5, pb: 10 }}>
          <Box sx={{ height: 300, mb: 10 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Feedstock and soil {result.element} distributions
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[0, 'auto']}
                  tick={false}
                />
                <YAxis
                  label={{
                    value: 'Density',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                  domain={[
                    0,
                    Math.max(
                      ...result.distributions.feedstock.y,
                      ...result.distributions.soil.y
                    ) * 1.1,
                  ]}
                  tick={false}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                />
                <Line
                  data={result.distributions.feedstock.x.map((x, i) => ({
                    x,
                    y: result.distributions.feedstock.y[i],
                  }))}
                  type="monotone"
                  dataKey="y"
                  stroke="#2ca02c"
                  name="Feedstock"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  data={result.distributions.soil.x.map((x, i) => ({
                    x,
                    y: result.distributions.soil.y[i],
                  }))}
                  type="monotone"
                  dataKey="y"
                  stroke="#7f7f7f"
                  name="Soil"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ height: 300 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Soil {result.element} after {result.feedstock_type} application
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                <XAxis
                  dataKey="x"
                  type="number"
                  label={{
                    value: `${result.element} concentration (mg/kg)`,
                    position: 'bottom',
                  }}
                  domain={[0, 'auto']}
                />
                <YAxis
                  label={{
                    value: 'Density',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                  domain={[
                    0,
                    Math.max(
                      ...result.distributions.feedstock.y,
                      ...result.distributions.soil.y
                    ) * 1.1,
                  ]}
                  tick={false}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                />
                {Object.entries(result.concentrations).map(
                  ([rate, kde], index) => (
                    <Line
                      key={rate}
                      data={kde.x.map((x, i) => ({
                        x,
                        y: kde.y[i],
                      }))}
                      type="monotone"
                      dataKey="y"
                      name={`${rate} t/ha`}
                      stroke={
                        [
                          '#1f77b4', // blue
                          '#ff7f0e', // orange
                          '#2ca02c', // green
                          '#d62728', // red
                          '#9467bd', // purple
                          '#8c564b', // brown
                          '#e377c2', // pink
                          '#7f7f7f', // gray
                          '#bcbd22', // yellow-green
                          '#17becf', // cyan
                        ][index % 10]
                      }
                      dot={false}
                      strokeWidth={2}
                    />
                  )
                )}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MetalCalculator;
