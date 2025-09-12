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
- 🖼️ Image upload for event posters (Cloudinary integration)
- 👤 User authentication and authorization
- 📱 Responsive design
- 🔐 Secure API with JWT authentication
- 🗄️ MongoDB database integration
- 👨‍💼 Admin dashboard with full CRUD operations

## Quick Start

1. **Backend Setup:**
   ```bash
   cd backend
   cp backend-env.example .env
   # Edit .env with your MongoDB URI and Cloudinary credentials
   npm install
   npm start
   ```

2. **Frontend Setup:**
   ```bash
   cd event_calendar
   cp frontend-env.example .env
   # Edit .env with your API URL
   npm install
   npm run dev
   ```

3. **Cloudinary Setup (Required for Image Upload):**
   - Create a free account at [Cloudinary](https://cloudinary.com)
   - Get your Cloud Name, API Key, and API Secret from the dashboard
   - Add these credentials to your backend `.env` file

## Documentation

- [Environment Setup Guide](ENVIRONMENT_SETUP.md) - Complete guide for configuring environment variables
- [Image Upload Setup Guide](IMAGE_UPLOAD_SETUP.md) - Detailed guide for setting up the image upload feature

## Image Upload Feature

The application includes a comprehensive image upload system for event posters:

- **Cloudinary Integration**: Images are stored securely on Cloudinary
- **File Validation**: Supports JPG, PNG, GIF, WebP formats (5MB max)
- **Image Optimization**: Automatic resizing and quality optimization
- **Admin Interface**: Easy-to-use upload interface in the event form
- **Preview Functionality**: Real-time image preview before submission

### Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WebP

### Image Specifications
- Maximum file size: 5MB
- Automatic optimization: 800x600 resolution
- Quality optimization for web delivery