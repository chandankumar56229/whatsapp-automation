import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProducts } from '../api/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    setLoading(true);
    listProducts({ search, category, sort })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const setParam = (k, v) => {
    const next = new URLSearchParams(searchParams);
    if (!v || v === 'all') next.delete(k);
    else next.set(k, v);
    setSearchParams(next);
  };

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [products]);

  return (
    <>
      <section className="store-grid">
        <div className="container">
          <div className="store-heading">
            <span className="section-badge"><i className="fa-solid fa-store" /> Marketplace</span>
            <h1 className="store-title">All Products</h1>
            <p className="store-subtitle">Browse our curated catalog of production-ready software.</p>
          </div>
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control-custom"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setParam('search', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-control-custom" value={category} onChange={(e) => setParam('category', e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-control-custom" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p style={{ color: 'var(--gray-500)' }}>Loading…</p>
          ) : products.length === 0 ? (
            <p style={{ color: 'var(--gray-500)' }}>No products found.</p>
          ) : (
            <div className="row g-4">
              {products.map((p) => (
                <div className="col-lg-4 col-md-6" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}

              {/* Static "Coming Soon" placeholders for visual continuity */}
              <div className="col-lg-4 col-md-6">
                <div className="product-card" style={{ opacity: 0.55 }}>
                  <div className="card-thumb">
                    <i className="fa-solid fa-hourglass-half" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '3rem' }} />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">More Coming Soon</h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>New products are being added regularly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
