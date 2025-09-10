import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/forms/LoginForm';
import Footer from '../components/layout/Footer';

const LoginPage = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if not loading and user is authenticated
    if (!isLoading && isAuthenticated) {
      const redirectPath = isAdmin() ? '/admin' : '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  // Show loading animation while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If authenticated, don't render the login form (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <LoginForm />
      <Footer />
    </>
  );
};

export default LoginPage;
