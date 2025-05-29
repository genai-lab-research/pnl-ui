# React Frontend - Container Management System

## Requirements

* [Node.js](https://nodejs.org/) (version 18 or higher)
* [npm](https://www.npmjs.com/) for package management

## Quick Start

1. **Install dependencies**:
   ```console
   $ npm install
   ```

2. **Start development server**:
   ```console
   $ npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### API Integration

The frontend is configured to automatically:
1. **Connect to backend API** when available at `http://localhost:8000/api`
2. **Fall back to mock data** in development when backend is unavailable
3. **Display status indicator** showing whether real API or mock data is being used

### Environment Configuration

Create `.env.local` file for custom configuration:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Enable mock data fallback in development
VITE_ENABLE_MOCK_FALLBACK=true

# API timeout in milliseconds
VITE_API_TIMEOUT=10000
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── services/          # API services and data fetching
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── styles/            # Global styles and theme
├── stories/           # Storybook stories
└── test/              # Test utilities and setup
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Vitest** - Testing framework
- **Storybook** - Component development

## Component Development

Components are built following Material-UI patterns and include:
- TypeScript interfaces for all props
- Responsive design for mobile, tablet, and desktop
- Storybook stories for documentation
- Unit tests with Vitest

### Running Storybook

To develop and document components in isolation:

```console
$ npm run storybook
```

Storybook will be available at `http://localhost:6006`

## Testing

Run tests with:

```console
$ npm run test
```

Tests are written using Vitest and React Testing Library. Test files should be co-located with components or in the `test/` directory.

## Building for Production

```console
$ npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

## Features

### Container Management Dashboard
- Real-time metrics and monitoring
- Container list with filtering and search
- Responsive grid layout
- Status indicators and alerts

### Container Details Page
- Detailed container information
- Activity timeline
- Metrics visualization
- Responsive design across all breakpoints

### Component Library
- 40+ reusable UI components
- Material-UI theming
- Consistent design system
- Mobile-first responsive design