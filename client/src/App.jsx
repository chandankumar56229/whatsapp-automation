import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import RequireAdmin from './components/RequireAdmin.jsx';

import Home from './pages/Home.jsx';
import Store from './pages/Store.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLogin from './admin/Login.jsx';
import Dashboard from './admin/Dashboard.jsx';
import ProductList from './admin/ProductList.jsx';
import ProductForm from './admin/ProductForm.jsx';
import Messages from './admin/Messages.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
        <Route path="/admin/products/:id" element={<ProductForm />} />
        <Route path="/admin/messages" element={<Messages />} />
      </Route>

      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
