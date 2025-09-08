import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventsProvider } from './context/EventsContext';
import Home from './Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RootRedirect from './components/RootRedirect';
import EventsPage from './pages/EventsPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Root route - checks session and redirects */}
          <Route 
            path="/" 
            element={
              <AuthProvider>
                <RootRedirect />
              </AuthProvider>
            } 
          />
          
          {/* Home page - public landing page */}
          <Route path="/home" element={<Home />} />

          {/* Public Events page - no auth required */}
          <Route path="/events" element={<EventsPage />} />
          
          {/* Auth routes - need AuthProvider but no EventsProvider */}
          <Route 
            path="/login" 
            element={
              <AuthProvider>
                <LoginPage />
              </AuthProvider>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthProvider>
                <RegisterPage />
              </AuthProvider>
            } 
          />
          
          {/* Protected routes - need authentication */}
          <Route 
            path="/dashboard" 
            element={
              <AuthProvider>
                <EventsProvider>
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                </EventsProvider>
              </AuthProvider>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AuthProvider>
                <EventsProvider>
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                </EventsProvider>
              </AuthProvider>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
