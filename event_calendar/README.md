# Event Calendar Frontend

A modern React frontend application for the Event Calendar system built with Vite, featuring a responsive design and comprehensive event management capabilities.

## Features

- 📅 **Event Management**: Create, edit, delete, and view events
- 📱 **Responsive Design**: Mobile-first approach with modern UI
- 🔐 **Authentication**: Secure login and registration system
- 👤 **User Management**: Admin panel for user administration
- 🎨 **Modern UI**: Clean, intuitive interface with custom styling
- ⚡ **Fast Performance**: Built with Vite for optimal development experience
- 🔄 **Real-time Updates**: Dynamic calendar with live data

## Tech Stack

- **Framework**: React 19 with Hooks
- **Build Tool**: Vite 7
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Calendar**: React Big Calendar
- **Date Handling**: Moment.js
- **Styling**: CSS3 with CSS Variables
- **State Management**: React Context API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. **Clone the repository and navigate to frontend:**
   ```bash
   cd event_calendar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   # API Configuration
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_APP_NAME=Event Calendar
   REACT_APP_VERSION=1.0.0
   
   # Development Configuration
   REACT_APP_DEBUG=true
   REACT_APP_LOG_LEVEL=info
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
event_calendar/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/       # Common UI components
│   │   ├── forms/        # Form components
│   │   └── layout/       # Layout components
│   ├── context/          # React Context providers
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants
│   ├── hooks/            # Custom React hooks
│   ├── assets/           # Images, icons, etc.
│   ├── globals.css       # Global styles
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## Key Components

### Pages
- **Home**: Landing page with feature overview
- **Login**: User authentication
- **Register**: User registration
- **Calendar**: Main calendar view with event management
- **Admin**: Admin panel for user management

### Context Providers
- **AuthContext**: User authentication state
- **EventsContext**: Event data management

### Services
- **API Service**: Centralized API communication with Axios
- **Authentication**: Login, logout, profile management
- **Events**: CRUD operations for events
- **Users**: Admin user management

## Styling

The application uses a custom CSS architecture:
- **CSS Variables**: Consistent color scheme and theming
- **Component Styles**: Scoped CSS for each component
- **Global Styles**: Base styles and utilities
- **Responsive Design**: Mobile-first approach

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `REACT_APP_APP_NAME` | Application name | `Event Calendar` |
| `REACT_APP_VERSION` | App version | `1.0.0` |
| `REACT_APP_DEBUG` | Debug mode | `true` |
| `REACT_APP_LOG_LEVEL` | Logging level | `info` |

## Development

### Code Style
- ESLint configuration for consistent code style
- React Hooks best practices
- Component-based architecture
- Custom hooks for reusable logic

### Performance
- Vite for fast development and building
- Code splitting with React.lazy
- Optimized bundle size
- Efficient re-rendering with proper state management

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

3. **Deploy:**
   The `dist` folder contains the production build ready for deployment.

## Troubleshooting

### Common Issues
- **API Connection**: Ensure backend is running on the correct port
- **Environment Variables**: Check that `.env` file is properly configured
- **Dependencies**: Run `npm install` if you encounter module errors
- **Build Issues**: Clear `node_modules` and reinstall if needed

### Development Tips
- Use React Developer Tools for debugging
- Check browser console for API errors
- Verify environment variables are loaded correctly
- Test responsive design on different screen sizes
