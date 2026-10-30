import { useState } from 'react';
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Users, FolderTree, Boxes,
  BarChart3, Megaphone, Settings, Search, Bell, LogOut, Store, Leaf
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // 🆕 AuthContext import kiya

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/orders' },
  { label: 'Orders', icon: ShoppingBag, to: '/admin/orders' },
  { label: 'Products', icon: Package, to: '/admin' },
  { label: 'Customers', icon: Users, soon: true },
  { label: 'Categories', icon: FolderTree, soon: true },
  { label: 'Inventory', icon: Boxes, soon: true },
  { label: 'Reports', icon: BarChart3, soon: true },
  { label: 'Promotions', icon: Megaphone, soon: true },
  { label: 'Settings', icon: Settings, soon: true },
];

function AdminLayout({ children }) {
  const { user, logout, loading } = useAuth(); // 🆕 AuthContext se user nikala
  const location = useLocation();
  const navigate = useNavigate();

  // 🆕 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e2a1c]"></div>
      </div>
    );
  }

  // 🆕 Security Check: Agar login nahi hai ya Admin nahi hai, toh bahar nikaal do
  if (!user || user.role !== 'ADMIN') {
    alert("Access Denied! You are not an Admin.");
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to) => to && location.pathname === to;

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      {/* ═══ SIDEBAR (desktop) ═══ */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#0e2a1c] text-white fixed inset-y-0 left-0 z-50">
        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
            <Leaf size={20} className="text-[#8daa83]" />
          </span>
          <div>
            <p className="font-extrabold text-lg leading-tight">OrganicHarvest</p>
            <p className="text-[11px] text-white/50">Fresh • Natural • Healthy</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-2">
          {navItems.map(({ label, icon: Icon, to, soon }) => (
            to ? (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(to)
                    ? 'bg-[#1a5c38] text-white shadow-lg shadow-black/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {label}
                {label === 'Orders' && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-md">5</span>
                )}
              </Link>
            ) : (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/30 cursor-not-allowed"
                title="Coming soon"
              >
                <Icon size={18} />
                {label}
              </div>
            )
          ))}
        </nav>

        {/* Promo card */}
        <div className="m-4 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a5c38] to-[#0e2a1c] border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=400&q=80"
            alt="Fresh organic vegetables"
            className="w-full h-24 object-cover"
            onError={(e) => (e.target.style.display = 'none')}
          />
          <div className="p-3.5">
            <p className="font-bold text-sm leading-snug">Good Food<br />Good Health</p>
            <p className="text-[11px] text-white/60 mt-1">Organic. Fresh. Delivered.</p>
          </div>
        </div>

        <div className="px-5 pb-5 flex items-center gap-2 text-[11px] text-white/40">
          <Settings size={12} />
          OrganicHarvest Admin Panel v1.0.0
        </div>
      </aside>

      {/* ═══ MAIN AREA ═══ */}
      <div className="lg:ml-[260px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search orders, customers, products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-16 py-2.5 text-sm focus:outline-none focus:border-[#245b3b]/40 focus:bg-white transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 border border-gray-200 rounded-md px-1.5 py-0.5 hidden sm:block">
              Ctrl + K
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button className="relative p-2 text-gray-500 hover:text-[#245b3b] transition-colors" title="Notifications">
              <Bell size={20} />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>

            <div className="flex items-center gap-2.5">
              {/* 🆕 Dynamic User Initials */}
              <span className="w-9 h-9 rounded-full bg-[#0e2a1c] text-white text-xs font-bold flex items-center justify-center uppercase">
                {user.name ? user.name.substring(0, 2) : 'AD'}
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">{user.name || 'Admin'}</p>
                <p className="text-[11px] text-gray-400">Admin</p>
              </div>
            </div>

            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#245b3b] bg-[#eaf0e5] px-3 py-2 rounded-lg hover:bg-[#dce6d5] transition"
            >
              <Store size={15} /> Store
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Mobile nav chips */}
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-2.5 flex gap-2 overflow-x-auto">
          {navItems.filter(i => i.to).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`whitespace-nowrap text-xs font-semibold px-3.5 py-1.5 rounded-full transition ${
                isActive(item.to) ? 'bg-[#0e2a1c] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;