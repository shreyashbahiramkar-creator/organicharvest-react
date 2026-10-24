import { useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // <-- Naya Import

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export default function TrackOrder() {
  // URL se orderId nikalne ke liye
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  // Agar URL mein ID hai, toh input box pehle se bharा hoga
  const [orderNumber, setOrderNumber] = useState(initialOrderId);
  
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/api/orders/track/${orderNumber.trim()}`);
      if (!res.ok) throw new Error("Order nahi mila. Kripya sahi Order ID daalein.");
      
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Current status ka index nikalne ke liye (Progress bar ke liye)
  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#fffefa] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#245b3b] mb-2 text-center">Track Your Order</h1>
        <p className="text-center text-gray-500 mb-8">Apna Order ID daalein aur apne order ki sthiti janein.</p>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-10 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="e.g. ORD-20241024-0001"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            className="flex-1 px-4 py-3 border border-[#e6e8df] rounded-lg outline-none focus:border-[#245b3b]"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#245b3b] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#19452c] disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && <p className="text-red-500 text-center font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}

        {/* Order Details */}
        {order && (
          <div className="bg-white p-6 md:p-8 rounded-[18px] shadow-lg border border-[#e6e8df]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-mono font-bold text-lg text-[#245b3b]">{order.orderNumber}</p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-lg text-[#245b3b]">₹{order.totalAmount}</p>
              </div>
            </div>

            {/* Progress Bar */}
            {order.status !== 'CANCELLED' ? (
              <div className="relative mb-12 mt-4">
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-0"></div>
                <div 
                  className="absolute top-4 left-0 h-1 bg-[#245b3b] -z-0 transition-all duration-500"
                  style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                ></div>
                
                <div className="flex justify-between relative z-10">
                  {STATUS_STEPS.map((step, index) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                        index <= currentStep 
                          ? 'bg-[#245b3b] border-[#245b3b] text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {index <= currentStep ? '✓' : index + 1}
                      </div>
                      <span className={`text-xs mt-2 font-semibold ${index <= currentStep ? 'text-[#245b3b]' : 'text-gray-400'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-center font-bold">
                ❌ Yeh order cancel kar diya gaya hai.
              </div>
            )}

            {/* Items List */}
            <h3 className="font-bold text-lg mb-4 text-[#26362b]">Items in this order</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                  <span className="font-medium">{item.productName} <span className="text-gray-500">× {item.quantity}</span></span>
                  <span className="font-bold">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}