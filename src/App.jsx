import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast'; 
import AdminPanel from './components/AdminPanel'; 
import AdminOrders from './components/Admin/AdminOrders';
import TrackOrder from './components/TrackOrder'; 
import CartNotification from './components/CartNotification'; // 🆕 FloatingCart ki jagah CartNotification import kiya

function App() {
  // State Variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // API Call
  useEffect(() => {
    fetch('https://organicharvest-backend.onrender.com/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Admin Delete Logic
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

  // Filter Logic (Search + Category)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="text-center py-20 text-xl font-bold">Loading products...</div>;
  }

  return (
    <>
      <Routes>
        {/* Main Storefront Route */}
        <Route path="/" element={
          <div className="min-h-screen bg-[#fffefa] relative">
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Hero />
            
            <Products 
              filteredProducts={filteredProducts} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
              // onDelete={handleDelete} // Agar main page se delete chahiye toh isko uncomment karein
            />
            
            <Contact />
            <Footer />
            
            {/* 🆕 Temporary Cart Notification (Floating Cart ki jagah) */}
            <CartNotification />
            
            <CartDrawer />
            <CheckoutModal />
            <Toast /> 
          </div>
        } />

        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/orders" element={<AdminOrders />} />

        {/* Track Order Route */}
        <Route path="/track-order" element={<TrackOrder />} />
      </Routes>
    </>
  );
}

export default App;