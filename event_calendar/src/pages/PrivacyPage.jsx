
const PrivacyPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        By using this site you agree to our Privacy Policy and Terms of Service.
      </p>
      <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
        <p>
          We respect your privacy. We only collect information necessary to provide
          the calendar service, improve functionality, and secure your account.
        </p>
        <p>
          You may contact us regarding your data, access, or deletion requests at any time.
        </p>
      </div>
      <div style={{ marginTop: '2rem', color: 'var(--color-text-muted)' }}>
        © {new Date().getFullYear()} Event Calendar
      </div>
    </div>
  );
};

export default PrivacyPage;


