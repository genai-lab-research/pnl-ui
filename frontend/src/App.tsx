import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, AutoLogin } from './context/AuthContext';
import { AppRouter } from './router';
import { shouldAutoLogin } from './utils/env';
import { GlobalStyle } from './styles/global';
import { theme as styledTheme } from './styles/theme';
import './styles/tailwind.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#F7F9FD',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F7F9FD',
        },
      },
    },
  },
});

function App() {
  return (
    <StyledThemeProvider theme={styledTheme}>
      <MuiThemeProvider theme={theme}>
        <GlobalStyle />
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <AutoLogin 
              enabled={shouldAutoLogin()} 
            />
            <AppRouter />
          </AuthProvider>
        </BrowserRouter>
      </MuiThemeProvider>
    </StyledThemeProvider>
  );
}

export default App;