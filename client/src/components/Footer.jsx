import { Link } from 'react-router-dom';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '91XXXXXXXXXX';
const WA_DISPLAY = `+${WA_NUMBER.slice(0, 2)} ${WA_NUMBER.slice(2, 7)} ${WA_NUMBER.slice(7)}`;

export default function Footer() {
  return (
    <footer className="m4u-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="footer-brand">
              <div className="logo">Multi4<span>You</span> Store</div>
              <p>Premium software marketplace delivering production-ready SaaS applications with complete source code, documentation, and lifetime support.</p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a>
                <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter" /></a>
                <a href="#" aria-label="GitHub"><i className="fa-brands fa-github" /></a>
                <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/store">Store</Link></li>
              <li><Link to="/product/whatscamp">WhatsCamp</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-4">
            <h5 className="footer-heading">Products</h5>
            <ul className="footer-links">
              <li><Link to="/product/whatscamp">WhatsCamp CRM</Link></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Changelog</a></li>
              <li><a href="#">API Reference</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-4">
            <h5 className="footer-heading">Support</h5>
            <ul className="footer-links">
              <li><Link to="/contact">Help Center</Link></li>
              <li><a href="#">License Terms</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-lg-2">
            <h5 className="footer-heading">Contact</h5>
            <ul className="footer-links">
              <li><i className="fa-solid fa-envelope" style={{ color: 'var(--gray-400)', marginRight: 8 }} /> hello@multi4you.store</li>
              <li>
                <i className="fa-solid fa-phone" style={{ color: 'var(--gray-400)', marginRight: 8 }} />
                <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {WA_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Multi4You Store. All rights reserved.</p>
          <p>Made with <i className="fa-solid fa-heart" style={{ color: 'var(--gray-400)' }} /> for developers worldwide</p>
        </div>
      </div>
    </footer>
  );
}
