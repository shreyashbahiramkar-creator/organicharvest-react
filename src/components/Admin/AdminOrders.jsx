import { useState, useEffect } from 'react';
import { 
  Search, Eye, CheckCircle2, Truck, Clock, XCircle, 
  IndianRupee, ShoppingBag, Users, Box, X, Phone, MapPin 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch Orders
  useEffect(() => {
    fetch('https://organicharvest-backend.onrender.com/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  // Status Update Function
  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`https://organicharvest-backend.onrender.com/api/orders/${id}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      alert('Server error!');
    }
  };

  // Calculate Stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
  const uniqueCustomers = new Set(orders.map(o => o.phone)).size;

  // Chart Data Preparation
  const statusData = [
    { name: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, color: '#22c55e' },
    { name: 'Shipped', value: orders.filter(o => o.status === 'SHIPPED').length, color: '#3b82f6' },
    { name: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, color: '#f59e0b' },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'CANCELLED').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Mock Line Chart Data (Baad mein backend se real dates nikal sakte hain)
  const lineData = [
    { name: 'Oct 21', orders: 5, revenue: 2000 },
    { name: 'Oct 22', orders: 8, revenue: 4500 },
    { name: 'Oct 23', orders: 12, revenue: 3500 },
    { name: 'Oct 24', orders: 15, revenue: 6000 },
    { name: 'Oct 25', orders: 10, revenue: 5500 },
    { name: 'Oct 26', orders: 20, revenue: 7000 },
    { name: 'Oct 27', orders: totalOrders, revenue: totalRevenue },
  ];

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.orderNumber || order.id.toString()).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track, manage and deliver fresh organic products to your customers.</p>
        </div>
        <button className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
          + Create Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingBag />} color="bg-green-100 text-green-700" />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<IndianRupee />} color="bg-blue-100 text-blue-700" />
        <StatCard title="Active Customers" value={uniqueCustomers} icon={<Users />} color="bg-purple-100 text-purple-700" />
        <StatCard title="Delivered Orders" value={deliveredOrders} icon={<Box />} color="bg-orange-100 text-orange-700" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <h2 className="font-bold text-gray-800 mb-6">Orders & Revenue Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={3} dot={{r: 4}} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-6">Order Status</h2>
          <div className="h-48 relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-800">{totalOrders}</span>
              <span className="text-xs text-gray-500">Total Orders</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {statusData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800">Orders ({filteredOrders.length})</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by Order ID, Customer..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No orders found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">#{order.orderNumber || order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium">
                        {order.items?.length || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🆕 Order Details Modal (Customer ne kya order kiya hai) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Order #{selectedOrder.orderNumber || selectedOrder.id}</h2>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition-colors bg-white p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Customer Name</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2"><Phone size={14}/> {selectedOrder.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Delivery Address</p>
                  <p className="font-semibold text-gray-800 flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0"/> {selectedOrder.address}</p>
                </div>
              </div>

              {/* Ordered Products List */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Ordered Products</h3>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center font-bold">
                            {item.quantity}x
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{item.productName}</p>
                            <p className="text-xs text-gray-500">₹{item.price} / unit</p>
                          </div>
                        </div>
                        <div className="font-bold text-gray-800">
                          ₹{item.subtotal}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No items found in this order.</p>
                  )}
                </div>
              </div>

              {/* Total & Status Update */}
              <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">Update Status:</span>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-green-700">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
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

export default AdminOrders;