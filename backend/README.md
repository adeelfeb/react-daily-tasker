# Event Calendar Backend API

A Node.js/Express backend API for the Event Calendar application with MongoDB database integration.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Event Management**: CRUD operations for events with date/time handling
- **User Management**: Admin panel for user management
- **Session Handling**: MongoDB-based session storage
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Centralized error handling middleware

## Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Session Storage**: MongoDB via connect-mongo
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/event-calendar
SESSION_SECRET=your-super-secret-session-key-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/range/:start/:end` - Get events by date range

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/toggle-active` - Toggle user active status
- `GET /api/users/stats` - Get user statistics

## Database Models

### User Model
- name, email, password, role, isActive, lastLogin
- Password hashing with bcryptjs
- Role-based access (admin/user)

### Event Model
- title, description, start, end, type, location, allDay
- createdBy (User reference), attendees, isPublic, status
- Recurring event support
- Date validation

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based authorization
- Input validation and sanitization
- CORS configuration
- Session management

## Development

- **ES6 Modules**: All code uses import/export syntax
- **Error Handling**: Centralized error handling middleware
- **Logging**: Custom logging utility
- **Validation**: Request validation middleware
- **Database**: MongoDB with Mongoose ODM

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/event-calendar |
| SESSION_SECRET | Session secret key | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |
