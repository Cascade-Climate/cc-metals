import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import React from 'react';
import { CustomCalculationParams } from '../services/metalsService';
import defaultParameters from '../custom-parameters/defaultParameters';
import HelperTooltip from './HelperTooltip';

interface CustomParametersProps {
  customParams: CustomCalculationParams;
  setCustomParams: (params: CustomCalculationParams) => void;
}

const CustomParameters: React.FC<CustomParametersProps> = ({
  customParams,
  setCustomParams,
}) => {
  const handleCustomParamChange =
    (field: keyof CustomCalculationParams) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setCustomParams({
        ...customParams,
        [field]: value === '' ? '' : parseFloat(value) || 0,
      });
    };

  const handleReset = () => {
    setCustomParams({ ...defaultParameters });
  };

  return (
    <Grid container spacing={1} sx={{ width: '100%', mt: 2 }}>
      <Grid>
        <Typography variant="subtitle2" mb={1.5}>
          Soil Parameters
        </Typography>
        <Grid container spacing={2}>
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              size="small"
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
              }}
              label="Metal Concentration (mg/kg)"
              type="number"
              value={customParams.soil_conc}
              onChange={handleCustomParamChange('soil_conc')}
            />
            <Box sx={{ ml: -2, mt: -7 }}>
              <HelperTooltip title="This is the mean measured concentration of the metal in the soil, reported as mg/kg." />
            </Box>
          </Grid>
          <Grid
            minWidth={215}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              fullWidth
              size="small"
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
              }}
              label="Metal Concentration Error (stdev mg/kg)"
              type="number"
              value={customParams.soil_conc_sd}
              onChange={handleCustomParamChange('soil_conc_sd')}
            />
            <Box sx={{ ml: -2, mt: -7 }}>
              <HelperTooltip title="This is the error of your measured concentration of the metal in the soil, reported as one standard deviation from the mean." />
            </Box>
          </Grid>
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
            width={95}
          >
            <TextField
              size="small"
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
              }}
              label="Soil Depth (m)"
              type="number"
              value={customParams.soil_d}
              onChange={handleCustomParamChange('soil_d')}
            />
            <Box sx={{ ml: -2, mt: -7 }}>
              <HelperTooltip title="This is the depth at which your feedstock will be distributed in the soil, reported as meters." />
            </Box>
          </Grid>

          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
            width={145}
          >
            <TextField
              size="small"
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
              }}
              label="Soil Bulk Density (g/cm^3)"
              type="number"
              value={customParams.dbd}
              onChange={handleCustomParamChange('dbd')}
            />
            <Box sx={{ ml: -2, mt: -7 }}>
              <HelperTooltip title="This is the mean bulk density of your sampled soil, reported as g/cm^3." />
            </Box>
          </Grid>
          <Grid
            minWidth={205}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              fullWidth
              size="small"
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
              }}
              label="Soil Bulk Density Error (stdev g/cm^3)"
              type="number"
              value={customParams.dbd_err}
              onChange={handleCustomParamChange('dbd_err')}
            />
            <Box sx={{ ml: -2, mt: -7 }}>
              <HelperTooltip title="This is the error of your bulk density of your sampled soil, reported as one standard deviation from the mean." />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <Grid container spacing={2}>
          <Grid>
            <Typography variant="subtitle2" mb={1.5}>
              Feedstock Parameters
            </Typography>
            <Grid container spacing={2}>
              <Grid
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                width={165}
              >
                <TextField
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  }}
                  label="Metal Concentration (mg/kg)"
                  type="number"
                  value={customParams.feed_conc}
                  onChange={handleCustomParamChange('feed_conc')}
                />
                <Box sx={{ ml: -2, mt: -7 }}>
                  <HelperTooltip title="This is the mean measured concentration of the metal in your feedstock." />
                </Box>
              </Grid>
              <Grid
                minWidth={215}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  }}
                  label="Metal Concentration Error (stdev mg/kg)"
                  type="number"
                  value={customParams.feed_conc_sd}
                  onChange={handleCustomParamChange('feed_conc_sd')}
                />
                <Box sx={{ ml: -2, mt: -7 }}>
                  <HelperTooltip title="This is the error of your measured concentration of the metal in the feedstock, reported as one standard deviation from the mean." />
                </Box>
              </Grid>
              <Grid
                minWidth={210}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  }}
                  label="Cumulative Feedstock Application (t/ha)"
                  type="number"
                  value={customParams.application_rate}
                  onChange={handleCustomParamChange('application_rate')}
                />
                <Box sx={{ ml: -2, mt: -7 }}>
                  <HelperTooltip title="This is the total cumulative volume of feedstock deployed per hectare in a single deployment. " />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <Typography variant="subtitle2" mb={1.5}>
              Element and Feedstock Type (optional)
            </Typography>
            <Grid container spacing={2}>
              <Grid>
                <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
                  <InputLabel sx={{ fontSize: '0.8rem' }}>Element</InputLabel>
                  <Select
                    value={customParams.element}
                    onChange={(e) =>
                      setCustomParams({
                        ...customParams,
                        element: e.target.value,
                      })
                    }
                    label="Element"
                    sx={{
                      '& .MuiSelect-select': {
                        fontSize: '0.8rem',
                        maxHeight: '15px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                      '& .MuiMenuItem-root': { fontSize: '0.8rem' },
                    }}
                  >
                    {[
                      'Ag',
                      'As',
                      'Be',
                      'Cd',
                      'Co',
                      'Cr',
                      'Cu',
                      'Hg',
                      'Mn',
                      'Ni',
                      'Pb',
                      'Sb',
                      'Se',
                      'V',
                      'Zn',
                    ].map((elem) => (
                      <MenuItem key={elem} value={elem}>
                        {elem}
                      </MenuItem>
                    ))}
                    <MenuItem value="[Custom element]">No regulation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  }}
                  label="Feedstock Type"
                  value={customParams.feedstock_type}
                  onChange={(e) =>
                    setCustomParams({
                      ...customParams,
                      feedstock_type: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleReset}
                  sx={{
                    fontSize: '0.5rem',
                    borderRadius: '25px',
                    height: '25px',
                  }}
                >
                  Reset to Default
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomParameters;
