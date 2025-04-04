import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import colors from '../assets/colors';

interface ToggleModeProps {
  isCustom: boolean;
  setIsCustom: (value: boolean) => void;
}

const ToggleMode: React.FC<ToggleModeProps> = ({ isCustom, setIsCustom }) => {
  return (
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
  );
};

export default ToggleMode;
