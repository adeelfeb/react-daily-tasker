# Event Calendar Application

A full-stack event calendar application built with React and Node.js.

## Project Structure

```
event-calendar-app/
├── backend/                 # Node.js API server
├── event_calendar/         # React frontend application
├── .gitignore             # Git ignore rules
├── ENVIRONMENT_SETUP.md   # Environment configuration guide
└── README.md             # This file
```

## Features

- 📅 Event scheduling and management
- 👤 User authentication and authorization
- 📱 Responsive design
- 🔐 Secure API with JWT authentication
- 🗄️ MongoDB database integration

## Quick Start

1. **Backend Setup:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI
   npm install
   npm start
   ```

2. **Frontend Setup:**
   ```bash
   cd event_calendar
   cp .env.example .env
   # Edit .env with your API URL
   npm install
   npm run dev
   ```

## Documentation

- [Environment Setup Guide](ENVIRONMENT_SETUP.md) - Complete guide for configuring environment variables