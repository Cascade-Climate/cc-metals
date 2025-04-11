import { Box, Typography } from '@mui/material';
import React from 'react';
import HelperTooltip from './HelperTooltip';

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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
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
            <HelperTooltip title="This is the cumulative amount of feedstock that has been added to a single deployment site. Note that this does not have a time component, and should not be read as “annual application rate”." />
          </Box>
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
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
            <HelperTooltip title="The extraction type required by a regulation is described here. Often, regulations require different types of extraction methods for leaching metals to determine soil metal concentrations. It is important to understand which digestion methods a regulation requires for the determination of soil metal concentration so that an ERW practitioner can use the same method and perform an equivalent comparison." />
          </Box>
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
