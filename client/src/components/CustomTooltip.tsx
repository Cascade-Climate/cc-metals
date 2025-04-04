import { Box, Typography } from '@mui/material';
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; payload: { x: number } }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload) return null;

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

  return (
    <Box
      sx={{
        bgcolor: thresholdLines.length > 0 ? 'white' : 'transparent',
        p: 1,
        border: thresholdLines.length > 0 ? '1px solid #ccc' : 'none',
        borderRadius: 1,
        boxShadow:
          thresholdLines.length > 0 ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
        opacity: thresholdLines.length > 0 ? 1 : 0.01,
      }}
    >
      {thresholdLines}
    </Box>
  );
};

export default CustomTooltip;
