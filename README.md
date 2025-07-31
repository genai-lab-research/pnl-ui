# Demo - Container Management Dashboard

## Prerequisites

### Required Software
- **Node.js** 18+ and npm
- **Python** 3.11+
- **PostgreSQL** database
- **Docker** (optional but recommended)

## Project Structure

```
demo/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/          
│   │   ├── models/
│   │   ├── repositories/
│   │   └── services/
│   ├── alembic/
│   ├── scripts/
│   └── docker-compose.yml
└── frontend/
    ├──.storybook/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── features/
    │   ├── shared/
    │   └── stories/
    └── public/
```

## Quick Start

### Docker Setup

1. **Navigate to the backend directory:**
   ```bash
   cd demo/backend
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env  # If available, or create manually
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build and start the FastAPI backend on port 8000
   - Wait for database connection
   - Run any necessary migrations
   - Start the application with health checks

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd demo/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173` with proxy configuration to connect to the backend.

### Available Scripts


#### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Test coverage
npm run coverage

# Component development
npm run storybook

# Linting
npm run lint
```


## Development URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/v1/docs
- **Storybook**: http://localhost:6006
