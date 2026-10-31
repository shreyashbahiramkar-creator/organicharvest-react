import { useState, useEffect, useLayoutEffect, useRef } from 'react'; // useLayoutEffect import kiya
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import api from './utils/api';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopByCategory from './components/ShopByCategory';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';
import AdminPanel from './components/AdminPanel';
import AdminOrders from './components/Admin/AdminOrders';
import CartNotification from './components/CartNotification';
import ScrollToTop from './components/ScrollToTop'; 
import ProductPage from './components/ProductPage';

import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  // 1. NAYA PAGE KHULNE PAR TOP SE OPEN HONE KA FIX (UPDATED)
  useLayoutEffect(() => {
    // Timeout lagaya taki naya page pehle screen par render ho jaye
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Turant top pe le jayega, smooth nahi
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // 2. SEARCH KARNE PAR PRODUCT TAK SCROLL HONE KE LIYE REF
  const productsRef = useRef(null);
  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (location.pathname !== '/admin' && location.pathname !== '/admin/orders') {
      localStorage.removeItem('isAdmin');
    }
  }, [location.pathname]);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Pakka delete karna hai?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.status === 200 || res.status === 204) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert('Unauthorized! Sirf Admin delete kar sakta hai.');
      } else {
        alert('Delete failed!');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading && !isAdminRoute && !isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#fffefa]">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 flex gap-6">
          <div className="hidden md:block w-[220px] space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 space-y-3">
                <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !isAdminRoute && !isAuthRoute) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffefa] px-4">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-500 mb-6 text-center">We couldn't load the products. Please check your internet connection or try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#245b3b] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1a452c] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffefa] relative flex flex-col">
      {!isAdminRoute && !isAuthRoute && (
        <Navbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          scrollToProducts={scrollToProducts} 
        />
      )}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              
              <div id="categories">
                <ShopByCategory
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>

              <div id="products" ref={productsRef}>
                <Products
                  filteredProducts={filteredProducts}
                  allProducts={products}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onDelete={handleDelete}
                />
              </div>

              <div id="contact">
                <Contact />
              </div>
            </>
          } />

          <Route path="/product/:id" element={<ProductPage allProducts={products} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/orders" element={<AdminOrders allProducts={products} />} />
        </Routes>
      </div>

      {!isAdminRoute && !isAuthRoute && <Footer />}

      <ScrollToTop />
      <CartNotification />
      <CartDrawer />
      <CheckoutModal />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;