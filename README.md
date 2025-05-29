# Container Management System

A full-stack application for managing agricultural containers with real-time metrics, crop tracking, and system management.

## Architecture

- **Frontend**: React + TypeScript + Material-UI + Vite
- **Backend**: FastAPI + Python + SQLModel + SQLite
- **Design**: Pixel-perfect implementation of Figma design

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create environment file:
```bash
# Copy the example .env file or create one with required variables
# .env file should contain:
# PROJECT_NAME=FastAPI Demo
# POSTGRES_SERVER=localhost
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=postgres
# POSTGRES_DB=demo
# FIRST_SUPERUSER=admin@example.com
# FIRST_SUPERUSER_PASSWORD=admin123
# BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

3. Create and setup virtual environment:
```bash
uv venv
```

4. Install dependencies:
```bash
uv sync
```

5. Start the development server:
```bash
uv run uvicorn app.main:app --reload
```

The backend API will be available at `http://localhost:8000`
API documentation will be available at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Integration

The frontend is configured to automatically:
1. **Connect to backend API** when available at `http://localhost:8000/api`
2. **Fall back to mock data** in development when backend is unavailable
3. **Display status indicator** showing whether real API or mock data is being used

### Environment Configuration

Create `.env.local` in the frontend directory for custom configuration:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Enable mock data fallback in development
REACT_APP_ENABLE_MOCK_FALLBACK=true

# API timeout in milliseconds
REACT_APP_API_TIMEOUT=10000
```

## Features Implemented

### Container Details Page
✅ **Header & Navigation**
- Breadcrumb navigation with back button
- Container title and metadata display
- Status indicators with proper styling
- Tab navigation (Overview, Environment & Recipes, Inventory, Devices)

✅ **Real-time Metrics**
- 6 metric cards with icons and target values
- Time range selection (Week, Month, Quarter, Year)
- Temperature, Humidity, CO₂, Yield, and Utilization metrics
- Responsive grid layout

✅ **Crops Management**
- Sortable table with crops data
- Pagination controls
- Overdue status indicators
- Expandable/collapsible section

✅ **Container Information**
- Three-column layout (Information, Settings, Activity Log)
- System integration status
- Activity timeline with user attribution
- Edit functionality ready for implementation

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints: Mobile (≤767px), Tablet (768px-1199px), Desktop (≥1200px)
- Progressive enhancement across all screen sizes

### API Integration
✅ **Real Backend API**
- FastAPI integration with complete CRUD operations
- RESTful endpoints following OpenAPI standards
- Automatic error handling and timeout management

✅ **Mock Data Fallback**
- Development-friendly fallback system
- Visual indicators when using mock data
- Seamless switching between real and mock data

✅ **Configuration Management**
- Environment-based configuration
- Centralized API endpoints
- Feature flags for development vs production

## API Endpoints

### Container Management
- `GET /api/containers` - List all containers
- `GET /api/containers/{id}` - Get container details
- `POST /api/containers` - Create new container
- `PUT /api/containers/{id}` - Update container
- `DELETE /api/containers/{id}` - Delete container

### Container Data
- `GET /api/containers/{id}/metrics?time_range=WEEK` - Get metrics
- `GET /api/containers/{id}/crops?page=0&page_size=10` - Get crops
- `GET /api/containers/{id}/activities?limit=5` - Get activity log

## Development Workflow

### Running with Real API
1. Start backend server (`uvicorn app.main:app --reload`)
2. Start frontend (`npm run dev`)
3. Frontend automatically connects to backend

### Running with Mock Data Only
1. Start only frontend (`npm run dev`)
2. Set `REACT_APP_ENABLE_MOCK_FALLBACK=true`
3. Frontend uses mock data when API is unavailable

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
pip install -r requirements.txt
# Deploy with your preferred method (Docker, systemd, etc.)
```

## Project Structure

```
demo/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models.py       # Database models
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI app
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript definitions
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Vite** - Build tool
- **React Router** - Navigation

### Backend
- **FastAPI** - Web framework
- **SQLModel** - Database ORM
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **SQLite** - Database (development)

## Next Steps

1. **Authentication & Authorization**
   - User login/logout
   - Role-based access control
   - JWT token management

2. **Real-time Updates**
   - WebSocket integration for live metrics
   - Push notifications for alerts
   - Live activity feed

3. **Advanced Features**
   - Data export functionality
   - Advanced filtering and search
   - Bulk operations
   - Chart visualizations

4. **Production Deployment**
   - Docker containerization
   - Environment configuration
   - Database setup (PostgreSQL)
   - CDN and caching strategy

## Contributing

1. Follow the existing code style and conventions
2. Write TypeScript interfaces for all data structures
3. Add proper error handling and loading states
4. Test with both real API and mock data
5. Ensure responsive design works across all breakpoints

## Support

For questions or issues:
1. Check the API documentation at `http://localhost:8000/docs`
2. Review the console for development warnings
3. Verify environment configuration in `.env` files