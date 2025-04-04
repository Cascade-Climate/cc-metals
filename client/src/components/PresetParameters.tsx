import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

interface PresetParametersProps {
  feedstockType: string;
  setFeedstockType: (value: string) => void;
  selectedElement: string;
  setSelectedElement: (value: string) => void;
  elements: string[];
}

const PresetParameters: React.FC<PresetParametersProps> = ({
  feedstockType,
  setFeedstockType,
  selectedElement,
  setSelectedElement,
  elements,
}) => {
  return (
    <Grid container spacing={3} sx={{ width: '100%' }}>
      <Grid width="40%">
        <FormControl fullWidth>
          <InputLabel>Feedstock Type</InputLabel>
          <Select
            value={feedstockType}
            onChange={(e) => setFeedstockType(e.target.value)}
            label="Feedstock Type"
          >
            <MenuItem value="basalt">Basalt</MenuItem>
            <MenuItem value="peridotite">Peridotite</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid width="40%">
        <FormControl fullWidth>
          <InputLabel>Element</InputLabel>
          <Select
            value={selectedElement}
            onChange={(e) => setSelectedElement(e.target.value)}
            label="Element"
          >
            {elements.map((elem) => (
              <MenuItem key={elem} value={elem}>
                {elem}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default PresetParameters;
