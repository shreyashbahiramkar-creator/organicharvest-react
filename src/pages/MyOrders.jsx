import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14}/> Pending</span>;
      case 'PROCESSING':
        return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold"><Package size={14}/> Processing</span>;
      case 'SHIPPED':
        return <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-xs font-bold"><Truck size={14}/> Shipped</span>;
      case 'DELIVERED':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14}/> Delivered</span>;
      case 'CANCELLED':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={14}/> Cancelled</span>;
      default:
        return <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-xs font-bold">{status || 'Pending'}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffefa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#245b3b]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffefa] py-10 px-4">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-[#245b3b]" />
          <h1 className="text-3xl font-extrabold text-[#245b3b]">My Orders</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#e6e8df]">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/" className="bg-[#245b3b] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1a452c] transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-[#e6e8df] shadow-sm overflow-hidden">
                <div className="bg-[#f8f9f5] px-6 py-4 border-b border-[#e6e8df] flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Order ID</p>
                    <p className="font-bold text-[#26362b]">#{order.orderNumber || order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Date</p>
                    <p className="font-medium text-[#26362b]">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="font-bold text-[#245b3b]">₹{order.totalAmount}</p>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <Package size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#26362b]">{item.productName}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <div className="font-bold text-[#26362b]">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-white border-t border-[#e6e8df] flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Delivery to: <span className="font-medium text-[#26362b]">{order.address}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}