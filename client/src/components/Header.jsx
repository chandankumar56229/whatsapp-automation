import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setNavOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  // Force "scrolled" look on dark-hero pages
  const darkHeroPaths = ['/about'];
  const isDarkHero = darkHeroPaths.some((p) => location.pathname.startsWith(p)) ||
                     location.pathname.startsWith('/product/');
  const headerClass = `m4u-header${scrolled || isDarkHero ? ' scrolled' : ''}`;

  return (
    <header className={headerClass}>
      <div className="header-inner">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Multi4You" className="logo-img" />
        </Link>

        <div
          className={`m4u-nav-backdrop${navOpen ? ' open' : ''}`}
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
        <nav className={`m4u-nav${navOpen ? ' open' : ''}`}>
          <div className="m4u-nav-header">
            <span className="m4u-nav-title">Menu</span>
            <button className="mobile-close" onClick={() => setNavOpen(false)} aria-label="Close">&times;</button>
          </div>
          <div className="m4u-nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/store">Store</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
        </nav>

        <div className="header-actions">
          <Link to="/contact" className="btn-primary-custom btn-sm">Get Started</Link>
          <button className="mobile-toggle" onClick={() => setNavOpen((v) => !v)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
