import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <nav className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>

        <div className="footer-divider" />

        <div className="footer-privacy">
          By using this site you agree to our
          {' '}<Link to="/privacy">Privacy Policy</Link> and {' '}
          <Link to="/terms">Terms of Service</Link>.
        </div>

        <div className="footer-copy">© {new Date().getFullYear()} Event Calendar</div>
      </div>
    </footer>
  );
};

export default Footer;


