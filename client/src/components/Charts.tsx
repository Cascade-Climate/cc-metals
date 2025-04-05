import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { CalculationResult, ThresholdResult } from '../services/metalsService';
import CustomLegend from './CustomLegend';
import CustomTooltip from './CustomTooltip';
import Regulations from './Regulations';

interface ChartsProps {
  result: CalculationResult;
  thresholds: ThresholdResult | null;
}

const applicationRateColors = [
  '#003366', // dark blue
  '#0055a3', // medium blue
  '#0088ff', // very light blue
  '#009933', // dark green
  '#00b359', // medium green
  '#00cc66', // bright green
];

const Charts: React.FC<ChartsProps> = ({ result, thresholds }) => {
  const calculateDomainUpperBound = (max: number): number => {
    const exponent = Math.floor(Math.log10(max));
    const fraction = max / Math.pow(10, exponent);
    let scaleFactor = 1;

    if (fraction <= 1.2) scaleFactor = 1.2;
    else if (fraction <= 1.5) scaleFactor = 1.5;
    else if (fraction <= 2) scaleFactor = 2;
    else if (fraction <= 2.5) scaleFactor = 2.5;
    else if (fraction <= 3) scaleFactor = 3;
    else if (fraction <= 4) scaleFactor = 4;
    else if (fraction <= 5) scaleFactor = 5;
    else if (fraction <= 6) scaleFactor = 6;
    else if (fraction <= 7) scaleFactor = 7;
    else if (fraction <= 8) scaleFactor = 8;
    else if (fraction <= 9) scaleFactor = 9;
    else scaleFactor = 10;

    return scaleFactor * Math.pow(10, exponent);
  };

  return (
    <Box sx={{ pr: 5 }}>
      <Box>
        <Typography variant="subtitle1" align="center" mb={1}>
          Feedstock and soil {result.element} distributions
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
            <Legend
              verticalAlign="top"
              align="right"
              iconType="plainline"
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => (
                <span style={{ color: 'black' }}>{value}</span>
              )}
            />
            <XAxis
              dataKey="x"
              type="number"
              label={{
                fontSize: 12,
                value: `${result.element} concentration (mg/kg)`,
                position: 'bottom',
              }}
              domain={[0, 'auto']}
              allowDataOverflow={true}
              tickCount={9}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: 'Density',
                angle: -90,
                position: 'outsideLeft',
                fontSize: 12,
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
      <Box>
        <Box
          sx={{
            display: 'flex',
            mb: 2,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle1" mt={5}>
            Soil {result.element} after {result.feedstock_type} application
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 2,
          }}
        >
          <CustomLegend
            concentrations={result.concentrations}
            colors={applicationRateColors}
          />
        </Box>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
            <XAxis
              dataKey="x"
              type="number"
              label={{
                fontSize: 12,
                value: `${result.element} concentration (mg/kg)`,
                position: 'bottom',
              }}
              domain={[
                0,
                calculateDomainUpperBound(
                  Math.max(
                    ...Object.values(result.concentrations).map((kde) =>
                      Math.max(...kde.x)
                    )
                  )
                ),
              ]}
              allowDataOverflow={true}
              tickCount={9}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: 'Density',
                angle: -90,
                position: 'outsideLeft',
                fontSize: 12,
              }}
              domain={[0, 'auto']}
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
                activeDot={false}
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
                name={`${entry.agency} (Aqua Regia) [${entry.threshold}]`}
                stroke="#000000"
                strokeDasharray="5,5"
                dot={false}
                strokeWidth={2}
                activeDot={false}
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
                activeDot={false}
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
                  applicationRateColors[index % applicationRateColors.length]
                }
                dot={false}
                strokeWidth={2}
                activeDot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Regulations thresholds={thresholds} />
    </Box>
  );
};

export default Charts;
