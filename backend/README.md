# Container Management Backend

A FastAPI-based backend service for managing containers, locations, and inventory in agricultural/hydroponic systems.

## Features

- **Container Management**: Create, read, update, and delete containers with various types and purposes
- **Location Management**: Manage physical locations where containers are placed
- **Inventory Tracking**: Track crops, panels, trays, and other inventory items
- **Comprehensive Error Handling**: Custom exception handling for different error scenarios
- **Database Integration**: PostgreSQL database with SQLAlchemy ORM
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Health Checks**: Built-in health check endpoints
- **CORS Support**: Configurable CORS for frontend integration

## Architecture

```
app/
├── api/                    # API route handlers
│   └── routes/            # Endpoint definitions
├── core/                  # Core functionality
│   ├── config.py         # Configuration settings
│   ├── db.py             # Database connection
│   ├── exceptions.py     # Custom exceptions
│   └── logging.py        # Logging configuration
├── models/               # SQLAlchemy models
├── repositories/         # Data access layer
├── schemas/              # Pydantic schemas
├── services/             # Business logic layer
└── tests/                # Test files
```

## Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- PostgreSQL 12+
- Docker (optional)

## Installation

### Local Development

1. Clone the repository and navigate to the backend directory

2. Install uv (if not already installed):
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

3. Install dependencies:
   ```bash
   uv sync
   ```

4. Set up environment variables (create `.env` file):
   ```
   POSTGRES_SERVER=localhost
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   POSTGRES_DB=demo
   ```

5. Ensure PostgreSQL is running and create the database:
   ```sql
   CREATE DATABASE demo;
   ```
6. To seed the database with sample data:
   ```bash
   uv run python seed_data.py
   ``` 
   The application uses SQLAlchemy's `create_all()` method to create tables automatically. For more details check Database Setup & Seeding

7. Run the application:
   ```bash
   uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Deployment

1. Run with Docker Compose (includes PostgreSQL):
   ```bash
   docker-compose up --build
   ```

1.1 Or build and run manually:
   ```bash
   docker build -t container-backend .
   docker run -p 8000:8000 \
     -e POSTGRES_SERVER=your-postgres-host \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=demo \
     container-backend
   ```

2. To seed the database with sample data:
   ```bash
   uv run python seed_data.py
   ``` 
   The application uses SQLAlchemy's `create_all()` method to create tables automatically. For more details check Database Setup & Seeding
   
## API Endpoints

The API provides the following main endpoints:

- `/api/containers/` - Container management operations
- `/api/locations/` - Location management operations  
- `/api/inventory/` - Inventory tracking operations
- `/health` - Health check endpoint
- `/docs` - Interactive API documentation (Swagger UI)
- `/redoc` - Alternative API documentation

### Example Container Operations

```bash
# Get all containers
curl http://localhost:8000/api/containers/

# Create a new container
curl -X POST http://localhost:8000/api/containers/ \
  -H "Content-Type: application/json" \
  -d '{
    "id": "container-001",
    "type": "hydroponic",
    "name": "Main Growing Container",
    "tenant": "farm-001",
    "purpose": "lettuce_production",
    "location_id": 1,
    "status": "active"
  }'
```

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Containers**: Primary containers for growing operations
- **Locations**: Physical locations where containers are placed
- **Crops**: Types of crops being grown
- **Panels**: Growing panels within containers
- **Trays**: Individual trays within panels
- **Inventory Metrics**: Tracking various inventory measurements

All models include automatic timestamps (`created`, `modified`) and support for tenant-based isolation.

## Development

### Code Quality

The project uses several tools for code quality:

- **pylint**: Code analysis (see `.pylintrc` for configuration)
- **ruff**: Fast Python linter and formatter
- **mypy**: Static type checking
- **pre-commit**: Git hooks for code quality

Run linting:
```bash
uv run pylint app/
uv run ruff check app/
uv run mypy app/
```

### Testing

Run tests with pytest:
```bash
uv run pytest
uv run pytest --cov=app tests/  # With coverage
```

### Database Setup & Seeding

The application uses SQLAlchemy's `create_all()` method to create tables automatically.

To seed the database with sample data:
```bash
uv run python seed_data.py
```

This will create sample data including:
- 5 locations across different cities
- 5 containers with various types and statuses
- 4 panels with different utilization rates
- 3 trays for microgreen production
- 8 crop locations (panel and tray positions)
- 6 crops in different growth stages

For production use, consider implementing proper database migrations with Alembic.
Alembic migrations are not included in this codebase because:

1. Development-First Approach: The focus is on rapid UI prototyping and component generation rather than database schema management
2. Simple Data Models: The backend uses straightforward SQLAlchemy models with static schemas that don't require complex migration
patterns
3. Seeded Data Environment: The system works with seed data and mock endpoints, making schema evolution less critical than in
production systems
4. Frontend-Centric Architecture: The primary purpose is generating and testing UI components, with the backend serving as a stable API layer.
5. Rapid Iteration: For UI generation tools, recreating databases from scratch is often faster than managing incremental schema
changes

For production deployment, you would typically add Alembic migrations and it is easy to implement using agent.

This design prioritizes development speed and UI iteration over database lifecycle management.

## Configuration

Configuration is handled through Pydantic Settings with the following key options:

- `POSTGRES_*`: Database connection settings
- `BACKEND_CORS_ORIGINS`: Allowed CORS origins for frontend
- `API_V1_STR`: API version prefix
- `PROJECT_NAME`: Application name

## Known Issues

1. **Database Initialization**: The application expects an empty database and creates tables automatically. Use the seeding script to populate with sample data.

2. **Authentication**: The application structure supports authentication but it's not currently implemented in the endpoints.

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all linting passes before submitting
