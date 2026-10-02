# Assets Management System - Setup Guide

A full-stack assets management system with Express.js/MongoDB backend and React frontend.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or Docker)
- npm or yarn

## Project Structure

```
assets-management-system/
├── backend-api/          # Express.js + MongoDB API
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middlewares/     # Custom middlewares
│   └── utils/           # Utility functions
├── frontend-react/      # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service calls
│   │   └── utils/       # Utility functions
│   └── public/
└── docker-compose.yml   # Docker setup
```

## Quick Start with Docker

1. **Make sure Docker is installed and running**

2. **Start all services:**
```bash
docker-compose up
```

3. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MongoDB: localhost:27017

4. **Stop services:**
```bash
docker-compose down
```

## Manual Setup

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Create a `.env` file in the backend-api directory:
```env
MONGO_URI=mongodb://localhost:27017/assets_management
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
```

4. **Start MongoDB:**
If using local MongoDB installation, make sure it's running on port 27017.

5. **Start the backend server:**
```bash
npm start
# For development with auto-reload:
npm run dev
```

The backend will run on http://localhost:3000

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend-react
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Create a `.env` file in the frontend-react directory:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. **Start the frontend development server:**
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Features

### Authentication
- User registration
- User login/logout
- JWT token-based authentication
- Protected routes

### User Management
- List users with pagination
- Edit user profiles
- Soft delete users
- Password updates

### Location Management
- Hierarchical location structure (Building → Floor → Room → Rack → Desk)
- Create, edit, delete locations
- Location tree view
- Address information

### Region & Township Management
- Manage geographic regions
- Manage townships linked to regions
- Multi-language support (English/Myanmar)

### Asset Management
- Create, edit, delete assets
- Asset categories (Electronics, Furniture, Vehicle, Equipment, Other)
- Asset status tracking (Active, Inactive, Maintenance, Retired)
- Location assignment
- Purchase and current value tracking
- Serial number tracking
- Pagination support

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user

### Users
- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `PATCH /api/v1/users/:id/soft-delete` - Soft delete user
- `DELETE /api/v1/users/:id/hard-delete` - Hard delete user

### Locations
- `GET /api/v1/locations` - Get all locations
- `GET /api/v1/locations/:id` - Get location by ID
- `POST /api/v1/locations` - Create location
- `PUT /api/v1/locations/:id` - Update location
- `DELETE /api/v1/locations/:id` - Delete location

### Regions
- `GET /api/v1/regions` - Get all regions
- `GET /api/v1/regions/:id` - Get region by ID
- `POST /api/v1/regions` - Create region
- `PUT /api/v1/regions/:id` - Update region
- `DELETE /api/v1/regions/:id` - Delete region

### Townships
- `GET /api/v1/townships` - Get all townships
- `GET /api/v1/townships/:id` - Get township by ID
- `POST /api/v1/townships` - Create township
- `PUT /api/v1/townships/:id` - Update township
- `DELETE /api/v1/townships/:id` - Delete township

### Assets
- `GET /api/v1/assets` - Get all assets (paginated)
- `GET /api/v1/assets/:id` - Get asset by ID
- `POST /api/v1/assets` - Create asset
- `PUT /api/v1/assets/:id` - Update asset
- `DELETE /api/v1/assets/:id` - Delete asset

## Response Format

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

## Default User

You'll need to register a user through the registration page to get started. The first user you create will have full access to all features.

## Development Notes

- Backend uses Express.js with Mongoose for MongoDB
- Frontend uses React with Vite for fast development
- Authentication uses JWT tokens stored in localStorage
- All protected routes require a valid JWT token
- Soft delete is implemented for users and assets
- Location hierarchy supports nested structures

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running on port 27017
- Check your MONGO_URI in .env file
- If using Docker, ensure the MongoDB container is running

### CORS Issues
- The backend allows all origins for development
- For production, configure CORS properly

### Frontend API Connection
- Ensure VITE_API_URL is set correctly in frontend .env
- Check that backend is running on the specified port
- Verify backend API is accessible

## License

ISC
