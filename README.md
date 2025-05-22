# Vertical Farming Control Panel

This is a full-stack application for managing vertical farming operations. The application includes both a backend API built with FastAPI and a frontend React application.

![Vertical Farming Control Panel](https://via.placeholder.com/800x400?text=Vertical+Farming+Control+Panel)

## Project Overview

The Vertical Farming Control Panel allows users to:

- Monitor and manage farming containers
- Track performance metrics across different time ranges
- View and manage inventory, crops, and devices
- Set up alerts and notifications for critical events
- Visualize farm data through interactive charts and tables

## Repository Structure

This repository contains both the frontend and backend applications:

```
demo/
├── backend/            # FastAPI backend
│   ├── app/            # Main application code
│   ├── requirements.txt # Python dependencies
│   └── README.md       # Backend documentation
├── frontend/           # React frontend
│   ├── src/            # Source code
│   ├── package.json    # Node.js dependencies
│   └── README.md       # Frontend documentation
└── README.md           # This file
```

## Quick Start

To run the complete application locally, you need to start both the backend and frontend services.

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Accessing the Application

- **Backend API**: http://localhost:8000
  - API Documentation: http://localhost:8000/docs

- **Frontend Application**: http://localhost:5173 (or the URL shown in terminal)

## Documentation

Each part of the application has its own detailed README:

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## Development

### Prerequisites

- Python 3.8 or higher
- Node.js 18.x or higher
- npm 9.x or higher

### Key Features and Implementation Details

#### Backend

- RESTful API built with FastAPI
- SQLAlchemy ORM for database operations
- SQLite database (for development)
- Automatic sample data generation

#### Frontend

- React with TypeScript
- Material-UI components
- Storybook for component documentation
- Responsive design

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

This project was created as a demonstration of full-stack development capabilities using modern technologies and best practices.