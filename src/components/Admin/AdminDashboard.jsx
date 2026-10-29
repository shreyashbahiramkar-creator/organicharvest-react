import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🆕 Import kiya
import { Package, ShoppingCart, IndianRupee, Users, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock Data for Charts (Baad mein backend se connect karenge)
const salesData = [
  { name: 'Oct 21', revenue: 2000, orders: 15 },
  { name: 'Oct 22', revenue: 4500, orders: 22 },
  { name: 'Oct 23', revenue: 3500, orders: 18 },
  { name: 'Oct 24', revenue: 6000, orders: 30 },
  { name: 'Oct 25', revenue: 5500, orders: 25 },
  { name: 'Oct 26', revenue: 7000, orders: 35 },
  { name: 'Oct 27', revenue: 9000, orders: 48 },
];

const categoryData = [
  { name: 'Vegetables', value: 42, color: '#22c55e' },
  { name: 'Fruits', value: 28, color: '#86efac' },
  { name: 'Herbs', value: 12, color: '#fbbf24' },
  { name: 'Spices', value: 8, color: '#60a5fa' },
  { name: 'Others', value: 10, color: '#a78bfa' },
];

const AdminDashboard = ({ products }) => {
  const navigate = useNavigate(); // 🆕 Hook initialize kiya
  const [orders, setOrders] = useState([]);

  // Fetch Orders from Backend
  useEffect(() => {
    fetch('https://organicharvest-backend.onrender.com/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  // Calculate Stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 15).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin! Here's what's happening with your store today.</p>
        </div>
        {/* 🆕 Button updated with onClick */}
        <button 
          onClick={() => navigate('/admin/products')} 
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={totalProducts} icon={<Package />} color="bg-green-100 text-green-700" trend="+12%" />
        <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingCart />} color="bg-blue-100 text-blue-700" trend="+18%" />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<IndianRupee />} color="bg-orange-100 text-orange-700" trend="+24%" />
        <StatCard title="Active Customers" value="36" icon={<Users />} color="bg-purple-100 text-purple-700" trend="+15%" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-800">Sales Overview</h2>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-200"></span> Orders</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-6">Category Sales</h2>
          <div className="h-56 relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</span>
              <span className="text-xs text-gray-500">Total Sales</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-medium text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-gray-50">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <button className="text-sm text-green-600 font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Order ID</th>

                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">#{order.orderNumber || order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customerName}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-6 text-gray-500">No recent orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Low Stock Alert
            </h2>
            <button className="text-sm text-green-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.stock} units left</p>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                  {product.stock} left
                </span>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">All products are well stocked!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </span>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
      <p className="text-xs text-gray-400 mt-2">vs. last month</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    DELIVERED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default AdminDashboard;