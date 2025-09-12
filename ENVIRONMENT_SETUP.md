# Environment Setup Guide

This guide explains how to set up environment variables for both frontend and backend applications.

## Backend Environment Variables

Copy `backend/.env.example` to `backend/.env` and update the values:

```bash
cp backend/.env.example backend/.env
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `SESSION_SECRET` | Session encryption key | `your-super-secret-session-key` |

### Image Upload Variables (Required for Image Upload Feature)

| Variable | Description | Example |
|----------|-------------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloudinary-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-cloudinary-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-cloudinary-api-secret` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | JWT token secret | `your-jwt-secret-key` |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `EMAIL_HOST` | SMTP host for emails | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email username | `your-email@gmail.com` |
| `EMAIL_PASS` | Email password | `your-app-password` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `5242880` (5MB) |
| `UPLOAD_PATH` | File upload directory | `./uploads` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |

## Frontend Environment Variables

Copy `event_calendar/.env.example` to `event_calendar/.env` and update the values:

```bash
cp event_calendar/.env.example event_calendar/.env
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `REACT_APP_APP_NAME` | Application name | `Don't Forget` |
| `REACT_APP_VERSION` | Application version | `1.0.0` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_DEBUG` | Enable debug mode | `true` |
| `REACT_APP_LOG_LEVEL` | Logging level | `info` |
| `REACT_APP_ENABLE_ANALYTICS` | Enable analytics | `false` |
| `REACT_APP_ENABLE_PWA` | Enable PWA features | `false` |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps API key | `your-google-maps-api-key` |
| `REACT_APP_ANALYTICS_ID` | Analytics tracking ID | `your-analytics-id` |

## Cloudinary Setup (For Image Upload Feature)

To enable the image upload feature, you need to set up a Cloudinary account:

1. **Create Cloudinary Account:**
   - Go to [Cloudinary](https://cloudinary.com) and sign up for a free account
   - Verify your email address

2. **Get Your Credentials:**
   - Log in to your Cloudinary dashboard
   - Go to the "Dashboard" section
   - Copy your Cloud Name, API Key, and API Secret

3. **Add to Environment:**
   - Add the Cloudinary credentials to your backend `.env` file
   - The image upload feature will work automatically once configured

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files** - They contain sensitive information
2. **Use strong secrets** - Generate random strings for SESSION_SECRET and JWT_SECRET
3. **Environment-specific values** - Use different values for development, staging, and production
4. **Database credentials** - Use environment-specific database credentials
5. **API keys** - Keep external service API keys secure
6. **Cloudinary credentials** - Keep your Cloudinary API secret secure

## Quick Start

1. **Backend Setup:**
   ```bash
   cd backend
   cp backend-env.example .env
   # Edit .env with your MongoDB URI, Cloudinary credentials, and other values
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

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend
2. Use production MongoDB URI
3. Set secure session secrets
4. Configure proper CORS origins
5. Use environment-specific API URLs
6. Enable HTTPS in production
7. Configure production Cloudinary credentials
8. Set up proper file upload limits and security
