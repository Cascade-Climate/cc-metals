import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TermsOfUseModalProps {
  open: boolean;
  onAgree: () => void;
}

const ACKNOWLEDGMENTS = [
  'You will not use the output of this tool as a substitute for direct post-deployment measurement of heavy metals in soils, crops, or water.',
  'You will not represent the output of this tool as evidence of regulatory compliance or as fulfillment of monitoring obligations under any carbon crediting protocol.',
  'The accuracy of the tool’s output depends entirely on the quality and representativeness of the input data you provide, and Cascade Climate does not verify or validate user inputs.',
  'You understand that Cascade Climate accepts no liability for decisions made on the basis of this tool’s output, and that site-specific analysis by qualified professionals is required for any deployment safety determination.',
];

function TermsOfUseModal({ open, onAgree }: TermsOfUseModalProps) {
  const [checks, setChecks] = useState<boolean[]>(() =>
    ACKNOWLEDGMENTS.map(() => false)
  );

  const allChecked = checks.every(Boolean);

  const toggle = (index: number) => {
    setChecks((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pr: 4 }}>
        ERW Metal Accumulation Calculator &mdash; Terms of Use
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" paragraph>
          The ERW-MAC is a first-order screening tool designed to provide a
          conservative estimate of potential heavy metal accumulation in soils
          from enhanced rock weathering (ERW) feedstock applications. It is
          intended to support early-stage site selection, feedstock evaluation,
          and preliminary risk assessment.
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>
          What this tool is:
        </Typography>
        <Typography variant="body2" paragraph>
          A simplified mass-balance model that estimates maximum post-application
          metal concentrations based on feedstock composition, application rate,
          and baseline soil concentrations. It is one component of a broader
          safety assessment process.
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>
          What this tool is not:
        </Typography>
        <Typography variant="body2" paragraph>
          The ERW-MAC is not a substitute for direct measurement of heavy metal
          concentrations in soils, crop biomass, porewater, or groundwater. It
          should not be used to satisfy post-deployment monitoring requirements
          under any carbon crediting protocol or regulatory framework. The model
          intentionally excludes factors that influence actual metal behavior in
          soils &mdash; including pH, organic matter content, cation exchange
          capacity, and redox conditions &mdash; and therefore cannot
          characterize real-world metal distribution, speciation, or
          bioavailability at a specific site.
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
          By proceeding, you acknowledge that:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {ACKNOWLEDGMENTS.map((text, index) => (
            <FormControlLabel
              key={index}
              sx={{ alignItems: 'flex-start', m: 0 }}
              control={
                <Checkbox
                  checked={checks[index]}
                  onChange={() => toggle(index)}
                  sx={{ pt: 0.5 }}
                />
              }
              label={<Typography variant="body2">{text}</Typography>}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!allChecked}
          onClick={onAgree}
        >
          I Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TermsOfUseModal;
