import { Box, Typography } from '@mui/material';
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; payload: { x: number } }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
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
        if (Math.abs(item.payload?.x - threshold) < 1) {
          return (
            <Typography key={index} variant="caption" display="block">
              {item.name.replace(/\[(\d+(?:\.\d+)?)\]/, '')} {threshold} mg/kg
            </Typography>
          );
        }
      }
      return null;
    })
    .filter(Boolean);

  const showTooltip = !isEdgeCase && thresholdLines.length > 0;

  return (
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
  );
};

export default CustomTooltip;
