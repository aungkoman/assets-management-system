# Assets Management System

A full-stack assets management system with Express.js + MongoDB backend and React frontend.

## Tech Stack

- **Backend**: Express.js, MongoDB (Mongoose), JWT Authentication
- **Frontend**: React, Vite, React Router, Axios
- **Deployment**: Docker Compose

## Features

- ✅ User authentication (Register/Login)
- ✅ User management with pagination
- ✅ Hierarchical location management (Building → Floor → Room → Rack → Desk)
- ✅ Region and Township management
- ✅ Asset tracking with categories and status
- ✅ Unified API response format
- ✅ Docker Compose setup

## Quick Start

### Using Docker Compose (Recommended)

```bash
docker-compose up
```

Access the application at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Manual Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Project Structure

```
assets-management-system/
├── backend-api/          # Express.js + MongoDB API
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose models (User, Location, Region, Township, Asset)
│   ├── routes/          # API routes
│   ├── services/        # Business logic layer
│   ├── middlewares/     # Auth middleware
│   └── utils/           # Response handlers
├── frontend-react/      # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Layout, reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Dashboard, Users, Locations, Regions, Townships, Assets
│   │   ├── services/    # API service calls
│   │   └── utils/       # API configuration
└── docker-compose.yml   # Docker setup
```

## API Response Format

All API responses follow a unified format:

### Success Response
```json
{
  "status": true,
  "message": "Success message",
  "data": { ... },
  "pagination": { ... }
}
```

### Error Response
```json
{
  "status": false,
  "message": "Error message",
  "error": {
    "field": ["Error message"]
  }
}
```


mongodump --uri="mongodb://localhost:27017" --db=assets_management --out=.


## Architecture Pattern

The backend follows a layered architecture:

- **Model**: Core entity definitions with Mongoose schemas
- **Service**: Business logic layer with minimal dependencies
- **Controller**: HTTP request/response handling and validation
- **Routes**: API endpoint definitions

This pattern ensures:
- Separation of concerns
- Testable business logic
- Clean API contracts
- Consistent error handling

## Getting Started

1. Clone the repository
2. Run `docker-compose up` (or follow manual setup in SETUP.md)
3. Register a new user at http://localhost:5173/register
4. Login and start managing your assets!

## Documentation

For detailed setup instructions, API endpoints, and troubleshooting, see [SETUP.md](./SETUP.md).

## License

ISC
