const VALUES = [
  { icon: 'fa-bullseye', title: 'Quality First', text: 'Every product we ship is built to production standards with clean code and rigorous testing.' },
  { icon: 'fa-handshake', title: 'Customer Focus', text: 'Our customers come first. We listen, iterate, and build what real businesses need.' },
  { icon: 'fa-rocket', title: 'Ship Fast', text: 'We deliver value quickly without compromising on engineering quality.' },
  { icon: 'fa-shield-halved', title: 'Trust & Security', text: 'Transparent licensing, secure payments, and we never lock you into proprietary stacks.' },
  { icon: 'fa-graduation-cap', title: 'Always Learning', text: 'We obsess over modern best practices and keep all products updated.' },
  { icon: 'fa-globe', title: 'Built for Everyone', text: 'Multi-language support, fair pricing, global support — wherever you build.' },
];

export default function About() {
  return (
    <>
      <section className="about-hero">
        <div className="container text-center">
          <span className="section-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.15)' }}>
            <i className="fa-solid fa-info-circle" /> About Us
          </span>
          <h1 className="section-title white">Building the Future of Software, One Product at a Time</h1>
          <p className="section-desc centered" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Multi4You Store is a curated marketplace for production-ready SaaS applications, built by developers who care about quality.
          </p>
        </div>
      </section>

      <section className="trust-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-number">1+</div><div className="stat-label">Products Shipped</div></div>
            <div className="stat-item"><div className="stat-number">500+</div><div className="stat-label">Happy Customers</div></div>
            <div className="stat-item"><div className="stat-number">4.9★</div><div className="stat-label">Average Rating</div></div>
            <div className="stat-item"><div className="stat-number">24/7</div><div className="stat-label">Support</div></div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6">
              <span className="section-badge"><i className="fa-solid fa-book-open" /> Our Story</span>
              <h2 className="section-title">From Devs, For Devs</h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
                Multi4You started as a small team of engineers tired of bloated, half-baked SaaS products. We wanted to build software the way it should be built — clean, modern, fully open, and ready to deploy. Today we ship that vision as our flagship product WhatsCamp, with more on the way.
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
                Every line of code we ship is something we'd be proud to deploy ourselves. That's our promise.
              </p>
            </div>
            <div className="col-lg-6">
              <img src="/whatscamp-dashboard.png" alt="Our work" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2xl)' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge"><i className="fa-solid fa-heart" /> Our Values</span>
            <h2 className="section-title">What Drives Us</h2>
          </div>
          <div className="row g-4">
            {VALUES.map((v) => (
              <div className="col-lg-4 col-md-6" key={v.title}>
                <div className="value-card">
                  <div className="value-icon"><i className={`fa-solid ${v.icon}`} /></div>
                  <h4 style={{ marginBottom: 8 }}>{v.title}</h4>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
