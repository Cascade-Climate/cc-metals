import { Box, Typography } from '@mui/material';
import { ThresholdResult } from '../services/metalsService';
import HelperTooltip from './HelperTooltip';

interface RegulationsProps {
  thresholds: ThresholdResult | null;
  labelColorMap: Record<string, string>;
}

const Regulations: React.FC<RegulationsProps> = ({
  thresholds,
  labelColorMap,
}) => {
  if (!thresholds) return null;
  if (
    !thresholds.Total.length &&
    !thresholds.Aqua_regia.length &&
    !thresholds.Other_very_strong_acid.length
  )
    return null;

  return (
    <Box sx={{ px: 4, pt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ textAlign: 'left', fontSize: '0.8rem', fontWeight: 'bold' }}
        >
          Regulations
        </Typography>
        <HelperTooltip title="These regulations are a preliminary compilation of soil concentration thresholds that are in national- or international-level legislation." />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 1,
          px: 1,
        }}
      >
        {[
          ...thresholds.Total.map((entry) => ({ ...entry, type: 'Total' })),
          ...thresholds.Aqua_regia.map((entry) => ({
            ...entry,
            type: 'Aqua Regia',
          })),
          ...thresholds.Other_very_strong_acid.map((entry) => ({
            ...entry,
            type: 'Other',
          })),
        ]
          .sort((a, b) => a.threshold - b.threshold)
          .map((entry) => (
            <Box
              key={`${entry.label}-${entry.type}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1,
              }}
            >
              <svg width="20" height="2">
                <line
                  x1="0"
                  y1="1"
                  x2="20"
                  y2="1"
                  stroke={labelColorMap[entry.label] || '#000000'}
                  strokeWidth="2"
                  strokeDasharray={
                    entry.type === 'Aqua Regia'
                      ? '4,4'
                      : entry.type === 'Other'
                        ? '1,1'
                        : undefined
                  }
                />
              </svg>
              <Typography
                variant="caption"
                whiteSpace="nowrap"
                sx={{ color: labelColorMap[entry.label] || '#000000' }}
              >
                {entry.label} ({entry.threshold} mg/kg)
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default Regulations;
