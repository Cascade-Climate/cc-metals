import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MetalCalculator from './components/MetalCalculator';
import Logo from './assets/logo.png';
import colors from './assets/colors';

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

// Define the header height
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
            px: 3,
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
              p: 3,
              color: 'white',
              fontWeight: 'normal',
              whiteSpace: 'nowrap',
            }}
          >
            Metal Accumulation Calculator (MAC)
          </Typography>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <MetalCalculator />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
