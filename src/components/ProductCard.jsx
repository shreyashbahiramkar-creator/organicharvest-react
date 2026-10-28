import { useState, memo } from 'react'; 
import { Link } from 'react-router-dom'; 
import { useCart } from '../context/CartContext'; 
import { optimizeImage } from '../utils/imageOptimizer'; 

function ProductCard({ product, onDelete }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart(); 
  const [imageLoaded, setImageLoaded] = useState(false);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOutOfStock = !product.stock || product.stock <= 0;

  const cartItem = cart?.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleMinusClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (quantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, -1);
    }
  };

  const handleAddClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
  };

  const handlePlusClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    updateQuantity(product.id, 1);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    onDelete(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <article 
        className="group h-full bg-white border border-[#e6e8df] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 relative flex flex-col cursor-pointer active:scale-[0.98]"
      >
        
        {/* Image Area */}
        <div className="relative overflow-hidden bg-[#f8f8f8] aspect-square">
          
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
          
          {isOutOfStock && imageLoaded && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {product.tag && !isOutOfStock && (
            <span className="absolute top-2 left-2 bg-[#eaf0e5] text-[#245b3b] px-2 py-1 rounded-md text-[10px] font-bold">
              {product.tag}
            </span>
          )}

          {/* 🆕 Button aur Controller ka size chhota kiya aur position adjust ki (bottom-3 right-3) */}
          {!isOutOfStock && (
            <div className="absolute bottom-2 right-2 z-10 scale-90 origin-bottom-right">
              {quantity === 0 ? (
                <button 
                  onClick={handleAddClick} 
                  className="bg-white text-[#ff3269] border border-[#ff3269] px-3.5 py-1.5 rounded-md font-bold text-xs shadow-sm hover:bg-pink-50 active:scale-95 transition-all duration-150"
                  aria-label={`Add ${product.name}`}
                >
                  ADD
                </button>
              ) : (
                <div className="bg-[#ff3269] text-white flex items-center rounded-md font-bold text-xs shadow-md">
                  <button onClick={handleMinusClick} className="px-2 py-1.5 active:scale-75 transition-transform">-</button>
                  <span className="px-1 min-w-[16px] text-center">{quantity}</span>
                  <button onClick={handlePlusClick} className="px-2 py-1.5 active:scale-75 transition-transform">+</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Area */}
        <div className="p-3 flex flex-col flex-grow">
          
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className="bg-[#1a8a3f] text-white px-1.5 py-0.5 rounded text-[11px] md:text-xs font-bold">
              ₹{product.price}
            </span>
            
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-[10px] md:text-[11px]">
                ₹{product.originalPrice}
              </span>
            )}

            {discountPercentage > 0 && (
              <span className="text-[9px] md:text-[10px] text-green-600 font-bold bg-green-50 px-1 py-0.5 rounded">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          <h3 className="text-[12px] md:text-sm font-semibold text-gray-800 leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-500 text-[10px] md:text-[11px] mb-2">{product.unit || product.weight}</p>
          
          {!isOutOfStock && product.stock <= 5 && (
            <p className="text-red-500 text-[9px] md:text-[10px] font-bold mt-auto">
              Only {product.stock} left!
            </p>
          )}

          {isAdmin && onDelete && (
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
    </Link>
  );
}

export default memo(ProductCard);