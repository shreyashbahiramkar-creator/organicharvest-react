import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Search, Bell, ChevronDown, Leaf } from 'lucide-react';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const ADMIN_SECRET_KEY = 'OrganicHarvestAdmin123';
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginKey, setLoginKey] = useState('');

  // Check if already logged in
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginKey === ADMIN_SECRET_KEY) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdmin', 'true');
    } else {
      alert('❌ Invalid Admin Key!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  // 🔒 Agar Login nahi hai, toh Login Screen dikhao
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full text-green-700">
              <Leaf size={40} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Admin Portal</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Enter your secret key to access the dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={loginKey} 
                onChange={(e) => setLoginKey(e.target.value)} 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                placeholder="••••••••••••" 
                required
              />
            </div>
            <button type="submit" className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors">
              Login to Dashboard
            </button>
          </form>
          <Link to="/" className="block text-center mt-6 text-sm text-gray-500 hover:text-green-700 font-medium">
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

  // 🔓 Agar Login hai, toh Layout dikhao
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products, orders, customers..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-white">
              Ctrl + K
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                SA
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">Admin</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;