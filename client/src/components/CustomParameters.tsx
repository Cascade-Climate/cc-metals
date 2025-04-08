import { Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React from 'react';
import { CustomCalculationParams } from '../services/metalsService';

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
      setCustomParams({
        ...customParams,
        [field]: parseFloat(event.target.value) || 0,
      });
    };

  return (
    <Grid container spacing={1} sx={{ width: '100%', mt: 1 }}>
      <Grid>
        <Typography variant="subtitle2" mb={1.5}>
          Soil Parameters
        </Typography>
        <Grid container spacing={2}>
          <Grid>
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
          </Grid>
          <Grid minWidth={170}>
            <TextField
              fullWidth
              size="small"
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
              }}
              label="Metal Concentration Error (stdev)"
              type="number"
              value={customParams.soil_conc_sd}
              onChange={handleCustomParamChange('soil_conc_sd')}
            />
          </Grid>
          <Grid>
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
          </Grid>
          <Grid>
            <TextField
              fullWidth
              size="small"
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
              }}
              label="Soil Depth Error (stdev)"
              type="number"
              value={customParams.soil_d_err}
              onChange={handleCustomParamChange('soil_d_err')}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
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
          </Grid>
          <Grid>
            <TextField
              fullWidth
              size="small"
              sx={{
                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
              }}
              label="Soil Bulk Density Error (stdev)"
              type="number"
              value={customParams.dbd_err}
              onChange={handleCustomParamChange('dbd_err')}
            />
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
              <Grid>
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
              </Grid>
              <Grid minWidth={170}>
                <TextField
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  }}
                  label="Metal Concentration Error (stdev)"
                  type="number"
                  value={customParams.feed_conc_sd}
                  onChange={handleCustomParamChange('feed_conc_sd')}
                />
              </Grid>
              <Grid minWidth={170}>
                <TextField
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  }}
                  label="Ton Feedstock/Hectare (t/ha)"
                  type="number"
                  value={customParams.application_rate}
                  onChange={handleCustomParamChange('application_rate')}
                />
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
                        alignItems: 'center'
                      },
                      '& .MuiMenuItem-root': { fontSize: '0.8rem' }
                    }}
                  >
                    {['Ag', 'As', 'Be', 'Cd', 'Co', 'Cr', 'Cu', 'Hg', 'Mn', 'Ni', 'Pb', 'Sb', 'Se', 'V', 'Zn'].map((elem) => (
                      <MenuItem key={elem} value={elem}>
                        {elem}
                      </MenuItem>
                    ))}
                    <MenuItem value="[Custom element]">[Custom element]</MenuItem>
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomParameters;
