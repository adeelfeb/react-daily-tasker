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
import Layout from './components/layout/Layout';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import NotificationContainer from './components/common/NotificationContainer';
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
      <AuthProvider>
        <div className="App">
          <NotificationContainer />
          <Routes>
            {/* Root route - checks session and redirects */}
            <Route path="/" element={<RootRedirect />} />

            {/* Home page - public landing page */}
            <Route path="/home" element={<Layout><Home /></Layout>} />

            {/* Public Events page - no auth required */}
            <Route path="/events" element={<Layout><EventsPage /></Layout>} />

            {/* Legal & Contact */}
            <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
            <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes - need authentication */}
            <Route 
              path="/dashboard" 
              element={
                <Layout>
                  <EventsProvider>
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  </EventsProvider>
                </Layout>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <Layout>
                  <EventsProvider>
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  </EventsProvider>
                </Layout>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
