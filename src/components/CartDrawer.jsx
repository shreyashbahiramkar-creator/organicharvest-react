import { useCart } from '../context/CartContext';

/* Free delivery threshold — apne hisaab se badal lena */
const FREE_DELIVERY_ABOVE = 499;

function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal, openCheckout } = useCart();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* Total savings (originalPrice se) */
  const totalSavings = cart.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  /* Free delivery progress */
  const remaining = Math.max(0, FREE_DELIVERY_ABOVE - cartTotal);
  const progress = Math.min(100, (cartTotal / FREE_DELIVERY_ABOVE) * 100);

  return (
    <>
      {/* Overlay (Background dark) */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      ></div>

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full max-w-[400px] bg-white z-[100] flex flex-col shadow-[-5px_0_15px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header — item count badge ke saath */}
        <div className="flex justify-between items-center p-5 border-b border-[#e6e8df]">
          <h2 className="text-xl font-bold text-[#245b3b] m-0 flex items-center gap-2">
            Your Bag
            {itemCount > 0 && (
              <span className="bg-[#eaf0e5] text-[#245b3b] text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="text-3xl text-[#26362b] leading-none hover:text-[#245b3b] transition-colors"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        {cart.length > 0 && (
          <div className="px-5 pt-4">
            <div className="bg-[#eaf0e5] rounded-xl p-3">
              <p className="text-xs font-semibold text-[#245b3b] mb-2">
                {remaining > 0 ? (
                  <>🚚 Add <b>₹{remaining}</b> more for FREE delivery!</>
                ) : (
                  <>🎉 Yay! You've unlocked <b>FREE delivery</b>!</>
                )}
              </p>
              <div className="h-1.5 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#245b3b] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            /* Better empty state */
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <span className="text-5xl">🛒</span>
              <p className="text-[#737b72] font-medium">Your bag is empty.</p>
              <p className="text-xs text-[#737b72]/70 -mt-2">Fresh groceries are waiting for you!</p>
              <button
                onClick={closeCart}
                className="mt-2 bg-[#245b3b] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#19452c] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-center mb-5 pb-4 border-b border-[#e6e8df]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[60px] h-[60px] rounded-lg object-cover bg-[#f8f8f8]"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">{item.name}</h4>
                  <p className="text-[13px] text-[#737b72] mb-2">
                    ₹{item.price} x {item.quantity} = <b className="text-[#26362b]">₹{item.price * item.quantity}</b>
                  </p>

                  <div className="flex justify-between items-center">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-[#f6f6f0] rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 bg-white rounded-md text-[#245b3b] font-bold flex items-center justify-center hover:bg-[#eaf0e5] transition-colors"
                      >
                        −
                      </button>
                      <span className="text-[13px] font-bold min-w-[22px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 bg-white rounded-md text-[#245b3b] font-bold flex items-center justify-center hover:bg-[#eaf0e5] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#d9534f] text-xs font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#e6e8df] bg-[#f6f6f0]">
          {/* Savings line */}
          {totalSavings > 0 && (
            <div className="flex justify-between text-sm font-semibold text-[#245b3b] mb-2">
              <span>You're saving:</span>
              <span>₹{totalSavings} 🎉</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total:</span>
            <span>₹{cartTotal}</span>
          </div>
          <button 
            onClick={() => {
              closeCart();      // Drawer band karo
              openCheckout();   // Checkout modal kholo
            }}
            disabled={cart.length === 0}
            className="w-full bg-[#245b3b] text-white py-3 rounded-[10px] font-bold hover:bg-[#19452c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;