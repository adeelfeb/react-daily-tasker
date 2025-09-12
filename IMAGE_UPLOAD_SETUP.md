# Image Upload Feature Setup Guide

This guide explains how to set up and use the image upload feature for events in the MERN stack application.

## Backend Setup

### 1. Environment Variables

Add the following environment variables to your `.env` file in the backend directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 2. Cloudinary Account Setup

1. Go to [Cloudinary](https://cloudinary.com) and create a free account
2. After logging in, go to your dashboard
3. Copy the Cloud Name, API Key, and API Secret from the dashboard
4. Add these values to your `.env` file

### 3. Dependencies

The following packages have been installed:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload middleware
- `multer-storage-cloudinary` - Cloudinary storage engine for multer

## Frontend Setup

No additional setup is required for the frontend. The image upload functionality is already integrated into the EventForm component.

## How It Works

### Backend Flow

1. **Image Upload Middleware** (`backend/middleware/upload.js`):
   - Uses multer with Cloudinary storage
   - Validates file types (images only)
   - Limits file size to 5MB
   - Automatically resizes images to 800x600 with quality optimization

2. **Event Model** (`backend/models/Event.js`):
   - Added `imageUrl` field to store Cloudinary image URLs

3. **Event Controller** (`backend/controllers/eventController.js`):
   - Handles image uploads in create and update operations
   - Stores Cloudinary URL in the database

4. **Event Routes** (`backend/routes/events.js`):
   - Added upload middleware to POST and PUT routes
   - Includes error handling for upload failures

### Frontend Flow

1. **EventForm Component** (`event_calendar/src/components/forms/EventForm.jsx`):
   - Added image upload input with preview functionality
   - Client-side validation for file type and size
   - Image preview with remove option

2. **API Service** (`event_calendar/src/services/api.js`):
   - Updated to handle FormData for file uploads
   - Sends image files along with event data

3. **Admin Dashboard** (`event_calendar/src/pages/AdminDashboard.jsx`):
   - Updated to handle image parameter in form submission
   - Displays imageUrl in event objects

## Usage

### For Admins

1. **Creating an Event with Image**:
   - Click "Create Event" button
   - Fill in event details
   - Click "Choose Image" to select a poster image
   - Preview the image before submitting
   - Click "Create Event"

2. **Updating an Event with Image**:
   - Click on an existing event to edit
   - Modify event details as needed
   - Click "Change Image" to upload a new image
   - Click "Update Event"

3. **Removing an Image**:
   - Click the "×" button on the image preview
   - The image will be removed from the event

### Image Requirements

- **Supported formats**: JPG, JPEG, PNG, GIF, WebP
- **Maximum size**: 5MB
- **Automatic optimization**: Images are resized to 800x600 and optimized for web

## File Structure

```
backend/
├── middleware/
│   └── upload.js              # Image upload middleware
├── models/
│   └── Event.js              # Updated with imageUrl field
├── controllers/
│   └── eventController.js    # Updated to handle images
└── routes/
    └── events.js             # Updated with upload middleware

event_calendar/src/
├── components/forms/
│   ├── EventForm.jsx         # Updated with image upload UI
│   └── EventForm.css         # Added image upload styles
├── services/
│   └── api.js                # Updated for file uploads
└── pages/
    └── AdminDashboard.jsx    # Updated to handle images
```

## Error Handling

The system includes comprehensive error handling:

- **File type validation**: Only image files are accepted
- **File size validation**: 5MB maximum file size
- **Upload errors**: Proper error messages for upload failures
- **Network errors**: Graceful handling of connection issues

## Security Features

- **File type validation**: Server-side validation ensures only images are uploaded
- **File size limits**: Prevents large file uploads
- **Cloudinary security**: Images are stored securely on Cloudinary
- **Admin-only access**: Only admin users can upload images

## Troubleshooting

### Common Issues

1. **"Only image files are allowed" error**:
   - Ensure you're selecting a valid image file
   - Check that the file extension is supported

2. **"File too large" error**:
   - Reduce the image file size to under 5MB
   - Use image compression tools if needed

3. **Cloudinary configuration errors**:
   - Verify your Cloudinary credentials in the `.env` file
   - Ensure your Cloudinary account is active

4. **Image not displaying**:
   - Check that the imageUrl is being saved correctly
   - Verify the Cloudinary URL is accessible

### Testing the Feature

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend: `cd event_calendar && npm run dev`
3. Login as an admin user
4. Try creating/editing an event with an image
5. Verify the image appears in the event list and details

## Future Enhancements

Potential improvements for the image upload feature:

1. **Multiple image support**: Allow multiple images per event
2. **Image editing**: Basic crop/resize functionality
3. **Image galleries**: Display multiple images in a carousel
4. **Image optimization**: More advanced compression options
5. **CDN integration**: Faster image delivery
