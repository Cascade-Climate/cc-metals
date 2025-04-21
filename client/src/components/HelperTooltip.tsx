import React, { useState } from 'react';
import { Box, Tooltip, ClickAwayListener } from '@mui/material';

interface HelperTooltipProps {
  title: string;
}

const HelperTooltip: React.FC<HelperTooltipProps> = ({ title }) => {
  const [open, setOpen] = useState(false);

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Box>
        <Tooltip
          title={title}
          arrow
          open={open}
          onClose={handleTooltipClose}
          disableFocusListener
          disableTouchListener
        >
          <Box
            onClick={handleTooltipOpen}
            onMouseEnter={handleTooltipOpen}
            onMouseLeave={handleTooltipClose}
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
              cursor: 'pointer',
            }}
          >
            ?
          </Box>
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
};

export default HelperTooltip;
