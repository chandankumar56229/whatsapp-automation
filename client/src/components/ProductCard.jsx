import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const price = product.pricing?.[0]?.price;
  const img = product.image?.startsWith('http') || product.image?.startsWith('/')
    ? product.image
    : `/${product.image}`;

  if (product.isComingSoon) {
    return (
      <div className="product-card" style={{ opacity: 0.6 }}>
        <div className="card-thumb">
          <i className="fa-solid fa-hourglass-half" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '3rem' }} />
        </div>
        <div className="card-body">
          <h3 className="card-title">{product.name}</h3>
          <div className="product-meta mb-2">
            <span className="tag">Coming Soon</span>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{product.tagline}</p>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/product/${product.slug}`} className="product-card d-block">
      <div className="card-thumb">
        {product.image ? (
          <img src={img} alt={product.name} style={{ maxHeight: 220, objectFit: 'contain' }} />
        ) : (
          <i className="fa-solid fa-box" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '3rem' }} />
        )}
      </div>
      <div className="card-body">
        <div className="product-meta" style={{ marginBottom: 8 }}>
          {(product.tags || []).slice(0, 3).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <h3 className="card-title">{product.name}</h3>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', minHeight: 38 }}>
          {product.tagline}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="card-price">{price != null ? `$${price}` : '—'}</div>
          <div className="product-rating" style={{ fontSize: '0.85rem' }}>
            <i className="fa-solid fa-star" /> {product.rating || '—'}
          </div>
        </div>
      </div>
    </Link>
  );
}
