import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RootRedirect = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // Always redirect to home page regardless of authentication status
      navigate('/home', { replace: true });
    }
  }, [isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // This will be replaced by the redirect, but just in case
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Redirecting...</p>
    </div>
  );
};

export default RootRedirect;
