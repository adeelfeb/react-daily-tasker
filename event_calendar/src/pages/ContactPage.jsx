import React from 'react';

const ContactPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Contact</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Have a question or feedback? Reach out and we’ll get back to you.
      </p>
      <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
        <p>Email: support@event-calendar.local</p>
        <p>We typically respond within 1–2 business days.</p>
      </div>
      <div style={{ marginTop: '2rem', color: 'var(--color-text-muted)' }}>
        © {new Date().getFullYear()} Event Calendar
      </div>
    </div>
  );
};

export default ContactPage;


