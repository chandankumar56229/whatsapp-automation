import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api/products.js';
import Stars from '../components/Stars.jsx';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'tech', label: 'Tech Stack' },
  { id: 'reviews', label: 'Reviews' },
];

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '91XXXXXXXXXX';

function buildBuyMessage(product, tier) {
  const lines = [
    `Hi! I'm interested in buying *${product.name}*.`,
    '',
    tier ? `License: ${tier.tier}` : null,
    tier?.price != null ? `Price: $${tier.price}` : null,
    '',
    'Please share payment details.',
  ].filter((l) => l !== null);
  return encodeURIComponent(lines.join('\n'));
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [tab, setTab] = useState('overview');
  const [licenseIdx, setLicenseIdx] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getProduct(slug).then(setProduct).catch((e) => setError(e.response?.data?.error || 'Not found'));
  }, [slug]);

  if (error) {
    return (
      <section className="container" style={{ padding: '160px 20px 100px', textAlign: 'center' }}>
        <h1>Product not found</h1>
        <p style={{ color: 'var(--gray-500)' }}>{error}</p>
        <Link to="/store" className="btn-primary-custom mt-3">Back to Store</Link>
      </section>
    );
  }
  if (!product) {
    return <section className="container" style={{ padding: '160px 20px' }}>Loading…</section>;
  }

  const selectedPrice = product.pricing?.[licenseIdx]?.price;

  return (
    <>
      <section className="breadcrumb-section">
        <div className="container">
          <div className="breadcrumb-nav">
            <Link to="/">Home</Link><span className="separator">/</span>
            <Link to="/store">Store</Link><span className="separator">/</span>
            <span className="current">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="product-detail-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="product-gallery">
                <div style={{ background: 'var(--gradient-primary)', padding: 40, textAlign: 'center' }}>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ maxHeight: 450, objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-2xl)' }}
                    />
                  )}
                </div>
              </div>

              <div className="product-tabs">
                <div className="tab-nav">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      className={tab === t.id ? 'active' : ''}
                      onClick={() => setTab(t.id)}
                    >{t.label}</button>
                  ))}
                </div>

                {tab === 'overview' && (
                  <div className="tab-content active">
                    <h2 style={{ fontSize: '1.75rem', marginBottom: 16 }}>{product.name}</h2>
                    {product.description?.split('\n\n').map((para, i) => (
                      <p key={i} style={{ marginBottom: 16, lineHeight: 1.8, color: 'var(--gray-600)' }}>{para}</p>
                    ))}
                  </div>
                )}

                {tab === 'features' && (
                  <div className="tab-content active">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Complete Feature List</h2>
                    <div className="row g-3">
                      {(product.features || []).map((f, i) => (
                        <div className="col-md-6" key={i}>
                          <div className="trust-card" style={{ padding: 16 }}>
                            <div className="trust-icon"><i className={`fa-solid ${f.icon || 'fa-check'}`} /></div>
                            <div>
                              <h4>{f.title}</h4>
                              <p>{f.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'tech' && (
                  <div className="tab-content active">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Technology Stack</h2>
                    <div className="row g-3">
                      {Object.entries(product.techStack || {}).map(([key, items]) => (
                        items?.length > 0 && (
                          <div className="col-md-6" key={key}>
                            <div className="trust-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                              <h4 style={{ textTransform: 'capitalize' }}>{key}</h4>
                              <div className="product-tag-list">
                                {items.map((it) => <span key={it} className="product-tag">{it}</span>)}
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'reviews' && (
                  <div className="tab-content active">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Customer Reviews</h2>
                    {(product.reviews || []).length === 0 && <p style={{ color: 'var(--gray-500)' }}>No reviews yet.</p>}
                    {(product.reviews || []).map((r, i) => (
                      <div className="testimonial-card mb-3" key={i}>
                        <div className="stars"><Stars rating={r.rating} /></div>
                        <blockquote>"{r.text}"</blockquote>
                        <div className="author">
                          <div className="author-avatar">{r.author?.[0] || 'U'}</div>
                          <div>
                            <div className="author-name">{r.author}</div>
                            <div className="author-role">{r.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="product-sidebar">
                <div className="price-card">
                  <div className="price-main">${selectedPrice ?? '—'}</div>
                  <div className="price-label">{product.pricing?.[licenseIdx]?.tier}</div>

                  {product.pricing?.length > 0 && (
                    <div className="license-options">
                      {product.pricing.map((p, i) => (
                        <div
                          key={i}
                          className={`license-option${i === licenseIdx ? ' selected' : ''}`}
                          onClick={() => setLicenseIdx(i)}
                        >
                          <div>
                            <div className="license-name">{p.tier}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{p.description}</div>
                          </div>
                          <div className="license-price">${p.price}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${buildBuyMessage(product, product.pricing?.[licenseIdx])}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-custom"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <i className="fa-solid fa-cart-plus" /> Buy Now
                  </a>
                  {product.liveDemoUrl && (
                    <a
                      href={product.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-dark mt-2"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <i className="fa-solid fa-eye" /> Live Preview <i className="fa-solid fa-external-link" />
                    </a>
                  )}
                  <Link to="/contact" className="btn-dark mt-2" style={{ width: '100%', justifyContent: 'center' }}>
                    <i className="fa-solid fa-envelope" /> Contact Sales
                  </Link>

                  <div className="product-info-list">
                    <div className="product-info-item"><span className="label">Version</span><span className="value">{product.version}</span></div>
                    <div className="product-info-item"><span className="label">Released</span><span className="value">{product.publishDate}</span></div>
                    <div className="product-info-item"><span className="label">Sales</span><span className="value">{product.salesCount}+</span></div>
                    <div className="product-info-item"><span className="label">Support</span><span className="value">{product.supportDuration}</span></div>
                    <div className="product-info-item"><span className="label">Rating</span><span className="value">{product.rating} <Stars rating={product.rating} /></span></div>
                  </div>

                  <div className="product-tag-list">
                    {(product.tags || []).map((t) => <span key={t} className="product-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
