import { createContext, useState, useContext, useRef, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // 1. Initial state localStorage se uthao
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('organicHarvestCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Toast State (Sirf errors ke liye)
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  // 🆕 Naya State: Temporary Cart Notification ke liye
  const [cartNotification, setCartNotification] = useState(null);

  // 2. Jab bhi cart change ho, localStorage mein save karo
  useEffect(() => {
    localStorage.setItem('organicHarvestCart', JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  
  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  // Toast Function (Errors ke liye)
  const showToast = (message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500); 
  };

  // 🆕 UPDATED: Stock Check ke saath addToCart
  const addToCart = (product) => {
    // Check 1: Kya product out of stock hai?
    if (product.stock === undefined || product.stock === null || product.stock <= 0) {
      showToast(`❌ ${product.name} is Out of Stock!`);
      return;
    }

    // Check 2: Kya cart mein pehle se stock limit tak quantity hai?
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem && existingItem.quantity >= product.stock) {
      showToast(`Only ${product.stock} items available!`);
      return;
    }

    // Agar sab sahi hai, toh cart mein add karo
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === product.id);
      if (item) {
        return prevCart.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    // 🆕 Toast ki jagah Cart Notification trigger karo
    // Timestamp isliye add kiya hai taaki agar same product dobara add ho, toh bhi notification trigger ho
    setCartNotification({ product, timestamp: Date.now() });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 🆕 UPDATED: updateQuantity mein bhi stock check
  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + amount;
          
          if (newQty <= 0) return item; // 0 se niche nahi jayega
          
          // Agar quantity badha rahe hain aur stock se zyada ho rahi hai
          if (amount > 0 && newQty > item.stock) {
            showToast(`Only ${item.stock} items available!`);
            return item; // Quantity update mat karo
          }
          
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        toastMessage, 
        showToast,
        cartNotification, // 🆕 Context mein pass kiya
        setCartNotification // 🆕 Context mein pass kiya
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}