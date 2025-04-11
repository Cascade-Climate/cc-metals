import React from 'react';
import { Box, Tooltip } from '@mui/material';

interface HelperTooltipProps {
  title: string;
}

const HelperTooltip: React.FC<HelperTooltipProps> = ({ title }) => {
  return (
    <Tooltip title={title} arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '1px solid',
          borderColor: 'text.secondary',
          fontSize: '10px',
        }}
      >
        ?
      </Box>
    </Tooltip>
  );
};

export default HelperTooltip;
