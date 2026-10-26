import { useCart } from '../context/CartContext';

function FloatingCart() {
  const { cartCount, cartTotal, openCart } = useCart();

  // Agar cart khali hai, toh button hide kar do
  if (cartCount === 0) return null;

  return (
    <>
      {/* 🆕 Animation CSS directly component ke andar */}
      <style>
        {`
          @keyframes slideUp {
            from { transform: translate(-50%, 100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
          .animate-slide-up {
            animation: slideUp 0.3s ease-out forwards;
          }
        `}
      </style>

      {/* Screen ke bottom par fix rahega */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-[400px] md:max-w-[450px] animate-slide-up">
        <button 
          onClick={openCart}
          className="w-full bg-[#ff3269] hover:bg-[#e62b5e] text-white rounded-full flex items-center justify-between p-2 pl-3 pr-2 shadow-[0_8px_20px_rgba(255,50,105,0.3)] transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <div className="bg-white/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            
            {/* Cart Details */}
            <div className="flex flex-col items-start leading-tight">
              <span className="font-bold text-sm">Cart</span>
              <span className="text-[11px] font-medium text-white/90">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} • ₹{cartTotal}
              </span>
            </div>
          </div>

          {/* Right Arrow */}
          <div className="bg-white/20 p-2 rounded-full mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </button>
      </div>
    </>
  );
}

export default FloatingCart;