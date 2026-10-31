import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import api from '../utils/api'; 
import { Link, useNavigate } from 'react-router-dom'; 

function CheckoutModal() {
  const { cart, cartTotal, isCheckoutOpen, closeCheckout, clearCart, showToast } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' ya 'ONLINE'
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 Order Database mein save karne ka common function
  const saveOrderToDatabase = async (paymentDetails = {}) => {
    const orderPayload = {
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      totalAmount: cartTotal, 
      items: cart.map(item => {
        const originalProductId = item.id.toString().split('-')[0];
        return {
          productId: Number(originalProductId), 
          productName: item.name,
          price: item.price,
          quantity: item.quantity
        };
      }),
      ...paymentDetails 
    };

    try {
      const response = await api.post('/orders', orderPayload);
      const data = response.data;
      
      setOrderId(data.orderNumber || data.id || 'ORD-' + Date.now()); 
      setIsOrdered(true);
      clearCart(); 
      showToast("Order placed successfully!");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.message;
      alert("❌ Order Error: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 Main Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to place an order.");
      closeCheckout();
      navigate('/login');
      return;
    }

    setIsLoading(true);

    if (paymentMethod === 'COD') {
      await saveOrderToDatabase();
    } else {
      // ONLINE Payment (Razorpay)
      try {
        // 1. Backend se Razorpay Order ID generate karwayein
        const { data } = await api.post('/api/payment/create-order', {
          amount: cartTotal
        });

        // 🆕 FIX: Backend ab JSON object bhej raha hai, isliye JSON.parse hataya
        const razorpayOrder = data; 

        // 2. Razorpay Checkout Options
        const options = {
          key: razorpayOrder.key, // 🆕 Backend se aayi hui Test Key
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Organic Harvest",
          description: "Fresh Groceries Order",
          order_id: razorpayOrder.id, 
          handler: async function (response) {
            // 3. Payment Success! Ab order database mein save karein
            await saveOrderToDatabase({
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              paymentStatus: 'PAID'
            });
          },
          prefill: {
            name: formData.name,
            contact: formData.phone,
          },
          theme: {
            color: "#245b3b",
          },
          modal: {
            ondismiss: function() {
              setIsLoading(false); 
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } catch (error) {
        console.error("Razorpay Error:", error);
        alert("Payment initialization failed. Try again.");
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    closeCheckout();
    setTimeout(() => {
      setIsOrdered(false);
      setFormData({ name: '', phone: '', address: '' });
      setPaymentMethod('COD'); 
    }, 300);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[500px] rounded-[18px] p-6 max-h-[90vh] overflow-y-auto relative animate-[popIn_0.3s_ease]">
        
        <button onClick={handleClose} className="absolute top-4 right-4 text-3xl text-[#26362b] hover:text-[#245b3b] leading-none">&times;</button>

        {isOrdered ? (
          <div className="text-center py-6">
            <div className="w-[70px] h-[70px] bg-[#eaf0e5] text-[#245b3b] text-3xl font-bold flex items-center justify-center rounded-full mx-auto mb-5">✓</div>
            <h2 className="text-2xl font-bold text-[#245b3b] mb-2">Order Placed Successfully!</h2>
            <p className="text-[#737b72] text-sm mb-6">Thank you for shopping with OrganicHarvest.</p>
            
            <div className="bg-[#f6f6f0] border border-dashed border-[#e6e8df] rounded-xl p-4 mb-6 text-left text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-[#737b72]">Order ID:</span>
                <strong className="text-[#26362b]">{orderId}</strong>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#737b72]">Name:</span>
                <strong className="text-[#26362b]">{formData.name}</strong>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#737b72]">Address:</span>
                <strong className="text-[#26362b] text-right max-w-[60%]">{formData.address}</strong>
              </div>
              <div className="flex justify-between border-t border-[#e6e8df] pt-2 mt-2">
                <span className="text-[#737b72]">Total ({paymentMethod === 'COD' ? 'COD' : 'Paid Online'}):</span>
                <strong className="text-[#245b3b] text-base">₹{cartTotal}</strong>
              </div>
            </div>

            <Link 
              to="/orders"
              onClick={handleClose}
              className="w-full block bg-[#eaf0e5] text-[#245b3b] py-3 rounded-[10px] font-bold hover:bg-[#dce6d5] transition-colors mb-3 text-center"
            >
              View My Orders
            </Link>

            <button onClick={handleClose} className="w-full bg-[#245b3b] text-white py-3 rounded-[10px] font-bold hover:bg-[#19452c] transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#245b3b] mb-6">Checkout</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your name" className="w-full px-3 py-2.5 border border-[#e6e8df] rounded-lg outline-none focus:border-[#245b3b]" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Phone Number</label>
                <input type="tel" name="phone" required pattern="[0-9]{10}" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" className="w-full px-3 py-2.5 border border-[#e6e8df] rounded-lg outline-none focus:border-[#245b3b]" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Delivery Address</label>
                <textarea name="address" required rows="3" value={formData.address} onChange={handleChange} placeholder="House no, Street, Area" className="w-full px-3 py-2.5 border border-[#e6e8df] rounded-lg outline-none focus:border-[#245b3b] resize-none"></textarea>
              </div>

              {/* 🔥 PAYMENT METHOD SECTION */}
              <div>
                <label className="block text-sm font-semibold mb-2">Payment Method</label>
                <div className="space-y-2">
                  {/* COD Option */}
                  <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-[#245b3b] bg-[#eaf0e5]' : 'border-[#e6e8df] bg-white hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD" 
                      checked={paymentMethod === 'COD'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#245b3b] w-4 h-4" 
                    />
                    <span className="text-sm font-medium">Cash on Delivery (COD)</span>
                  </label>

                  {/* Online Payment Option */}
                  <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'ONLINE' ? 'border-[#245b3b] bg-[#eaf0e5]' : 'border-[#e6e8df] bg-white hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="ONLINE" 
                      checked={paymentMethod === 'ONLINE'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#245b3b] w-4 h-4" 
                    />
                    <span className="text-sm font-medium flex items-center gap-2">
                      Pay Online (UPI / Card) 
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Secure</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-[#eaf0e5] rounded-lg p-4 text-center my-4">
                <p className="text-base font-semibold">Total Amount: <strong className="text-[#245b3b]">₹{cartTotal}</strong></p>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#245b3b] text-white py-3 rounded-[10px] font-bold hover:bg-[#19452c] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : paymentMethod === 'COD' ? (
                  'Place Order (COD)'
                ) : (
                  `Pay ₹${cartTotal}`
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;