import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppFloat from '../components/WhatsAppFloat.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';

export default function PublicLayout() {
  return (
    <div className="storefront">
      <Header />
      <main><Outlet /></main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
}
