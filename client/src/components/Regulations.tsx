import { Box, Typography } from '@mui/material';
import { ThresholdResult } from '../services/metalsService';

interface RegulationsProps {
  thresholds: ThresholdResult | null;
}

const Regulations: React.FC<RegulationsProps> = ({ thresholds }) => {
  if (!thresholds) return null;
  if (
    !thresholds.Total.length &&
    !thresholds.Aqua_regia.length &&
    !thresholds.Other_very_strong_acid.length
  )
    return null;

  return (
    <Box sx={{ px: 4, pt: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{ textAlign: 'left', fontSize: '0.8rem', fontWeight: 'bold' }}
      >
        Regulations
      </Typography>
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
          .map((entry, index) => (
            <Box
              key={`${entry.agency}-${entry.type}-${index}`}
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
                  stroke={
                    entry.type === 'Aqua Regia'
                      ? '#0000FF'
                      : entry.type === 'Other'
                        ? '#FFA500'
                        : '#FF0000'
                  }
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
              <Typography variant="caption" whiteSpace="nowrap">
                {entry.agency} ({entry.threshold} mg/kg)
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default Regulations;
