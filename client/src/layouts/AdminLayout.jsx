import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-gauge-high', end: true },
  { to: '/admin/products', label: 'Products', icon: 'fa-box' },
  { to: '/admin/messages', label: 'Messages', icon: 'fa-envelope' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="min-h-screen bg-gray-50 font-body text-gray-800">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-primary text-white flex items-center justify-between px-4 z-40">
        <Link to="/" className="font-heading font-bold text-base text-white">
          Multi4<span className="text-gray-400">You</span> Admin
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-white p-2"
        >
          <i className="fa-solid fa-bars text-lg" />
        </button>
      </header>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-primary text-white flex flex-col z-50 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-xl text-white">
            Multi4<span className="text-gray-400">You</span> Admin
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="lg:hidden text-white text-xl leading-none p-1"
          >
            &times;
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-white text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <i className={`fa-solid ${n.icon} w-4`} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-gray-400 mb-2">Signed in as</div>
          <div className="text-sm font-semibold text-white truncate">{admin?.name || admin?.email}</div>
          <div className="text-xs text-gray-400 truncate mb-3">{admin?.email}</div>
          <div className="flex gap-2">
            <Link to="/" className="flex-1 text-center text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
              <i className="fa-solid fa-store mr-1" /> Store
            </Link>
            <button
              onClick={logout}
              className="flex-1 text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <i className="fa-solid fa-sign-out-alt mr-1" /> Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-64 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
