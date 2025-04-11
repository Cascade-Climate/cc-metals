import { Box, Typography } from '@mui/material';
import React from 'react';
import { formatNumber } from '../utils/formatNumber';

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; payload: { x: number } }[];
  labelColorMap: Record<string, string>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  labelColorMap,
}) => {
  if (!active || !payload) return null;
  // Weird edge case where the payload is based on the y value of 0, causing the tooltip
  // to show every item. This is a hacky way to check for that.
  const isEdgeCase = (() => {
    const thresholds = new Set<number>();
    const allMatchThreshold = payload.every((item) => {
      const thresholdMatch = item.name.match(/\[(\d+(?:\.\d+)?)\]/);
      if (thresholdMatch) {
        const threshold = parseFloat(thresholdMatch[1]);
        thresholds.add(threshold);
        return Math.abs(item.payload?.x - threshold) === 0;
      }
      return true;
    });
    return allMatchThreshold && thresholds.size > 1;
  })();

  const thresholdLines = payload
    .map((item, index) => {
      const thresholdMatch = item.name.match(/\[(\d+(?:\.\d+)?)\]/);
      if (thresholdMatch) {
        const threshold = parseFloat(thresholdMatch[1]);
        const getThresholdTolerance = (threshold: number): number => {
          if (threshold <= 1) return 0.05;
          if (threshold <= 10) return 0.5;
          return 1;
        };

        if (
          Math.abs(item.payload?.x - threshold) <
          getThresholdTolerance(threshold)
        ) {
          // Extract label name from the item name (format: "Label (Type) [Threshold]")
          const label = item.name.split(' (')[0];
          const color = labelColorMap[label] || '#000000'; // Default to black if not found

          return (
            <Typography
              key={index}
              variant="caption"
              display="block"
              sx={{ color }}
            >
              {item.name.replace(/\[(\d+(?:\.\d+)?)\]/, '')} {threshold} mg/kg
            </Typography>
          );
        }
      }
      return null;
    })
    .filter(Boolean);

  const showTooltip = !isEdgeCase && thresholdLines.length > 0;
  const xValue = payload[0]?.payload?.x;

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'white',
          p: 0.5,
          border: '1px solid #ccc',
          borderRadius: 1,
          fontSize: '0.7rem',
          whiteSpace: 'nowrap',
        }}
      >
        {xValue ? `${formatNumber(xValue)} mg/kg` : ''}
      </Box>
      <Box
        sx={{
          bgcolor: showTooltip ? 'white' : 'transparent',
          p: 1,
          border: showTooltip ? '1px solid #ccc' : 'none',
          borderRadius: 1,
          boxShadow: showTooltip ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
          opacity: showTooltip ? 1 : 0.01,
        }}
      >
        {thresholdLines}
      </Box>
    </>
  );
};

export default CustomTooltip;
