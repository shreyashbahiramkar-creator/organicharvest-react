import { useState, memo } from 'react'; 
import { useCart } from '../context/CartContext'; 
import { optimizeImage } from '../utils/imageOptimizer'; 

// 🆕 onProductClick prop add kiya (Modal open karne ke liye)
function ProductCard({ product, onDelete, onProductClick }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart(); 
  const [imageLoaded, setImageLoaded] = useState(false);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOutOfStock = !product.stock || product.stock <= 0;

  const cartItem = cart?.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // 🆕 Handle Minus Click (e.stopPropagation se card ka click rok rahe hain)
  const handleMinusClick = (e) => {
    e.stopPropagation(); 
    if (quantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, -1);
    }
  };

  // 🆕 Handle Add Click
  const handleAddClick = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  // 🆕 Handle Plus Click
  const handlePlusClick = (e) => {
    e.stopPropagation();
    updateQuantity(product.id, 1);
  };

  // 🆕 Handle Delete Click
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(product.id);
  };

  return (
    // 🆕 onClick add kiya modal open karne ke liye, cursor-pointer aur active:scale lagaya
    <article 
      onClick={() => onProductClick && onProductClick(product)}
      className="group min-w-0 bg-white border border-[#e6e8df] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 relative flex flex-col cursor-pointer active:scale-[0.98]"
    >
      
      {/* Image Area */}
      <div className="relative overflow-hidden bg-[#f8f8f8] aspect-square">
        
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <img 
          src={optimizeImage(product.image, 400, 400)} 
          alt={product.name} 
          loading="lazy"
          decoding="async" 
          onLoad={() => setImageLoaded(true)} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 
            ${isOutOfStock ? 'opacity-60 grayscale-[50%]' : ''} 
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
        />
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && imageLoaded && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Tag */}
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
                onClick={handleAddClick} 
                className="bg-white text-[#ff3269] border border-[#ff3269] px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm hover:bg-pink-50 active:scale-90 transition-all duration-150"
                aria-label={`Add ${product.name}`}
              >
                ADD
              </button>
            ) : (
              <div className="bg-[#ff3269] text-white flex items-center rounded-lg font-bold text-sm shadow-md">
                <button onClick={handleMinusClick} className="px-2 py-1.5 active:scale-75 transition-transform">-</button>
                <span className="px-1 min-w-[20px] text-center">{quantity}</span>
                <button onClick={handlePlusClick} className="px-2 py-1.5 active:scale-75 transition-transform">+</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-3 flex flex-col flex-grow">
        
        {/* Pricing */}
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
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700 text-[10px] font-semibold flex items-center gap-1 active:scale-95 transition-transform"
            >
              🗑️ Delete
            </button>
          </div>
        )}

      </div>

    </article>
  );
}

// React.memo se unnecessary re-renders rokta hai
export default memo(ProductCard);