import { formatNumber } from '../utils/formatNumber';
import { Box, Button, Slider, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface DomainSliderProps {
  onDomainChange: (domain: [number, number]) => void;
  max: number;
  min: number;
  initialMin: number;
  initialMax: number;
  onClickSyncButton: () => void;
  syncCounter: number;
  minDistance?: number;
}

const DomainSlider: React.FC<DomainSliderProps> = ({
  onDomainChange,
  min,
  max,
  initialMin,
  initialMax,
  onClickSyncButton,
  syncCounter,
  minDistance = 0.2,
}) => {
  const [value, setValue] = useState<[number, number]>([
    initialMin ?? min,
    initialMax ?? max,
  ]);

  useEffect(() => {
    setValue([initialMin ?? min, initialMax ?? max]);
  }, [initialMin, initialMax, min, max, syncCounter]);

  const handleChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) return;

    // Apply minimum distance constraint
    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], max - minDistance);
        newValue = [clamped, clamped + minDistance];
      } else {
        const clamped = Math.max(newValue[1], min + minDistance);
        newValue = [clamped - minDistance, clamped];
      }
    }
    setValue(newValue as [number, number]);
    onDomainChange(newValue as [number, number]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
          min: {formatNumber(min)}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{
              fontSize: '0.5rem',
              textTransform: 'none',
              ml: 0.5,
              fontWeight: 'bold',
            }}
            onClick={onClickSyncButton}
          >
            Sync x-axis
          </Button>
        </Box>
        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
          max: {formatNumber(max)}
        </Typography>
      </Box>
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
    </Box>
  );
};

export default DomainSlider;
