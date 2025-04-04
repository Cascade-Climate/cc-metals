import { Grid, TextField, Typography } from '@mui/material';
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
    <Grid container spacing={1} sx={{ width: '100%' }}>
      <Grid>
        <Typography variant="h6" gutterBottom>
          Name of Element and Feedstock Type (optional)
        </Typography>
        <Grid container spacing={2}>
          <Grid>
            <TextField
              fullWidth
              label="Element"
              value={customParams.element}
              onChange={(e) =>
                setCustomParams({
                  ...customParams,
                  element: e.target.value,
                })
              }
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
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
      <Grid>
        <Typography variant="h6" gutterBottom>
          Soil Parameters
        </Typography>
        <Grid container spacing={2}>
          <Grid>
            <TextField
              fullWidth
              label="Metal Concentration (mg/kg)"
              type="number"
              value={customParams.soil_conc}
              onChange={handleCustomParamChange('soil_conc')}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Metal Concentration Error (stdev)"
              type="number"
              value={customParams.soil_conc_sd}
              onChange={handleCustomParamChange('soil_conc_sd')}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Soil Depth (m)"
              type="number"
              value={customParams.soil_d}
              onChange={handleCustomParamChange('soil_d')}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Soil Depth Error (stdev)"
              type="number"
              value={customParams.soil_d_err}
              onChange={handleCustomParamChange('soil_d_err')}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Soil Bulk Density (g/cm^3)"
              type="number"
              value={customParams.dbd}
              onChange={handleCustomParamChange('dbd')}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Soil Bulk Density Error (stdev)"
              type="number"
              value={customParams.dbd_err}
              onChange={handleCustomParamChange('dbd_err')}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <Typography variant="h6" gutterBottom>
          Feedstock Parameters
        </Typography>
        <Grid container spacing={2}>
          <Grid>
            <TextField
              fullWidth
              label="Metal Concentration (mg/kg)"
              type="number"
              value={customParams.feed_conc}
              onChange={handleCustomParamChange('feed_conc')}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Metal Concentration Error (stdev)"
              type="number"
              value={customParams.feed_conc_sd}
              onChange={handleCustomParamChange('feed_conc_sd')}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Ton Feedstock/Application (t/ha)"
              type="number"
              value={customParams.application_rate}
              onChange={handleCustomParamChange('application_rate')}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomParameters;
