import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
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
import DomainSlider from './DomainSlider';
import { formatNumber } from '../utils/formatNumber';

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

const regulationColors = [
  '#CC3333', // vibrant dark red
  '#CC8033', // burnt orange
  '#AAAA33', // mustard
  '#33AA33', // emerald green
  '#3366CC', // royal blue
  '#8833CC', // violet
  '#CC3399', // fuchsia
  '#996633', // brown
  '#333333', // black
  '#33CCAA', // turquoise
];

const Charts: React.FC<ChartsProps> = ({ result, thresholds }) => {
  const [distributionXDomain, setDistributionXDomain] = useState<
    [number, number]
  >([0, 500]);
  const [concentrationXDomain, setConcentrationXDomain] = useState<
    [number, number]
  >([0, 500]);

  // Create a consistent color mapping for agencies
  const [agencyColorMap, setAgencyColorMap] = useState<Record<string, string>>(
    {}
  );

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

  const minDistributionXDomain = Math.min(
    ...result.distributions.feedstock.x,
    ...result.distributions.soil.x
  );
  const maxDistributionXDomain = Math.max(
    ...result.distributions.feedstock.x,
    ...result.distributions.soil.x
  );

  const initialMinConcentrationXDomain = Math.min(
    ...Object.values(result.concentrations).flatMap((kde) => kde.x)
  );
  const initialMaxConcentrationXDomain = calculateDomainUpperBound(
    Math.max(...Object.values(result.concentrations).flatMap((kde) => kde.x))
  );

  // const minConcentrationXDomain = Math.min(
  //   minConcentration,
  //   ...(thresholds?.Total?.map((t) => t.threshold) || []),
  //   ...(thresholds?.Aqua_regia?.map((t) => t.threshold) || []),
  //   ...(thresholds?.Other_very_strong_acid?.map((t) => t.threshold) || [])
  // );
  const minConcentrationXDomain = 0;
  const maxConcentrationXDomain = calculateDomainUpperBound(
    Math.max(
      initialMaxConcentrationXDomain,
      ...(thresholds?.Total?.map((t) => t.threshold) || []),
      ...(thresholds?.Aqua_regia?.map((t) => t.threshold) || []),
      ...(thresholds?.Other_very_strong_acid?.map((t) => t.threshold) || [])
    )
  );

  useEffect(() => {
    setDistributionXDomain([minDistributionXDomain, maxDistributionXDomain]);
    setConcentrationXDomain([
      initialMinConcentrationXDomain,
      initialMaxConcentrationXDomain,
    ]);
  }, [result, thresholds]);

  useEffect(() => {
    if (!thresholds) return;

    // Collect all unique agencies
    const agencies = new Set<string>();
    [
      ...thresholds.Total,
      ...thresholds.Aqua_regia,
      ...thresholds.Other_very_strong_acid,
    ].forEach((entry) => {
      agencies.add(entry.agency);
    });

    // Assign colors to agencies
    const colorMap: Record<string, string> = {};
    Array.from(agencies).forEach((agency, index) => {
      colorMap[agency] = regulationColors[index % regulationColors.length];
    });

    setAgencyColorMap(colorMap);
  }, [thresholds]);

  // Get color for a specific agency
  const getAgencyColor = (agency: string) => {
    return agencyColorMap[agency] || '#000000'; // Default to black if not found
  };

  return (
    <Box
      sx={{
        pr: {
          xs: 2,
          sm: 2,
          md: 4,
          lg: 5,
        },
        pb: 2,
      }}
    >
      <Box>
        <Typography variant="subtitle1" align="center" mb={1}>
          Feedstock and soil {result.element} distributions
        </Typography>
        <Box sx={{ width: '100%' }}>
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
                domain={distributionXDomain}
                allowDataOverflow={true}
                tickCount={9}
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <YAxis
                label={{
                  value: 'Probability Density',
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
              <Tooltip
                content={<CustomTooltip agencyColorMap={agencyColorMap} />}
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
                activeDot={false}
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
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <Box sx={{ width: '100%', pl: '55px', pr: '5px' }}>
            <DomainSlider
              onDomainChange={setDistributionXDomain}
              min={minDistributionXDomain}
              max={maxDistributionXDomain}
            />
          </Box>
        </Box>
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
          <Typography variant="subtitle1" mt={2}>
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
              domain={concentrationXDomain}
              allowDataOverflow={true}
              tickCount={9}
              tick={{ fontSize: 12 }}
              tickFormatter={formatNumber}
            />
            <YAxis
              label={{
                value: 'Probability Density',
                angle: -90,
                position: 'outsideLeft',
                fontSize: 12,
              }}
              domain={[0, 'auto']}
              tick={false}
            />
            <Tooltip
              content={<CustomTooltip agencyColorMap={agencyColorMap} />}
            />
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
                dot={false}
                strokeWidth={2}
                activeDot={false}
                stroke={getAgencyColor(entry.agency)}
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
                strokeDasharray="5,5"
                dot={false}
                strokeWidth={2}
                activeDot={false}
                stroke={getAgencyColor(entry.agency)}
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
                strokeDasharray="1,1"
                dot={false}
                strokeWidth={2}
                activeDot={false}
                stroke={getAgencyColor(entry.agency)}
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
            {/* Invisible filler line to allow tooltip hover over entire chart */}
            <Line
              data={Array.from({ length: 100 }, (_, i) => {
                const step =
                  (maxConcentrationXDomain - minConcentrationXDomain) / 99;
                const x = minConcentrationXDomain + i * step;
                return { x, y: 0 };
              })}
              type="monotone"
              dataKey="y"
              stroke="transparent"
              dot={false}
              activeDot={false}
              strokeWidth={0}
            />
          </LineChart>
        </ResponsiveContainer>
        <Box sx={{ width: '100%', pl: '55px', pr: '5px' }}>
          <DomainSlider
            onDomainChange={setConcentrationXDomain}
            min={minConcentrationXDomain}
            max={maxConcentrationXDomain}
            initialMin={initialMinConcentrationXDomain}
            initialMax={initialMaxConcentrationXDomain}
          />
        </Box>
      </Box>
      <Regulations thresholds={thresholds} agencyColorMap={agencyColorMap} />
    </Box>
  );
};

export default Charts;
