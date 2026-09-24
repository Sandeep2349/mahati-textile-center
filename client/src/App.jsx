import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import TrackOrderModal from './components/common/TrackOrderModal';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { fetchProducts } from './services/api';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const { openDrawer } = useCart();

  // Load catalog on mount
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const res = await fetchProducts();
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error loading initial catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  // Navigation router
  const navigate = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'admin') {
      setCurrentPage(isAuthenticated ? 'admin-dashboard' : 'admin-login');
      return;
    }
    setCurrentPage(page);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order) => {
    setCompletedOrder(order);
    setCurrentPage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Dashboard and authenticated, render admin shell
  if (currentPage === 'admin-dashboard' && isAuthenticated) {
    return <AdminDashboard onBackToStore={() => navigate('home')} />;
  }

  // If in Admin Login
  if (currentPage === 'admin-login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between overflow-x-hidden w-full max-w-full">
        <Header
          onNavigate={navigate}
          currentPage={currentPage}
          onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        />
        <AdminLogin
          onLoginSuccess={() => setCurrentPage('admin-dashboard')}
          onBackToStore={() => navigate('home')}
        />
        <Footer onNavigate={navigate} />

        <TrackOrderModal
          isOpen={isTrackOrderOpen}
          onClose={() => setIsTrackOrderOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      {/* Universal Store Header */}
      <Header
        onNavigate={navigate}
        currentPage={currentPage}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home
            products={products}
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'shop' && (
          <Shop
            products={products}
            loading={loading}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => navigate('shop')}
            onNavigateToShop={() => navigate('shop')}
          />
        )}

        {currentPage === 'checkout' && (
          <Checkout
            onOrderSuccess={handleOrderSuccess}
            onBackToShop={() => navigate('shop')}
          />
        )}

        {currentPage === 'order-success' && (
          <OrderSuccess
            order={completedOrder}
            onContinueShopping={() => navigate('shop')}
          />
        )}
      </main>

      {/* Global Slide-in Cart Drawer */}
      <CartDrawer onNavigateToCheckout={() => navigate('checkout')} />

      {/* Zero-Login Customer Track Order Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Universal Store Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
