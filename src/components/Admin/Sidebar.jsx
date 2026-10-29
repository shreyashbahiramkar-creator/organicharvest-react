import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  Grid2X2, Boxes, Tag, BarChart3, Settings, Leaf 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders', badge: 5 },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Categories', icon: Grid2X2, path: '/admin/categories' },
    { name: 'Inventory', icon: Boxes, path: '/admin/inventory' },
    { name: 'Promotions', icon: Tag, path: '/admin/promotions' },
    { name: 'Reports', icon: BarChart3, path: '/admin/reports' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-green-600 p-2 rounded-lg text-white">
          <Leaf size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">OrganicHarvest</h1>
          <p className="text-xs text-gray-500">Fresh • Natural • Healthy</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-green-50 text-green-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="opacity-80" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Banner */}
      <div className="p-4 m-4 bg-green-50 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">
            Healthy food<br />for a better tomorrow
          </h3>
          <p className="text-[10px] text-gray-500 mb-2">Support local farmers & promote organic living.</p>
          <Leaf size={16} className="text-green-600" />
        </div>
      </div>

      {/* Version */}
      <div className="p-4 text-xs text-gray-400 flex items-center gap-2">
        <Leaf size={14} /> OrganicHarvest Admin Panel v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;