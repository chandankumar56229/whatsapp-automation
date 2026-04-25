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

  // Force "scrolled" look on dark-hero pages
  const darkHeroPaths = ['/store', '/about', '/contact'];
  const isDarkHero = darkHeroPaths.some((p) => location.pathname.startsWith(p)) ||
                     location.pathname.startsWith('/product/');
  const headerClass = `m4u-header${scrolled || isDarkHero ? ' scrolled' : ''}`;

  return (
    <header className={headerClass}>
      <div className="header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon"><i className="fa-solid fa-code" /></div>
          Multi4<span className="accent">You</span>
        </Link>

        <nav className={`m4u-nav${navOpen ? ' open' : ''}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/store">Store</NavLink>
          <NavLink to="/product/whatscamp">WhatsCamp</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <button className="mobile-close" onClick={() => setNavOpen(false)} aria-label="Close">&times;</button>
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
