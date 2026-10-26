import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

function CartNotification() {
  const { cartNotification, cartCount, cartTotal, openCart } = useCart();
  const [visible, setVisible] = useState(false);

  // Jab bhi naya product add ho, notification dikhao aur 3 second baad hide karo
  useEffect(() => {
    if (cartNotification) {
      setVisible(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [cartNotification]);

  if (!visible || !cartNotification || cartCount === 0) return null;

  const handleGoToCart = () => {
    setVisible(false); // Pehle hide karo
    openCart(); // Phir cart drawer open karo
  };

  return (
    <>
      <style>
        {`
          @keyframes slideUpNotif {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up-notif {
            animation: slideUpNotif 0.3s ease-out forwards;
          }
        `}
      </style>

      {/* 🆕 FIX: inset-x-0 aur mx-auto se mobile par perfect center ho jayega */}
      <div className="fixed bottom-4 inset-x-0 mx-auto z-[9999] w-[92%] max-w-[420px] animate-slide-up-notif">
        <div className="bg-[#ff3269] text-white rounded-full flex items-center justify-between p-2 pl-4 pr-2 shadow-[0_8px_20px_rgba(255,50,105,0.4)]">
          
          {/* Left: Icon + Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-bold text-sm truncate">
                {cartNotification.product.name} added
              </span>
              <span className="text-[11px] font-medium text-white/90">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} • ₹{cartTotal}
              </span>
            </div>
          </div>

          {/* Right: Go to Cart Button */}
          <button 
            onClick={handleGoToCart}
            className="bg-white text-[#ff3269] font-bold text-xs px-3 py-2 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0 ml-2"
          >
            Go to Cart →
          </button>
        </div>
      </div>
    </>
  );
}

export default CartNotification;