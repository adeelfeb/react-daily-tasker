import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Event Calendar</h1>
          </Link>
          
          <nav className="nav">
            {isAuthenticated ? (
              <>
                <Link to="/calendar" className="nav-link">
                  Calendar
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="nav-link">
                    Admin
                  </Link>
                )}
                <div className="user-menu">
                  <span className="user-name">Welcome, {user?.name}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
