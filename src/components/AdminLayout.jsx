import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Users, FolderTree, Boxes,
  BarChart3, Megaphone, Settings, Search, Bell, LogOut, Store, Leaf
} from 'lucide-react';

const ADMIN_SECRET_KEY = 'OrganicHarvestAdmin123';

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
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [loginKey, setLoginKey] = useState('');
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginKey === ADMIN_SECRET_KEY) {
      localStorage.setItem('isAdmin', 'true');
      setIsAuthenticated(true);
    } else {
      alert('❌ Invalid Admin Key!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  /* ═══ Login Screen ═══ */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-11 h-11 bg-[#0e2a1c] text-white rounded-xl flex items-center justify-center">
              <Leaf size={22} />
            </span>
            <div>
              <p className="font-extrabold text-lg text-[#0e2a1c] leading-tight">OrganicHarvest</p>
              <p className="text-[11px] text-gray-400">Admin Panel</p>
            </div>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Admin Secret Key</label>
              <input
                type="password"
                value={loginKey}
                onChange={(e) => setLoginKey(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#245b3b]/30 focus:border-[#245b3b]"
                placeholder="••••••••••••"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#0e2a1c] text-white font-bold py-3 rounded-xl hover:bg-[#1a5c38] transition">
              Login
            </button>
          </form>
          <Link to="/" className="block text-center mt-4 text-sm text-gray-500 hover:text-[#245b3b]">
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

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
              <span className="w-9 h-9 rounded-full bg-[#0e2a1c] text-white text-xs font-bold flex items-center justify-center">SA</span>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">Shreyash</p>
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