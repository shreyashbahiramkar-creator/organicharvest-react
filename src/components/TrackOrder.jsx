import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderId);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🆕 Auto-Track Logic: Agar URL mein ID hai, toh direct fetch karo
  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrder = async (idToSearch) => {
    if (!idToSearch.trim()) return;
    setError('');
    setOrder(null);
    setLoading(true);

    try {
      const res = await fetch(`https://organicharvest-backend.onrender.com/api/orders/track/${idToSearch.trim()}`);
      if (!res.ok) throw new Error("Order nahi mila. Kripya sahi Order ID daalein.");
      
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#fffefa] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#245b3b] mb-2">Track Your Order</h1>
          <p className="text-gray-500">Apna Order ID daalein aur apne order ki sthiti janein.</p>
        </div>

        {/* Search Form (Agar URL mein ID nahi hai tabhi dikhega) */}
        {!initialOrderId && (
          <form onSubmit={handleTrack} className="flex gap-2 mb-10 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="e.g. ORD-20241024-0001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              className="flex-1 px-4 py-3 border border-[#e6e8df] rounded-lg outline-none focus:border-[#245b3b] shadow-sm"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#245b3b] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#19452c] disabled:opacity-50 shadow-sm transition-all"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        )}

        {error && (
          <div className="text-center bg-red-50 border border-red-200 p-4 rounded-xl max-w-xl mx-auto">
            <p className="text-red-600 font-semibold">❌ {error}</p>
            <Link to="/track-order" className="text-sm text-red-500 underline mt-2 inline-block">Try another Order ID</Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#245b3b]"></div>
          </div>
        )}

        {/* Order Details (Advanced UI) */}
        {order && !loading && (
          <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-xl border border-[#e6e8df] animate-[fadeIn_0.5s_ease]">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Order Number</p>
                <p className="font-mono font-bold text-xl text-[#245b3b]">{order.orderNumber}</p>
              </div>
              <div className="bg-[#eaf0e5] px-4 py-2 rounded-lg text-left md:text-right">
                <p className="text-xs text-[#245b3b] font-bold uppercase tracking-wider">Estimated Delivery</p>
                <p className="font-bold text-gray-800">Tomorrow, 10 AM - 2 PM</p>
              </div>
            </div>

            {/* Vertical Timeline Progress */}
            {order.status !== 'CANCELLED' ? (
              <div className="mb-10 pl-2">
                <h3 className="font-bold text-lg mb-6 text-gray-800">Order Status</h3>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    
                    return (
                      <div key={step} className="relative pl-8">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 flex items-center justify-center ${
                          isCompleted ? 'bg-[#245b3b] border-[#245b3b]' : 'bg-white border-gray-300'
                        }`}>
                          {isCompleted && <span className="text-white text-[10px]">✓</span>}
                        </div>
                        
                        {/* Content */}
                        <div>
                          <h4 className={`font-bold ${isCurrent ? 'text-[#245b3b] text-lg' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                            {step}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {step === 'PENDING' && 'Order placed successfully.'}
                            {step === 'CONFIRMED' && 'Your order has been confirmed by the store.'}
                            {step === 'SHIPPED' && 'Order is out for delivery.'}
                            {step === 'DELIVERED' && 'Order delivered successfully.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-xl mb-8 text-center font-bold">
                ❌ Yeh order cancel kar diya gaya hai.
              </div>
            )}

            {/* Items List */}
            <div className="bg-[#f9f9f9] rounded-xl p-5 border border-gray-100">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Items in this order</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{item.productName}</span>
                      <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-[#245b3b]">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="font-extrabold text-xl text-[#245b3b]">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-3">Koi problem aa rahi hai?</p>
              <Link to="/#contact" className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Contact Support
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}