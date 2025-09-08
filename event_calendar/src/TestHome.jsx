import { BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';
import './globals.css';

// Simple test component to verify Home works independently
const TestHome = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Home />
      </div>
    </Router>
  );
};

export default TestHome;
