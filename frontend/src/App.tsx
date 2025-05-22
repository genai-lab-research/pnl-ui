// React import is required by JSX transpilation
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppRouter } from './router';
import './index.css';
import './App.css';

// Create a Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#4caf50',
    },
    background: {
      default: '#f8f9ff',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8f9ff',
        },
      },
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;