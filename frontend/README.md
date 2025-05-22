# Vertical Farming Frontend

This is the frontend application for the Vertical Farming Control Panel. It's built using React, TypeScript, and Material-UI, providing a modern and responsive user interface for managing vertical farming operations.

## Features

- Container management dashboard 
- Performance metrics visualization
- Interactive data tables and charts
- Responsive design for desktop and tablet
- Material Design UI components

## Technology Stack

- **React**: Frontend library for building user interfaces
- **TypeScript**: Typed JavaScript for safer code
- **Vite**: Next generation frontend tooling
- **Material UI**: React components that implement Google's Material Design
- **React Router**: Declarative routing for React applications
- **Storybook**: Tool for developing UI components in isolation

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Installation

1. Clone the repository (if not already done)
   ```bash
   git clone https://github.com/your-repo/pnl-artifacts-1page.git
   cd pnl-artifacts-1page/demo/frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server
   ```bash
   npm run dev
   ```

2. The application will be available at http://localhost:5173 (or the URL shown in the terminal)

## Building for Production

To create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Storybook

This project uses Storybook for component development and documentation.

1. Start Storybook
   ```bash
   npm run storybook
   ```

2. Storybook will be available at http://localhost:6006

## Project Structure

```
frontend/
├── public/               # Public assets
├── src/
│   ├── App.tsx           # Main application component
│   ├── assets/           # Static assets like images
│   ├── components/       # Shared UI components
│   ├── context/          # React context providers
│   ├── features/         # Feature-specific components
│   │   ├── containers/   # Container management feature
│   │   └── metrics/      # Metrics visualization feature
│   ├── router/           # Application routing
│   ├── shared/           # Shared utilities and components
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions and API services
│   └── styles/           # Global styles and theme
├── stories/              # Storybook stories
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Key Components

The application includes several reusable UI components:

- **DataTable**: Interactive data table with sorting and filtering
- **StatContainer**: Container for displaying statistics with charts
- **BarChart**: Component for visualizing data in bar chart format
- **StatusChip**: Chips for displaying status information
- **NavigationBar**: Top navigation bar for the application

## API Integration

The frontend integrates with the backend API through services defined in `src/shared/utils/api.ts`. These services provide methods for fetching and updating data from the backend.

## Available Scripts

- `npm run dev`: Run the development server
- `npm run build`: Build for production
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint to check for code issues
- `npm run storybook`: Run Storybook for component development
- `npm run build-storybook`: Build Storybook for deployment

## Dependencies

- React and React DOM for UI rendering
- Material-UI for components and styling
- React Router for navigation
- TypeScript for type checking
- Vite for fast development and building
- Storybook for component documentation

## License

This project is licensed under the MIT License. See the LICENSE file for details.