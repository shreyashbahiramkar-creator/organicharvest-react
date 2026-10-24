import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; // <-- Naya Import

function CheckoutModal() {
  const { cart, cartTotal, isCheckoutOpen, closeCheckout, clearCart, showToast } = useCart();
  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const orderPayload = {
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) throw new Error('Order place nahi ho paya');

      const data = await response.json();
      
      setOrderId(data.orderNumber); 
      setIsOrdered(true);
      clearCart();
      showToast("Order placed successfully!");

    } catch (error) {
      console.error(error);
      alert("❌ Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    closeCheckout();
    setTimeout(() => {
      setIsOrdered(false);
      setFormData({ name: '', phone: '', address: '' });
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
                <span className="text-[#737b72]">Total (COD):</span>
                <strong className="text-[#245b3b] text-base">₹{cartTotal}</strong>
              </div>
            </div>

            {/* 🆕 Naya Button: Track Order */}
            <Link 
              to={`/track-order?orderId=${orderId}`}
              onClick={handleClose}
              className="w-full block bg-[#eaf0e5] text-[#245b3b] py-3 rounded-[10px] font-bold hover:bg-[#dce6d5] transition-colors mb-3 text-center"
            >
              Track This Order
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

              <div>
                <label className="block text-sm font-semibold mb-1">Payment Method</label>
                <div className="flex items-center gap-3 p-3 border border-[#e6e8df] rounded-lg bg-[#f6f6f0]">
                  <input type="radio" checked readOnly className="accent-[#245b3b]" />
                  <span className="text-sm font-medium">Cash on Delivery (COD)</span>
                </div>
              </div>

              <div className="bg-[#eaf0e5] rounded-lg p-4 text-center my-4">
                <p className="text-base font-semibold">Total Amount: <strong className="text-[#245b3b]">₹{cartTotal}</strong></p>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#245b3b] text-white py-3 rounded-[10px] font-bold hover:bg-[#19452c] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;