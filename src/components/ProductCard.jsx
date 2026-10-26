import { useState, memo } from 'react'; // 🆕 useState aur memo import kiya
import { useCart } from '../context/CartContext'; 
import { optimizeImage } from '../utils/imageOptimizer'; // 🆕 Image Optimizer import kiya

function ProductCard({ product, onDelete }) {
  // 🆕 Context se cart aur update functions nikaale
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart(); 

  // 🆕 Image loading state (Skeleton ke liye)
  const [imageLoaded, setImageLoaded] = useState(false);

  // 🆕 Check kar rahe hain ki user admin hai ya nahi
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Check karo ki stock available hai ya nahi
  const isOutOfStock = !product.stock || product.stock <= 0;

  // 🆕 Cart mein is product ki current quantity check karo
  const cartItem = cart?.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // 🆕 Handle Minus Click (Agar 1 hai aur minus dabaya, toh cart se hata do)
  const handleMinusClick = () => {
    if (quantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, -1);
    }
  };

  return (
    <article className="group min-w-0 bg-white border border-[#e6e8df] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 relative flex flex-col">
      
      {/* Image Area */}
      <div className="relative overflow-hidden bg-[#f8f8f8] aspect-square">
        
        {/* 🆕 Skeleton Loader (Image load hone tak dikhega) */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <img 
          src={optimizeImage(product.image, 400, 400)} // 🆕 Optimized URL use kiya
          alt={product.name} 
          loading="lazy"
          decoding="async" // 🆕 Background mein decode karega
          onLoad={() => setImageLoaded(true)} // 🆕 Load hone par skeleton hatao
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 
            ${isOutOfStock ? 'opacity-60 grayscale-[50%]' : ''} 
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} // 🆕 Smooth fade-in
        />
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && imageLoaded && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Tag (Agar product par tag hai) */}
        {product.tag && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-[#eaf0e5] text-[#245b3b] px-2 py-1 rounded-md text-[10px] font-bold">
            {product.tag}
          </span>
        )}

        {/* 🚀 Zepto Style Floating ADD Button / Counter */}
        {!isOutOfStock && (
          <div className="absolute bottom-2 right-2 z-10">
            {quantity === 0 ? (
              <button 
                onClick={() => addToCart(product)} 
                className="bg-white text-[#ff3269] border border-[#ff3269] px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm hover:bg-pink-50 transition-colors"
                aria-label={`Add ${product.name}`}
              >
                ADD
              </button>
            ) : (
              <div className="bg-[#ff3269] text-white flex items-center rounded-lg font-bold text-sm shadow-md">
                <button onClick={handleMinusClick} className="px-2 py-1.5">-</button>
                <span className="px-1 min-w-[20px] text-center">{quantity}</span>
                <button onClick={() => updateQuantity(product.id, 1)} className="px-2 py-1.5">+</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-3 flex flex-col flex-grow">
        
        {/* 🆕 Pricing (Green Box + Strikethrough) */}
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#1a8a3f] text-white px-1.5 py-0.5 rounded text-xs font-bold">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-xs">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Name & Unit */}
        <h3 className="text-[13px] md:text-sm font-semibold text-gray-800 leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-[11px] mb-2">{product.unit || product.weight}</p>
        
        {/* Low Stock Warning */}
        {!isOutOfStock && product.stock <= 5 && (
          <p className="text-red-500 text-[10px] font-bold mt-auto">
            Only {product.stock} left!
          </p>
        )}

        {/* 🗑️ Delete Button (Sirf Admin ke liye) */}
        {onDelete && isAdmin && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
            <button 
              onClick={() => onDelete(product.id)}
              className="text-red-500 hover:text-red-700 text-[10px] font-semibold flex items-center gap-1"
            >
              🗑️ Delete
            </button>
          </div>
        )}

      </div>

    </article>
  );
}

// 🆕 React.memo se unnecessary re-renders rokta hai (Fast scroll ke liye)
export default memo(ProductCard);