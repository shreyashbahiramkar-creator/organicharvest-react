import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Eye, X, Phone, MapPin, ShoppingBag, IndianRupee, Users, Box,
  ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown,
  CheckCircle2, Truck, Clock, XCircle, Package
} from 'lucide-react';
import AdminLayout from '../AdminLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API = 'https://organicharvest-backend.onrender.com';
const ITEMS_PER_PAGE = 7;

const AdminOrders = ({ allProducts = [] }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  /* Fetch Orders — 🔴 NEWEST FIRST (sabse last checkout = sabse upar) */
  useEffect(() => {
    fetch(`${API}/api/orders`)
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  /* Status Update */
  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API}/api/orders/${id}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: newStatus } : o)));
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

  /* ═══ Stats ═══ */
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;
  const uniqueCustomers = new Set(orders.map(o => o.phone)).size;

  /* Trend helper — last 7 days vs previous 7 days (real data) */
  const trend = (reducer) => {
    const now = Date.now();
    const inRange = (o, from, to) => {
      const d = new Date(o.createdAt).getTime();
      return !isNaN(d) && d >= now - to * 864e5 && d < now - from * 864e5;
    };
    const curr = orders.filter(o => inRange(o, 0, 7)).reduce(reducer, 0);
    const prev = orders.filter(o => inRange(o, 7, 14)).reduce(reducer, 0);
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const ordersTrend = trend((s) => s + 1);
  const revenueTrend = trend((s, o) => s + (o.totalAmount || 0));
  const customersTrend = trend((s, o) => s + (o.phone ? 1 : 0));
  const deliveredTrend = trend((s, o) => s + (o.status === 'DELIVERED' ? 1 : 0));

  /* Product image lookup — productId se products list se image nikalo */
  const getProductImage = (productId) => {
    const p = allProducts.find((pr) => pr.id === productId);
    return p ? p.image : null;
  };

  /* ═══ Chart Data — REAL (orders ko date ke hisaab se group kiya) ═══ */
  const lineData = useMemo(() => {
    const byDate = {};
    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      if (isNaN(d)) return;
      const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (!byDate[key]) byDate[key] = { name: key, orders: 0, revenue: 0 };
      byDate[key].orders += 1;
      byDate[key].revenue += o.totalAmount || 0;
    });
    return Object.values(byDate).slice(-7);
  }, [orders]);

  const statusData = [
    { name: 'Delivered', value: deliveredOrders, color: '#22c55e' },
    { name: 'Shipped', value: shippedOrders, color: '#3b82f6' },
    { name: 'Pending', value: pendingOrders, color: '#f59e0b' },
    { name: 'Cancelled', value: cancelledOrders, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  /* Right panel — Status Summary */
  const statusSummary = [
    { label: 'Delivered', count: deliveredOrders, color: '#22c55e', Icon: CheckCircle2 },
    { label: 'Shipped', count: shippedOrders, color: '#3b82f6', Icon: Truck },
    { label: 'Pending', count: pendingOrders, color: '#f59e0b', Icon: Clock },
    { label: 'Cancelled', count: cancelledOrders, color: '#ef4444', Icon: XCircle },
  ];

  /* Right panel — Recent Activity (latest top pe) */
  const recentActivity = orders.slice(0, 5).map((o) => {
    const config = {
      DELIVERED: { Icon: CheckCircle2, color: 'text-green-600 bg-green-100', text: `Order #${o.orderNumber || o.id} marked as Delivered` },
      SHIPPED: { Icon: Truck, color: 'text-blue-600 bg-blue-100', text: `Order #${o.orderNumber || o.id} shipped via Delivery` },
      PENDING: { Icon: ShoppingBag, color: 'text-amber-600 bg-amber-100', text: `New order #${o.orderNumber || o.id} placed by ${o.customerName}` },
      CONFIRMED: { Icon: Package, color: 'text-green-600 bg-green-100', text: `Order #${o.orderNumber || o.id} confirmed` },
      CANCELLED: { Icon: XCircle, color: 'text-red-600 bg-red-100', text: `Order #${o.orderNumber || o.id} cancelled by customer` },
    }[o.status] || { Icon: ShoppingBag, color: 'text-gray-600 bg-gray-100', text: `Order #${o.orderNumber || o.id} updated` };

    return {
      id: o.id,
      ...config,
      sub: `₹${o.totalAmount} (${o.items?.length || 0} items)`,
      time: o.createdAt,
    };
  });

  /* ═══ Filter + Pagination ═══ */
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderNumber || order.id.toString()).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  /* Date range label */
  const dateRange = useMemo(() => {
    if (!orders.length) return 'No orders yet';
    const dates = orders.map((o) => new Date(o.createdAt)).filter((d) => !isNaN(d));
    if (!dates.length) return '';
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${fmt(min)} – ${fmt(max)}`;
  }, [orders]);

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* ═══ Header ═══ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-500 text-sm mt-0.5">Track, manage and deliver fresh organic products to your customers.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600">
              <Calendar size={15} className="text-gray-400" />
              {dateRange}
            </div>
            <Link
              to="/admin"
              className="bg-[#0e2a1c] hover:bg-[#1a5c38] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Package size={16} /> Manage Products
            </Link>
          </div>
        </div>

        {/* ═══ Main Grid : Left content + Right panel ═══ */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 items-start">

          {/* ─────── LEFT ─────── */}
          <div className="space-y-5 min-w-0">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Orders" value={totalOrders} trend={ordersTrend} icon={<ShoppingBag size={20} />} iconBg="bg-green-100 text-green-600" />
              <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} trend={revenueTrend} icon={<IndianRupee size={20} />} iconBg="bg-blue-100 text-blue-600" />
              <StatCard title="Active Customers" value={uniqueCustomers} trend={customersTrend} icon={<Users size={20} />} iconBg="bg-purple-100 text-purple-600" />
              <StatCard title="Delivered Orders" value={deliveredOrders} trend={deliveredTrend} icon={<Box size={20} />} iconBg="bg-orange-100 text-orange-600" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-800">Orders & Revenue Overview</h2>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span>Orders</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Revenue (₹)</span>
                  </div>
                </div>
                <div className="h-60">
                  {lineData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">No order data yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4">Order Status</h2>
                <div className="h-44 relative flex justify-center items-center">
                  {statusData.length === 0 ? (
                    <div className="text-gray-400 text-sm">No data</div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={statusData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-gray-800">{totalOrders}</span>
                        <span className="text-[11px] text-gray-500">Total Orders</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-3 space-y-2.5">
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

            {/* ═══ Orders Table ═══ */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Orders ({filteredOrders.length})</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Latest orders first • Click "N items" to see ordered products</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                  <div className="relative w-full sm:w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Customer..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
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
                  <div className="p-10 text-center text-gray-500">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No orders found.</div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-5 py-3.5 font-medium">Order ID</th>
                        <th className="px-5 py-3.5 font-medium">Customer</th>
                        <th className="px-5 py-3.5 font-medium">Items</th>
                        <th className="px-5 py-3.5 font-medium">Total</th>
                        <th className="px-5 py-3.5 font-medium">Payment</th>
                        <th className="px-5 py-3.5 font-medium">Status</th>
                        <th className="px-5 py-3.5 font-medium">Date</th>
                        <th className="px-5 py-3.5 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedOrders.map((order) => (
                        <FragmentRow
                          key={order.id}
                          order={order}
                          expanded={expandedId === order.id}
                          onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                          onView={() => setSelectedOrder(order)}
                          getProductImage={getProductImage}
                        />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {!loading && filteredOrders.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-xs text-gray-500">
                    Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#245b3b] hover:text-[#245b3b] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = safePage <= 3 ? i + 1 : safePage + i - 2;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                            pageNum === safePage
                              ? 'bg-[#0e2a1c] text-white'
                              : 'border border-gray-200 text-gray-600 hover:border-[#245b3b] hover:text-[#245b3b]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage === totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#245b3b] hover:text-[#245b3b] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─────── RIGHT PANEL ─────── */}
          <div className="space-y-5">

            {/* Order Status Summary */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">Order Status Summary</h2>
              <div className="space-y-4">
                {statusSummary.map(({ label, count, color, Icon }) => {
                  const percent = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}1a`, color }}>
                            <Icon size={14} />
                          </span>
                          {label}
                        </span>
                        <span className="text-sm text-gray-500">
                          <b className="text-gray-800">{count}</b> • {percent}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800">Recent Activity</h2>
                <span className="text-xs text-gray-400">Latest first</span>
              </div>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-400">No activity yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((act) => (
                    <div key={act.id} className="flex gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.color}`}>
                        <act.Icon size={15} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-snug">{act.text}</p>
                        <p className="text-xs text-gray-500">{act.sub}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {new Date(act.time).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Keep Growing card */}
            <div className="bg-gradient-to-br from-[#eaf5e0] to-[#d3edbd] rounded-2xl p-5 relative overflow-hidden">
              <span className="w-9 h-9 bg-white/80 rounded-xl flex items-center justify-center text-[#245b3b] mb-3">
                <TrendingUp size={18} />
              </span>
              <p className="font-bold text-[#0e2a1c]">Keep Growing</p>
              <p className="text-xs text-[#0e2a1c]/60 mt-0.5">More orders. Happier customers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Order Details Modal ═══ */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Order #{selectedOrder.orderNumber || selectedOrder.id}</h2>
                <p className="text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition-colors bg-white p-2 rounded-full shadow-sm">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Customer Name</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2"><Phone size={14} /> {selectedOrder.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Delivery Address</p>
                  <p className="font-semibold text-gray-800 flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {selectedOrder.address}</p>
                </div>
              </div>

              {/* Ordered Products — images ke saath */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Ordered Products</h3>
                <div className="space-y-2.5">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => {
                      const img = getProductImage(item.productId);
                      return (
                        <div key={index} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            {img ? (
                              <img src={img} alt={item.productName} className="w-11 h-11 rounded-lg object-cover border border-gray-100" />
                            ) : (
                              <div className="w-11 h-11 bg-green-50 text-green-700 rounded-lg flex items-center justify-center font-bold text-sm">
                                {item.quantity}x
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{item.productName}</p>
                              <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                            </div>
                          </div>
                          <div className="font-bold text-gray-800">₹{item.subtotal ?? item.price * item.quantity}</div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">No items found in this order.</p>
                  )}
                </div>
              </div>

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
    </AdminLayout>
  );
};

/* ═══ Table Row + Expandable Items ═══ */
const FragmentRow = ({ order, expanded, onToggle, onView, getProductImage }) => (
  <>
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-4 font-medium text-gray-800 whitespace-nowrap">#{order.orderNumber || order.id}</td>
      <td className="px-5 py-4 text-sm text-gray-600">{order.customerName}</td>
      <td className="px-5 py-4">
        <button
          onClick={onToggle}
          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all inline-flex items-center gap-1 ${
            expanded ? 'bg-[#0e2a1c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#eaf0e5] hover:text-[#245b3b]'
          }`}
        >
          {order.items?.length || 0} items
          <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </td>
      <td className="px-5 py-4 font-bold text-gray-800 whitespace-nowrap">₹{order.totalAmount}</td>
      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{order.paymentMethod || 'COD'}</td>
      <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
      </td>
      <td className="px-5 py-4 text-right">
        <button
          onClick={onView}
          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
        >
          <Eye size={13} /> View
        </button>
      </td>
    </tr>

    {/* 🛒 Expandable row — customer ne kya order kiya */}
    {expanded && (
      <tr className="bg-[#f8faf5]">
        <td colSpan="8" className="px-5 py-4">
          <div className="ml-0 sm:ml-8">
            <p className="text-xs font-bold text-[#245b3b] uppercase tracking-wider mb-2.5">
              Ordered Products — {order.customerName}
            </p>
            {order.items && order.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.items.map((item, idx) => {
                  const img = getProductImage(item.productId);
                  return (
                    <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-2.5 border border-gray-100">
                      {img ? (
                        <img src={img} alt={item.productName} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      ) : (
                        <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center font-bold text-xs">
                          {item.quantity}x
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm text-gray-800 whitespace-nowrap">₹{item.subtotal ?? item.price * item.quantity}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No items found.</p>
            )}
          </div>
        </td>
      </tr>
    )}
  </>
);

/* ═══ Helper Components (sirf EK baar defined) ═══ */
const StatCard = ({ title, value, trend, icon, iconBg }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
      {trend !== undefined && <TrendBadge value={trend} />}
    </div>
    <p className="text-gray-500 text-xs font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{value}</h3>
  </div>
);

const TrendBadge = ({ value }) => (
  <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
    {value >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
    {Math.abs(value)}%
    <span className="text-gray-400 font-normal hidden sm:inline">vs last week</span>
  </span>
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
    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default AdminOrders;