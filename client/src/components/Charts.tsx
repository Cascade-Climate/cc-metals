import { Box, Paper, Typography } from '@mui/material';
import React from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CalculationResult, ThresholdResult } from '../services/metalsService';
import CustomLegend from './CustomLegend';
import CustomTooltip from './CustomTooltip';

interface ChartsProps {
  result: CalculationResult;
  thresholds: ThresholdResult | null;
}

const Charts: React.FC<ChartsProps> = ({ result, thresholds }) => {
  return (
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
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Box sx={{ width: '33.33%' }} />
          <Box
            sx={{
              width: '33.33%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" mt={5}>
              Soil {result.element} after {result.feedstock_type} application
            </Typography>
          </Box>
          <Box
            sx={{
              width: '33.33%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <CustomLegend concentrations={result.concentrations} />
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
            id="chart"
          >
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
            <Tooltip content={<CustomTooltip />} />
            {thresholds?.Total.map((entry, index) => (
              <Line
                key={`total-${index}`}
                data={[
                  { x: entry.threshold, y: 0 },
                  { x: entry.threshold, y: 100 },
                ]}
                type="monotone"
                dataKey="y"
                name={`${entry.agency} (Total) [${entry.threshold}]`}
                stroke="#000000"
                dot={false}
                strokeWidth={2}
              />
            ))}
            {thresholds?.Aqua_regia.map((entry, index) => (
              <Line
                key={`aqua-${index}`}
                data={[
                  { x: entry.threshold, y: 0 },
                  { x: entry.threshold, y: 100 },
                ]}
                type="monotone"
                dataKey="y"
                name={`${entry.agency} (Aqua regia) [${entry.threshold}]`}
                stroke="#000000"
                strokeDasharray="5,5"
                dot={false}
                strokeWidth={2}
              />
            ))}
            {thresholds?.Other_very_strong_acid.map((entry, index) => (
              <Line
                key={`other-${index}`}
                data={[
                  { x: entry.threshold, y: 0 },
                  { x: entry.threshold, y: 100 },
                ]}
                type="monotone"
                dataKey="y"
                name={`${entry.agency} (Other) [${entry.threshold}]`}
                stroke="#000000"
                strokeDasharray="1,1"
                dot={false}
                strokeWidth={2}
              />
            ))}
            {Object.entries(result.concentrations).map(([rate, kde], index) => (
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
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default Charts;
