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
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import colors from '../assets/colors';
import {
  calculateConcentrations,
  CalculationParams,
  CalculationResult,
  getElements,
} from '../services/api';

const MetalCalculator: React.FC = () => {
  const [elements, setElements] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [feedstockType, setFeedstockType] = useState<string>('basalt');
  const [applicationRates, setApplicationRates] = useState<number[]>([
    0, 25, 50, 75, 100,
  ]);
  const [soilDepthRange, setSoilDepthRange] = useState<[number, number]>([
    0.05, 0.3,
  ]);
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
    loadElements().catch((error) =>
      console.error('Failed to load elements:', error)
    );
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
        soil_depth_max: soilDepthRange[1],
      };

      const data = await calculateConcentrations(params);
      setResult(data);
    } catch (error) {
      console.error('Calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure all numerical values have at most 2 decimal places
  const formatNumber = (value: number): string => {
    return value.toFixed(2);
  };

  // Prepare data for distribution chart
  const prepareDistributionData = () => {
    if (!result) return [];

    return result.distributions.bin_centers.map((x, i) => ({
      x: parseFloat(formatNumber(x)),
      feedstock: parseFloat(formatNumber(result.distributions.feedstock[i])),
      soil: parseFloat(formatNumber(result.distributions.soil[i])),
    }));
  };

  // Prepare data for concentration charts
  const prepareConcentrationData = () => {
    if (!result) return {};

    // Create histogram data for each application rate
    const concentrationData: Record<string, { x: number; y: number }[]> = {};

    Object.keys(result.concentrations).forEach((rate) => {
      const values = result.concentrations[rate].map((v) =>
        parseFloat(formatNumber(v))
      );
      const min = Math.min(...values);
      const max = Math.max(...values);
      const bins = 50;
      const binSize = (max - min) / bins;

      const histogram = Array(bins).fill(0);
      values.forEach((val) => {
        const binIndex = Math.min(Math.floor((val - min) / binSize), bins - 1);
        histogram[binIndex]++;
      });

      concentrationData[rate] = Array(bins)
        .fill(0)
        .map((_, i) => ({
          x: parseFloat(formatNumber(min + (i + 0.5) * binSize)),
          y: parseFloat(formatNumber(histogram[i] / values.length)),
        }));
    });

    return concentrationData;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Paper
        sx={{ p: 3, mb: 3, borderLeft: `4px solid ${colors.Green.Faint}` }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
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

          <Grid size={{ xs: 12, md: 4 }}>
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

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography gutterBottom>Soil Depth Range (m)</Typography>
            <Slider
              value={soilDepthRange}
              onChange={(_, newValue) =>
                setSoilDepthRange(newValue as [number, number])
              }
              valueLabelDisplay="auto"
              min={0.01}
              max={1}
              step={0.01}
              sx={{
                color: colors.Green.Light,
                '& .MuiSlider-thumb': {
                  backgroundColor: colors.Green.Light,
                },
                '& .MuiSlider-rail': {
                  backgroundColor: colors.Green.Faint,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">
                {soilDepthRange[0].toFixed(2)}
              </Typography>
              <Typography variant="body2">
                {soilDepthRange[1].toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography gutterBottom>Application Rates (t/ha)</Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                alignItems: 'center',
              }}
            >
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
                  {i < applicationRates.length - 1 && (
                    <Typography sx={{ mx: 1 }}>,</Typography>
                  )}
                </Box>
              ))}
              <Button
                size="small"
                onClick={() => setApplicationRates([...applicationRates, 0])}
                variant="outlined"
                sx={{
                  color: colors.Green.Light,
                  borderColor: colors.Green.Light,
                }}
              >
                Add Rate
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              onClick={handleCalculate}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{
                bgcolor: colors.Green.Light,
                '&:hover': { bgcolor: colors.Green.Dark },
              }}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {result && (
        <Paper
          sx={{
            p: 4,
            mb: 4,
            maxHeight: '80vh',
            overflow: 'auto',
            borderLeft: `4px solid ${colors.Green.Light}`,
          }}
        >
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: 'auto' }}
          >
            {/* Top subplot - Feedstock and soil distributions */}
            <Box sx={{ height: 300, mb: 5 }}>
              <Typography
                variant="h6"
                align="center"
                gutterBottom
                sx={{ mb: 2 }}
              >
                Feedstock and soil {selectedElement} distributions
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={prepareDistributionData()}
                  margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    label={{
                      value: `${selectedElement} concentration (mg/kg)`,
                      position: 'insideBottom',
                      offset: -5,
                    }}
                    tickFormatter={formatNumber}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    label={{
                      value: 'Density',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 10,
                    }}
                    tickFormatter={formatNumber}
                    padding={{ top: 10, bottom: 10 }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatNumber(Number(value)),
                      'Density',
                    ]}
                  />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  <Area
                    type="monotone"
                    dataKey="soil"
                    name="Soil distribution"
                    fill={colors.Green.Dark}
                    fillOpacity={0.6}
                    stroke={colors.Green.Dark}
                  />
                  <Area
                    type="monotone"
                    dataKey="feedstock"
                    name="Feedstock distribution"
                    fill={colors.Green.Light}
                    fillOpacity={0.6}
                    stroke={colors.Green.Light}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>

            {/* Bottom subplot - Soil concentration after application */}
            <Box sx={{ height: 300, mt: 3, mb: 2 }}>
              <Typography
                variant="h6"
                align="center"
                gutterBottom
                sx={{ mb: 2 }}
              >
                Soil {selectedElement} after {feedstockType} application
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    label={{
                      value: `${selectedElement} concentration (mg/kg)`,
                      position: 'insideBottom',
                      offset: -5,
                    }}
                    tickFormatter={formatNumber}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    label={{
                      value: 'Density',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 10,
                    }}
                    tickFormatter={formatNumber}
                    padding={{ top: 10, bottom: 10 }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatNumber(Number(value)),
                      'Density',
                    ]}
                  />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />

                  {result.thresholds &&
                    result.thresholds.map((threshold, i) => (
                      <Line
                        key={`threshold-${i}`}
                        type="monotone"
                        data={[
                          { x: parseFloat(formatNumber(threshold)), y: 0 },
                          { x: parseFloat(formatNumber(threshold)), y: 1 },
                        ]}
                        dataKey="y"
                        stroke={colors.Green.Dark}
                        strokeDasharray="5 5"
                        name={`Threshold ${result.threshold_agencies?.[i] || ''}`}
                      />
                    ))}

                  {Object.entries(prepareConcentrationData()).map(
                    ([rate, data], i) => {
                      const strokeColor =
                        i === 0
                          ? colors.Green.Faint
                          : i ===
                              Object.keys(prepareConcentrationData()).length - 1
                            ? colors.Green.Dark
                            : colors.Green.Light;

                      return (
                        <Line
                          key={`rate-${rate}`}
                          type="monotone"
                          data={data}
                          dataKey="y"
                          stroke={strokeColor}
                          name={`${rate} t/ha`}
                        />
                      );
                    }
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MetalCalculator;
