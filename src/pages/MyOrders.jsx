import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Package, Clock, CheckCircle, Truck, XCircle, MapPin, Eye, ArrowRight } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  // Status Badge Function
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 border border-yellow-200 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14}/> Pending</span>;
      case 'PROCESSING':
        return <span className="flex items-center gap-1 text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold"><Package size={14}/> Processing</span>;
      case 'SHIPPED':
        return <span className="flex items-center gap-1 text-purple-700 bg-purple-100 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold"><Truck size={14}/> Shipped</span>;
      case 'DELIVERED':
        return <span className="flex items-center gap-1 text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14}/> Delivered</span>;
      case 'CANCELLED':
        return <span className="flex items-center gap-1 text-red-700 bg-red-100 border border-red-200 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={14}/> Cancelled</span>;
      default:
        return <span className="text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold">{status || 'Pending'}</span>;
    }
  };

  // Filter Orders based on Tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    return order.status?.toUpperCase() === activeTab.toUpperCase();
  });

  // Tracking Timeline Component (Dynamic based on status)
  const TrackingTimeline = ({ status }) => {
    const steps = [
      { key: 'PENDING', label: 'Order Placed' },
      { key: 'PROCESSING', label: 'Processing' },
      { key: 'SHIPPED', label: 'Shipped' },
      { key: 'DELIVERED', label: 'Delivered' }
    ];

    const currentStatus = status?.toUpperCase() || 'PENDING';
    const currentIndex = steps.findIndex(s => s.key === currentStatus);

    if (currentStatus === 'CANCELLED') {
      return (
        <div className="flex items-center justify-center h-full bg-red-50 rounded-xl border border-red-100 p-4">
          <p className="text-red-600 font-bold flex items-center gap-2"><XCircle size={20} /> This order was cancelled.</p>
        </div>
      );
    }

    return (
      <div className="relative flex items-center justify-between w-full mt-4 md:mt-0">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        {/* Active Progress Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#245b3b] -z-10 rounded-full transition-all duration-500" 
          style={{ width: `${currentIndex !== -1 ? (currentIndex / (steps.length - 1)) * 100 : 0}%` }}
        ></div>
        
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 w-1/4">
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 mb-2 bg-white transition-colors duration-300 ${
                isCompleted ? 'border-[#245b3b] text-[#245b3b]' : 'border-gray-300 text-gray-300'
              } ${isCurrent ? 'ring-4 ring-[#eaf0e5]' : ''}`}>
                {isCompleted ? <CheckCircle size={14} className="md:w-4 md:h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>}
              </div>
              <p className={`text-[9px] md:text-[11px] font-bold text-center leading-tight ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffefa]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#245b3b]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffefa] py-8 px-4 md:px-8">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#eaf0e5] p-2.5 rounded-xl">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-[#245b3b]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#245b3b]">My Orders</h1>
              <p className="text-gray-500 text-xs md:text-sm mt-0.5">Track your orders and view order details</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
            <Package className="text-[#245b3b] w-5 h-5" />
            <span className="font-bold text-gray-700 text-sm">{orders.length} Total Orders</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200 font-medium">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        {orders.length > 0 && (
          <div className="flex overflow-x-auto gap-2 md:gap-3 mb-6 pb-2 scrollbar-hide">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'bg-[#245b3b] text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#245b3b]'
                }`}
              >
                {tab} {tab === 'All' ? `(${orders.length})` : `(${orders.filter(o => o.status?.toUpperCase() === tab.toUpperCase()).length})`}
              </button>
            ))}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/" className="bg-[#245b3b] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1a452c] transition-colors shadow-lg shadow-green-200">
              Start Shopping
            </Link>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <Package className="mx-auto text-gray-300 w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No {activeTab.toLowerCase()} orders</h3>
            <p className="text-gray-500">You don't have any orders in this category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-[#e6e8df] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Top Bar */}
                <div className="bg-[#f8faf7] px-4 md:px-6 py-4 border-b border-[#e6e8df] flex flex-wrap justify-between items-center gap-4">
                  <div className="flex flex-wrap gap-4 md:gap-8 text-sm">
                    <div>
                      <p className="text-gray-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1">Order ID</p>
                      <p className="font-bold text-[#26362b]">#{order.orderNumber || order.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1">Date</p>
                      <p className="font-medium text-[#26362b]">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="font-bold text-[#245b3b]">₹{order.totalAmount}</p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Body: Items & Timeline */}
                <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left: Items */}
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          
                          {/* 🔥 YAHAN item.productImage ADD KAR DIYA HAI */}
                          {item.productImage || item.imageUrl || item.image ? (
                            <img 
                              src={item.productImage || item.imageUrl || item.image} 
                              alt={item.productName} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback Icon */}
                          <Package 
                            size={24} 
                            className="text-gray-400" 
                            style={{ display: (item.productImage || item.imageUrl || item.image) ? 'none' : 'block' }} 
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#26362b] text-sm md:text-base line-clamp-1">{item.productName}</p>
                          <p className="text-xs md:text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <div className="font-bold text-[#26362b] text-sm md:text-base">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Tracking Timeline */}
                  <div className="flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center lg:text-left">Order Status</h4>
                    <TrackingTimeline status={order.status} />
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 md:px-6 py-3 border-t border-[#e6e8df] flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600 w-full md:w-auto">
                    <MapPin size={16} className="text-[#245b3b] mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1"><strong className="text-gray-800">Delivery to:</strong> {order.address}</span>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-gray-50 transition-colors">
                      <Eye size={16} /> View Details
                    </button>
                    {(order.status?.toUpperCase() === 'SHIPPED' || order.status?.toUpperCase() === 'PROCESSING') && (
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#245b3b] text-white px-4 py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-[#1a452c] transition-colors">
                        Track Order <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}