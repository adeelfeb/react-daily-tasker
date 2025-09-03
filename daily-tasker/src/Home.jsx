import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>Don't Forget</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">Your simple scheduling + task platform</h2>
            <button className="btn btn-primary hero-cta">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-block">
              <div className="feature-icon">
                📅
              </div>
              <h3>Book meetings easily</h3>
              <p>Schedule your appointments and meetings with a simple, intuitive interface.</p>
            </div>
            
            <div className="feature-block">
              <div className="feature-icon">
                ✅
              </div>
              <h3>Organize tasks clearly</h3>
              <p>Keep track of your daily tasks and stay organized with our clean task management system.</p>
            </div>
            
            <div className="feature-block">
              <div className="feature-icon">
                🔔
              </div>
              <h3>Never forget follow-ups</h3>
              <p>Set reminders and follow-ups to ensure you never miss important deadlines or meetings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <nav className="footer-nav">
              <a href="/">Home</a>
              <a href="/privacy">Privacy & Terms</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
