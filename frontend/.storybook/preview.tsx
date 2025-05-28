import React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { Preview } from '@storybook/react';

import '../src/styles/tailwind.css';

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

// Create a function that returns the decorator component
// This approach avoids direct JSX in the decorators array
const withThemeProvider = (Story: React.ComponentType) => {
  return (
    <ThemeProvider theme={theme}>
      <div className="p-4">
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [withThemeProvider],
};

export default preview;
