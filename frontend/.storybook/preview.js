import '../src/styles/tailwind.css';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a basic theme for Material UI components
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // blue-600
    },
    secondary: {
      main: '#4b5563', // gray-600
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;