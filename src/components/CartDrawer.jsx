import { useCart } from '../context/CartContext';

function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal, openCheckout } = useCart();

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
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#e6e8df]">
          <h2 className="text-xl font-bold text-[#245b3b] m-0">Your Bag</h2>
          <button
            onClick={closeCart}
            className="text-3xl text-[#26362b] leading-none hover:text-[#245b3b] transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <p className="text-center text-[#737b72] mt-5">Your bag is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-center mb-5 pb-4 border-b border-[#e6e8df]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[60px] h-[60px] rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">{item.name}</h4>
                  <p className="text-[13px] text-[#737b72] mb-2">
                    ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
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
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total:</span>
            <span>₹{cartTotal}</span>
          </div>
          <button 
            onClick={() => {
              closeCart();      // Drawer band karo
              openCheckout();   // Checkout modal kholo
            }}
            className="w-full bg-[#245b3b] text-white py-3 rounded-[10px] font-bold hover:bg-[#19452c] transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;