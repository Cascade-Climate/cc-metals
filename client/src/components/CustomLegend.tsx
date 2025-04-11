import { Box, Typography } from '@mui/material';
import React from 'react';

interface CustomLegendProps {
  concentrations: { [key: string]: { x: number[]; y: number[] } };
  colors: string[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({
  concentrations,
  colors,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              textAlign: 'right',
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem',
              },
              fontWeight: 'bold',
            }}
          >
            Total Feedstock Volume Deployed
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            {Object.keys(concentrations).map((rate, index) => (
              <Box
                key={rate}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{ width: 20, height: 2, bgcolor: colors[index % 10] }}
                />
                <Typography
                  variant="caption"
                  whiteSpace="nowrap"
                  sx={{
                    fontSize: {
                      xs: '0.6rem',
                      sm: '0.7rem',
                      md: '0.75rem',
                    },
                  }}
                >
                  {rate} t/ha
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              textAlign: 'right',
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem',
              },
              fontWeight: 'bold',
            }}
          >
            Extraction Type
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <svg width="20" height="2">
                <line
                  x1="0"
                  y1="1"
                  x2="20"
                  y2="1"
                  stroke="#000000"
                  strokeWidth="2"
                />
              </svg>
              <Typography
                variant="caption"
                sx={{
                  fontSize: {
                    xs: '0.6rem',
                    sm: '0.7rem',
                    md: '0.75rem',
                  },
                }}
              >
                Total
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <svg width="20" height="2">
                <line
                  x1="0"
                  y1="1"
                  x2="20"
                  y2="1"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              </svg>
              <Typography
                variant="caption"
                sx={{
                  fontSize: {
                    xs: '0.6rem',
                    sm: '0.7rem',
                    md: '0.75rem',
                  },
                }}
              >
                Aqua Regia
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <svg width="20" height="2">
                <line
                  x1="0"
                  y1="1"
                  x2="20"
                  y2="1"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeDasharray="1,1"
                />
              </svg>
              <Typography
                variant="caption"
                sx={{
                  fontSize: {
                    xs: '0.6rem',
                    sm: '0.7rem',
                    md: '0.75rem',
                  },
                }}
              >
                Other (Very Strong Acid)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomLegend;
