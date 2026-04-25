import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', textAlign: 'center', padding: 20,
    }}>
      <h1 style={{ fontSize: '4rem' }}>404</h1>
      <p style={{ color: '#737373' }}>Page not found</p>
      <Link to="/" className="btn-primary-custom mt-4">Go Home</Link>
    </div>
  );
}
