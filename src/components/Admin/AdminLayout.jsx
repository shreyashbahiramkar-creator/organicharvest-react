import { useState } from 'react';
import { Outlet, Link, Navigate, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Leaf, Menu } from 'lucide-react'; 
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext'; // 🆕 AuthContext import kiya

const AdminLayout = () => {
  // 🆕 AuthContext se user aur logout nikal rahe hain
  const { user, logout, loading } = useAuth(); 
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🆕 Agar loading ho raha hai toh wait karo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  // 🆕 Security Check: Agar user logged in nahi hai YA admin nahi hai, toh bahar nikaal do
  if (!user || user.role !== 'ADMIN') {
    alert("Access Denied! You are not an Admin.");
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar with Mobile Props */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Hamburger Menu (Sirf mobile par dikhega) */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
              <span className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-white">
                Ctrl + K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 ml-2">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* 🆕 User Profile Dropdown (Logout ke sath) */}
            <div className="relative group">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                  {user.name ? user.name.substring(0, 2) : 'AD'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                    {user.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;