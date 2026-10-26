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
import FloatingCart from './components/FloatingCart'; // 🆕 Import kiya

function App() {
  // ... (aapka baaki state aur logic same rahega)

  return (
    <>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-[#fffefa] relative"> {/* relative add kiya */}
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Hero />
            
            <Products 
              filteredProducts={filteredProducts} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
            />
            
            <Contact />
            <Footer />
            
            {/* 🆕 Floating Cart Yahan Add Kar Dein */}
            <FloatingCart />
            
            <CartDrawer />
            <CheckoutModal />
            <Toast /> 
          </div>
        } />

        {/* Baaki routes same rahenge */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/track-order" element={<TrackOrder />} />
      </Routes>
    </>
  );
}

export default App;