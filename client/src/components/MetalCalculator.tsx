import { Box, Button, CircularProgress, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import colors from '../assets/colors';
import {
  calculateCustomConcentrations,
  calculatePresetConcentrations,
  CalculationResult,
  CustomCalculationParams,
  getElements,
  getThresholds,
  PresetCalculationParams,
  ThresholdResult,
} from '../services/metalsService';
import Charts from './Charts';
import CustomParameters from './CustomParameters';
import PresetParameters from './PresetParameters';
import ToggleMode from './ToggleMode';

const MetalCalculator: React.FC = () => {
  const [elements, setElements] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [feedstockType, setFeedstockType] = useState<string>('basalt');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [thresholds, setThresholds] = useState<ThresholdResult | null>(null);

  const [customParams, setCustomParams] = useState<CustomCalculationParams>({
    element: '',
    feedstock_type: '',
    soil_conc: 15,
    soil_conc_sd: 1,
    soil_d: 0.18,
    soil_d_err: 0.02,
    dbd: 1300,
    dbd_err: 100,
    feed_conc: 1500,
    feed_conc_sd: 250,
    application_rate: 2,
  });

  useEffect(() => {
    const loadElements = async () => {
      const elementsList = await getElements(feedstockType);
      setElements(elementsList);
      setSelectedElement('');
    };
    void loadElements().catch(console.warn);
  }, [feedstockType]);

  useEffect(() => {
    const loadThresholds = async () => {
      if (result?.element) {
        const thresholds = await getThresholds(result.element);
        setThresholds(thresholds);
      }
    };
    void loadThresholds().catch(console.warn);
  }, [result]);

  const handleCalculate = async () => {
    setLoading(true);

    try {
      if (isCustom) {
        if (customParams.element === '') {
          setCustomParams({
            ...customParams,
            element: 'Custom element',
          });
        }
        if (customParams.feedstock_type === '') {
          setCustomParams({
            ...customParams,
            feedstock_type: 'Custom feedstock type',
          });
        }
        const data = await calculateCustomConcentrations(customParams);
        setResult(data);
      } else {
        if (selectedElement === '') {
          return;
        }
        const params: PresetCalculationParams = {
          element: selectedElement,
          feedstock_type: feedstockType,
        };
        const data = await calculatePresetConcentrations(params);
        setResult(data);
      }
    } catch (error) {
      console.warn('Calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box height="100%" width="100%">
      <Paper sx={{ p: 3, mb: 3 }}>
        <ToggleMode isCustom={isCustom} setIsCustom={setIsCustom} />
        {!isCustom ? (
          <PresetParameters
            feedstockType={feedstockType}
            setFeedstockType={setFeedstockType}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            elements={elements}
          />
        ) : (
          <CustomParameters
            customParams={customParams}
            setCustomParams={setCustomParams}
          />
        )}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleCalculate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              bgcolor: colors.Green.Light,
              '&:hover': { bgcolor: colors.Green.Dark },
              py: 1,
              px: 3,
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </Button>
        </Box>
      </Paper>
      {result && <Charts result={result} thresholds={thresholds} />}
    </Box>
  );
};

export default MetalCalculator;
