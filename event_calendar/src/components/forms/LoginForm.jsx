import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isValidPassword } from '../../utils/validation';
import { STORAGE_KEYS } from '../../constants';
import './LoginForm.css';

const LoginForm = () => {
  const { login, error, clearError, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password || !isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const result = await login(formData);
    
    if (result.success) {
      // Get the user data from the result to check role immediately
      const userData = result.user || JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || '{}');
      const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath);
    } else {
      setErrors({ submit: result.error });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {(error || errors.submit) && (
            <div className="error-message submit-error">
              {error || errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
