import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  CalculationResult,
  getThresholds,
  ThresholdResult,
} from '../services/metalsService';
import Charts from './Charts';
import CalculatorInput from './CalculatorInput';

const MetalCalculator: React.FC = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [thresholds, setThresholds] = useState<ThresholdResult | null>(null);

  useEffect(() => {
    const loadThresholds = async () => {
      if (result?.element) {
        const thresholds = await getThresholds(result.element);
        setThresholds(thresholds);
      } else {
        setThresholds(null);
      }
    };
    void loadThresholds().catch(console.warn);
  }, [result]);

  return (
    <Box height="100%" width="100%" mb={5}>
      <CalculatorInput setResult={setResult} />
      {result && <Charts result={result} thresholds={thresholds} />}
    </Box>
  );
};

export default MetalCalculator;
