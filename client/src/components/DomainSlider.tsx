import { formatNumber } from '../utils/formatNumber';
import { Box, Slider, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface DomainSliderProps {
  onDomainChange: (domain: [number, number]) => void;
  max: number;
  min: number;
}

const DomainSlider: React.FC<DomainSliderProps> = ({
  onDomainChange,
  min,
  max,
}) => {
  const [value, setValue] = useState<[number, number]>([min, max]);

  useEffect(() => {
    setValue([min, max]);
  }, [min, max]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setValue(newValue as [number, number]);
      onDomainChange(newValue as [number, number]);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', px: 3 }}>
        <Slider
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          disableSwap
          step={0.01}
          sx={{
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
            },
            '& .MuiSlider-track': {
              height: 2,
            },
            '& .MuiSlider-rail': {
              height: 2,
            },
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          mt: -1,
        }}
      >
        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
          min: {formatNumber(min)}
        </Typography>
        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
          max: {formatNumber(max)}
        </Typography>
      </Box>
    </Box>
  );
};

export default DomainSlider;
