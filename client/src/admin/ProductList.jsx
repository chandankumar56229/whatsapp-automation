import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProducts, deleteProduct } from '../api/products.js';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    listProducts({ includeUnpublished: true })
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteProduct(id);
    load();
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} total</p>
        </div>
        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-primary text-white rounded-lg font-heading font-bold text-sm hover:bg-gray-800 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus" /> New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slug…"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none"
          />
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                No products. <Link to="/admin/products/new" className="text-primary underline">Create one</Link>.
              </td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {p.image
                      ? <img src={p.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                      : <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400"><i className="fa-solid fa-box" /></div>}
                    <div>
                      <div className="font-semibold text-sm text-primary">{p.name}</div>
                      <div className="text-xs text-gray-500">/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                <td className="px-6 py-4 text-sm font-semibold">
                  {p.pricing?.[0]?.price != null ? `$${p.pricing[0].price}` : '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    p.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/admin/products/${p._id}`}
                    className="inline-block px-3 py-1.5 text-sm text-primary hover:bg-gray-100 rounded mr-1"
                  >Edit</Link>
                  <button
                    onClick={() => onDelete(p._id, p.name)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
