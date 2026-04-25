import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listProducts } from '../api/products.js';
import Stars from '../components/Stars.jsx';

const CATEGORIES = [
  { icon: 'fa-address-book', name: 'CRM & Business Tools', count: '1 Product' },
  { icon: 'fa-comments', name: 'Communication & Messaging', count: 'Coming Soon', soon: true },
  { icon: 'fa-wand-magic-sparkles', name: 'AI & Automation Tools', count: 'Coming Soon', soon: true },
  { icon: 'fa-cart-shopping', name: 'E-Commerce Solutions', count: 'Coming Soon', soon: true },
  { icon: 'fa-chart-pie', name: 'Analytics & Reporting', count: 'Coming Soon', soon: true },
  { icon: 'fa-mobile-screen', name: 'Mobile Applications', count: 'Coming Soon', soon: true },
];

const FEATURES = [
  { icon: 'fa-brands fa-whatsapp', color: 'green', title: 'WhatsApp Cloud API', text: "Direct integration with Meta's official WhatsApp Business API. Send & receive messages, manage templates, and handle webhooks seamlessly." },
  { icon: 'fa-solid fa-robot', color: 'blue', title: 'AI-Powered Chatbot', text: 'Build intelligent chatbots with keyword auto-replies, branching flows, and AI responses powered by OpenAI, Anthropic & Google models.' },
  { icon: 'fa-solid fa-phone-volume', color: 'purple', title: 'IVR & Voice Calling', text: 'Full voice support with IVR menus, incoming/outgoing WhatsApp calls, call transfers, and call recording capabilities.' },
  { icon: 'fa-solid fa-building', color: 'orange', title: 'Multi-Tenant Architecture', text: 'Support multiple organizations with isolated data, RBAC permissions, and super admin controls — perfect for agencies & SaaS businesses.' },
  { icon: 'fa-solid fa-chart-line', color: 'teal', title: 'Analytics Dashboard', text: 'Track message delivery, engagement rates, campaign performance, and agent productivity with real-time analytics and reporting.' },
  { icon: 'fa-solid fa-paper-plane', color: 'pink', title: 'Bulk Campaigns', text: 'Send mass messages to large contact lists with smart scheduling, retry logic for failures, and detailed campaign analytics.' },
];

const TRUST = [
  { icon: 'fa-code', title: '100% Source Code', text: 'Full source code included with every purchase. No obfuscation, no limitations.' },
  { icon: 'fa-arrows-rotate', title: 'Lifetime Updates', text: 'Free lifetime updates with new features, security patches, and improvements.' },
  { icon: 'fa-book', title: 'Rich Documentation', text: 'Detailed guides, API references, and video tutorials for easy setup.' },
  { icon: 'fa-eye', title: 'Live Preview', text: 'Try before you buy. Every product has a live demo you can explore.' },
  { icon: 'fa-lock', title: 'Secure Payments', text: 'SSL-encrypted checkout with multiple payment gateways supported.' },
  { icon: 'fa-headset', title: '24/7 Support', text: 'Dedicated support team ready to help with setup, bugs, and customizations.' },
];

const TESTIMONIALS = [
  { initials: 'RK', name: 'Rajesh Kumar', role: 'CTO, TechVista Solutions', rating: 5, quote: 'WhatsCamp transformed our customer support. The WhatsApp integration is seamless, and the IVR system saved us from hiring 3 more agents. Incredible value for the price.' },
  { initials: 'SP', name: 'Sarah Patel', role: 'Founder, GrowthHive Agency', rating: 5, quote: 'The AI chatbot handles 70% of our inquiries automatically. The multi-tenant setup lets us manage all our clients from one dashboard. Best investment we\'ve made.' },
  { initials: 'AM', name: 'Alex Martinez', role: 'Software Engineer, DevStack', rating: 4.5, quote: 'As a developer, I appreciate the clean Go + Vue.js codebase. The documentation is thorough, deployment was easy with Docker, and the source code is well structured.' },
];

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    listProducts().then((products) => setFeatured(products[0] || null)).catch(() => {});
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/store?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-grid"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Premium <span className="highlight">Software</span> Solutions,<br />Ready to Deploy
            </h1>
            <p className="hero-subtitle">
              Discover production-ready SaaS applications with complete source code, detailed documentation, and lifetime updates from Multi4You Store.
            </p>
            <form className="hero-search" onSubmit={onSearch}>
              <input
                type="text"
                placeholder="Search for software, scripts, plugins..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit"><i className="fa-solid fa-search" /> Search</button>
            </form>
            <div className="hero-stats">
              <div className="hero-stat"><div className="number">1+</div><div className="label">Products</div></div>
              <div className="hero-stat"><div className="number">500+</div><div className="label">Downloads</div></div>
              <div className="hero-stat"><div className="number">4.9</div><div className="label">Avg Rating</div></div>
              <div className="hero-stat"><div className="number">24/7</div><div className="label">Support</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT */}
      {featured && (
        <section className="featured-product">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-badge"><i className="fa-solid fa-star" /> Featured Product</span>
              <h2 className="section-title">Our Flagship Product</h2>
              <p className="section-desc centered">{featured.tagline}</p>
            </div>
            <div className="product-card-large">
              <div className="row g-0">
                <div className="col-lg-6">
                  <Link to={`/product/${featured.slug}`} className="product-image" style={{ height: '100%', minHeight: 350, display: 'block', textDecoration: 'none' }}>
                    <span className="badge-featured"><i className="fa-solid fa-bolt" /> Featured</span>
                    {featured.image && (
                      <img src={featured.image} alt={featured.name} style={{ maxHeight: 400, objectFit: 'contain' }} />
                    )}
                  </Link>
                </div>
                <div className="col-lg-6">
                  <div className="product-details">
                    <div className="product-meta">
                      {(featured.tags || []).slice(0, 5).map((t) => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <h3 className="product-title">{featured.name}</h3>
                    <div className="product-rating mb-3">
                      <Stars rating={featured.rating || 0} />
                      <span className="count">({featured.rating}) • {featured.salesCount}+ Sales</span>
                    </div>
                    <p className="product-excerpt">{featured.description?.split('\n\n')[0]}</p>
                    <div className="product-footer">
                      <div className="price">${featured.pricing?.[0]?.price ?? '—'} <small>/ {featured.pricing?.[0]?.tier}</small></div>
                      <div className="product-actions">
                        <Link to={`/product/${featured.slug}`} className="btn-primary-custom btn-sm">View Details <i className="fa-solid fa-arrow-right" /></Link>
                        <a href="#" className="btn-dark btn-sm">Live Preview <i className="fa-solid fa-external-link" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge"><i className="fa-solid fa-rocket" /> Key Features</span>
            <h2 className="section-title">Everything You Need in a WhatsApp CRM</h2>
            <p className="section-desc centered">WhatsCamp packs powerful features that transform how businesses communicate with customers on WhatsApp.</p>
          </div>
          <div className="row g-4">
            {FEATURES.map((f) => (
              <div className="col-lg-4 col-md-6" key={f.title}>
                <div className="feature-card">
                  <div className={`feature-icon ${f.color}`}><i className={f.icon} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="steps-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
              <i className="fa-solid fa-cogs" /> How It Works
            </span>
            <h2 className="section-title white">Get Started in 3 Simple Steps</h2>
            <p className="section-desc centered" style={{ color: 'rgba(255,255,255,0.6)' }}>From browsing to deployment — we make it easy to get your software up and running.</p>
          </div>
          <div className="row">
            {[
              { n: 1, title: 'Browse & Choose', text: 'Explore our curated collection of production-ready SaaS applications and find the perfect solution for your business.' },
              { n: 2, title: 'Purchase & Download', text: 'Buy the license, download the complete source code, and access detailed documentation and setup guides.' },
              { n: 3, title: 'Deploy & Scale', text: "Follow our step-by-step guides to deploy, customize, and scale your software. We're here to help 24/7." },
            ].map((s, i) => (
              <div className="col-md-4" key={s.n}>
                <div className="step-card">
                  <div className="step-number">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {i < 2 && <span className="step-connector"><i className="fa-solid fa-arrow-right" /></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge"><i className="fa-solid fa-th-large" /> Categories</span>
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-desc centered">Explore our growing collection of software across multiple categories.</p>
          </div>
          <div className="row g-4">
            {CATEGORIES.map((c) => (
              <div className="col-lg-4 col-md-6" key={c.name}>
                <div className={`category-card${c.soon ? ' coming-soon' : ''}`}>
                  <div className="cat-icon"><i className={`fa-solid ${c.icon}`} /></div>
                  <h3>{c.name}</h3>
                  <span className="count">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <span className="section-badge"><i className="fa-solid fa-shield-halved" /> Why Multi4You</span>
              <h2 className="section-title">Why developers & businesses trust us</h2>
              <p className="section-desc">We don't just sell code — we deliver complete, production-ready products backed by documentation and support.</p>
            </div>
            <div className="col-lg-7">
              <div className="row">
                {TRUST.map((t) => (
                  <div className="col-md-6" key={t.title}>
                    <div className="trust-card">
                      <div className="trust-icon"><i className={`fa-solid ${t.icon}`} /></div>
                      <div>
                        <h4>{t.title}</h4>
                        <p>{t.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge"><i className="fa-solid fa-quote-left" /> Testimonials</span>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-desc centered">Don't just take our word for it — hear from businesses using WhatsCamp.</p>
          </div>
          <div className="row g-4">
            {TESTIMONIALS.map((t) => (
              <div className="col-lg-4" key={t.name}>
                <div className="testimonial-card">
                  <div className="stars"><Stars rating={t.rating} /></div>
                  <blockquote>"{t.quote}"</blockquote>
                  <div className="author">
                    <div className="author-avatar">{t.initials}</div>
                    <div>
                      <div className="author-name">{t.name}</div>
                      <div className="author-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <h2 className="section-title white mb-3">Get Notified When We Launch<br />New Products</h2>
          <p className="section-desc centered" style={{ color: 'rgba(255,255,255,0.6)' }}>Join our newsletter and be the first to know about new software releases, updates, and exclusive deals.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe <i className="fa-solid fa-arrow-right" /></button>
          </form>
        </div>
      </section>
    </>
  );
}
