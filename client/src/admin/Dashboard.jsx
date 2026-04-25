import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProducts } from '../api/products.js';
import { listMessages } from '../api/contact.js';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} mb-3`}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className="text-3xl font-heading font-bold text-primary">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    listProducts({ includeUnpublished: true }).then(setProducts).catch(() => {});
    listMessages().then(setMessages).catch(() => {});
  }, []);

  const unread = messages.filter((m) => !m.isRead).length;
  const published = products.filter((p) => p.isPublished).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="fa-box" label="Total Products" value={products.length} color="bg-gray-100 text-primary" />
        <StatCard icon="fa-eye" label="Published" value={published} color="bg-green-50 text-green-600" />
        <StatCard icon="fa-envelope" label="Total Messages" value={messages.length} color="bg-gray-100 text-primary" />
        <StatCard icon="fa-bell" label="Unread Messages" value={unread} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg text-primary">Recent Products</h2>
            <Link to="/admin/products" className="text-sm text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <Link
                key={p._id}
                to={`/admin/products/${p._id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-box" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.category}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${p.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.isPublished ? 'Live' : 'Draft'}
                </span>
              </Link>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No products yet. <Link to="/admin/products/new" className="text-primary underline">Create one</Link>.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg text-primary">Recent Messages</h2>
            <Link to="/admin/messages" className="text-sm text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {messages.slice(0, 5).map((m) => (
              <div key={m._id} className="p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{m.name}</div>
                  {!m.isRead && <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-700">New</span>}
                </div>
                <div className="text-xs text-gray-500">{m.email} • {m.subject}</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{m.message}</div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No messages yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
