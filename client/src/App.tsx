import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MetalCalculator from './components/MetalCalculator';
import Logo from './assets/logo.png';
import colors from './assets/colors';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.Green.Light,
      dark: colors.Green.Dark,
      light: colors.Green.Faint,
    },
  },
});

const headerHeight = '64px';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: headerHeight,
            bgcolor: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            px: { xs: 1, sm: 2, md: 3 },
            gap: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Box
            component="img"
            sx={{ height: '30px', cursor: 'pointer' }}
            alt="Logo"
            src={Logo}
            onClick={() => window.open('https://cascadeclimate.org/', '_blank')}
          />
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 'normal',
              fontSize: {
                xs: '0.9rem',
                sm: '1rem',
                md: '1.2rem',
                lg: '1.75rem',
                xl: '2rem',
                lineHeight: '1',
              },
            }}
          >
            Metal Accumulation Calculator (MAC)
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 0.5, sm: 1, md: 2 },
              ml: 'auto',
            }}
          >
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: 'white',
                borderColor: 'white',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                lineHeight: '1',
              }}
              onClick={() =>
                window.open(
                  'https://cascadeclimate.org/Cascade-Climate_ERW-MAC%20preset%20model%20results%20slides.pdf',
                  '_blank'
                )
              }
            >
              Preset Model Examples
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: 'white',
                borderColor: 'white',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => window.open('#', '_blank')}
            >
              Tutorial
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: 'white',
                borderColor: 'white',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() =>
                window.open(
                  'https://cascadeclimate.org/blog/metal-accumulation-calculator',
                  '_blank'
                )
              }
            >
              Blog
            </Button>
          </Box>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Box
            sx={{
              p: 2,
              bgcolor: '#f8f9fa',
              borderRadius: 1,
              mx: 3,
              my: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              The ERW-MAC provides a conservative first assessment only. It is
              not a substitute for comprehensive site-specific analysis, expert
              review, or regulatory compliance verification. The simplified
              model intentionally excludes many factors that influence actual
              metal behavior in soils (such as pH, organic matter content, and
              redox conditions), and therefore should be used as one component
              of a broader safety assessment process, not as a definitive
              determination of deployment safety.
            </Typography>
          </Box>
          <MetalCalculator />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
