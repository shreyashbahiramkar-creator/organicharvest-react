import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopByCategory from './components/ShopByCategory'; 
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast'; 
import TrackOrder from './components/TrackOrder'; 
import CartNotification from './components/CartNotification'; 
import ScrollToTop from './components/ScrollToTop'; 
import ProductPage from './components/ProductPage'; 

// Admin Imports
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminProducts from './components/Admin/AdminProducts'; // 🆕 Import add kiya
import AdminOrders from './components/Admin/AdminOrders';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 
  
  const location = useLocation(); 
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Admin mode auto-reset on normal pages
  useEffect(() => {
    if (!isAdminRoute) {
      localStorage.removeItem('isAdmin');
    }
  }, [isAdminRoute]);

  useEffect(() => {
    fetch('https://organicharvest-backend.onrender.com/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setProducts(data);
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
      const res = await fetch(`https://organicharvest-backend.onrender.com/api/products/${id}`, { 
        method: 'DELETE',
        headers: {
          'X-Admin-Key': 'OrganicHarvestAdmin123'
        }
      });
      
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert('Product deleted successfully!');
      } else if (res.status === 401) {
        alert('Unauthorized! Aap Admin nahi hain.');
      } else {
        alert('Delete failed!');
      }
    } catch (error) {
      console.error(error);
      alert('Server error!');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading && !isAdminRoute) {
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

  if (error && !isAdminRoute) {
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
      {/* Store Navbar - Only show if not admin route */}
      {!isAdminRoute && <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
      
      <div className="flex-grow">
        <Routes>
          {/* Main Storefront Route */}
          <Route path="/" element={
            <>
              <Hero />
              <ShopByCategory 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
              />
              <Products 
                filteredProducts={filteredProducts} 
                allProducts={products} 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
                onDelete={handleDelete} 
              />
              <Contact />
            </>
          } />

          <Route path="/product/:id" element={<ProductPage allProducts={products} />} />
          <Route path="/track-order" element={<TrackOrder />} />

          {/* 🆕 Admin Routes with Nested Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard products={products} />} />
            <Route path="products" element={<AdminProducts />} /> {/* 🆕 Products Route Add kiya */}
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </div>
      
      {/* Store Footer - Only show if not admin route */}
      {!isAdminRoute && <Footer />}
      
      <ScrollToTop />
      
      {/* Store Cart/Checkout - Only show if not admin route */}
      {!isAdminRoute && (
        <>
          <CartNotification />
          <CartDrawer />
          <CheckoutModal />
          <Toast /> 
        </>
      )}
    </div>
  );
}

export default App;