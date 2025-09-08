import React from 'react';

const TermsPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Terms of Service</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        By using this site you agree to our Privacy Policy and Terms of Service.
      </p>
      <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
        <p>
          Use this service responsibly. Do not upload unlawful content. We may update
          these terms over time to reflect product changes and legal requirements.
        </p>
        <p>
          Continued use of the service after changes constitutes acceptance of the new terms.
        </p>
      </div>
      <div style={{ marginTop: '2rem', color: 'var(--color-text-muted)' }}>
        © {new Date().getFullYear()} Event Calendar
      </div>
    </div>
  );
};

export default TermsPage;


