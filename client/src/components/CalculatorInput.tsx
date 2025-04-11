import {
  Button,
  CircularProgress,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import colors from '../assets/colors';
import {
  calculateCustomConcentrations,
  calculatePresetConcentrations,
  CalculationResult,
  CustomCalculationParams,
  getElements,
  PresetCalculationParams,
} from '../services/metalsService';
import CustomParameters from './CustomParameters';
import PresetParameters from './PresetParameters';
import ToggleMode from './ToggleMode';
import defaultParameters from '../custom-parameters/defaultParameters';

interface CalculatorInputProps {
  setResult: (result: CalculationResult) => void;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({ setResult }) => {
  const [elements, setElements] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [feedstockType, setFeedstockType] = useState<string>('basalt');
  const [loading, setLoading] = useState<boolean>(false);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const [customParams, setCustomParams] =
    useState<CustomCalculationParams>(defaultParameters);

  useEffect(() => {
    const loadElements = async () => {
      const elementsList = await getElements(feedstockType);
      setElements(elementsList);
      setSelectedElement('');
    };
    void loadElements().catch(console.warn);
  }, [feedstockType]);

  const handleCalculate = async () => {
    setLoading(true);

    try {
      if (isCustom) {
        const updatedElement =
          customParams.element === ''
            ? '[Custom element]'
            : customParams.element;
        const updatedFeedstockType =
          customParams.feedstock_type === ''
            ? '[Custom feedstock]'
            : customParams.feedstock_type;

        if (customParams.element === '' || customParams.feedstock_type === '') {
          setCustomParams({
            ...customParams,
            element: updatedElement,
            feedstock_type: updatedFeedstockType,
          });
        }

        const data = await calculateCustomConcentrations({
          ...customParams,
          element: updatedElement,
          feedstock_type: updatedFeedstockType,
        });
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
    <Paper sx={{ p: 2, mb: 2, borderRadius: 0 }}>
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleCalculate}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            bgcolor: colors.Green.Light,
            py: 1,
            px: 3,
            fontSize: '0.8rem',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </Button>
        {loading && (
          <Typography
            variant="body2"
            sx={{
              fontStyle: 'italic',
              color: 'text.secondary',
              fontSize: {
                xs: '0.75rem',
                sm: '0.8rem',
                md: '0.85rem',
                lg: '0.9rem',
              },
            }}
          >
            Please wait. Calculations can take up to 15 seconds.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CalculatorInput;
