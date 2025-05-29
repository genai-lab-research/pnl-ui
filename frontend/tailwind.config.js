/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#3f51b5',
          light: '#757de8',
          dark: '#002984',
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5',
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e',
        },
        secondary: {
          main: '#f50057',
          light: '#ff4081',
          dark: '#c51162',
          50: '#fce4ec',
          100: '#f8bbd0',
          200: '#f48fb1',
          300: '#f06292',
          400: '#ec407a',
          500: '#e91e63',
          600: '#d81b60',
          700: '#c2185b',
          800: '#ad1457',
          900: '#880e4f',
        },
        text: {
          primary: 'rgba(0, 0, 0, 0.87)',
          secondary: 'rgba(0, 0, 0, 0.6)',
          disabled: 'rgba(0, 0, 0, 0.38)',
        },
        background: {
          paper: '#ffffff',
          default: '#F7F9FD',
        },
        error: {
          main: '#f44336',
          light: '#e57373',
          dark: '#d32f2f',
        },
        warning: {
          main: '#ff9800',
          light: '#ffb74d',
          dark: '#f57c00',
        },
        info: {
          main: '#2196f3',
          light: '#64b5f6',
          dark: '#1976d2',
        },
        success: {
          main: '#4caf50',
          light: '#81c784',
          dark: '#388e3c',
        },
        // Custom colors from components
        metric: {
          title: '#71717A',      // From MetricCard title
          iconColor: '#9CA3AF',  // From MetricCard icon
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      screens: {
        'xs': '0px',
        'sm': '600px',
        'md': '900px',
        'lg': '1200px',
        'xl': '1536px',
      },
      spacing: {
        // Extend spacing to match Material UI theme if needed
      },
      boxShadow: {
        card: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        dropdown: '0px 4px 16px rgba(0, 0, 0, 0.08)',
        dialog: '0px 8px 32px rgba(0, 0, 0, 0.12)',
        none: 'none',
      },
    },
  },
  // Important to avoid conflicts when using Material UI and Tailwind together
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  // Enable safe MUI integration
  important: '#root',
}
