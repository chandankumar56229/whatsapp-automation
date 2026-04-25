import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      style={{
        position: 'fixed', bottom: 30, right: 30, width: 48, height: 48,
        borderRadius: '50%', background: 'var(--primary)', color: 'var(--white)',
        border: 'none', cursor: 'pointer', zIndex: 999, fontSize: '1.2rem',
        boxShadow: 'var(--shadow-lg)', transition: 'var(--transition-base)',
      }}
    >
      <i className="fa-solid fa-arrow-up" />
    </button>
  );
}
