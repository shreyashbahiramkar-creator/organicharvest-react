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

  const handleMinusClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (quantity === 1) removeFromCart(product.id);
    else updateQuantity(product.id, -1);
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
      <article className="group h-full bg-white border border-gray-200 rounded-xl p-2 hover:shadow-md transition-all duration-200 relative flex flex-col cursor-pointer">
        
        {/* Image Area - Zepto style minimal padding */}
        <div className="relative overflow-hidden rounded-lg bg-white aspect-square mb-2 flex items-center justify-center">
          
          {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />}

          <img 
            src={optimizeImage(product.image, 400, 400)} 
            alt={product.name} 
            loading="lazy"
            decoding="async" 
            onLoad={() => setImageLoaded(true)} 
            className={`w-full h-full object-contain transition-all duration-300 
              ${isOutOfStock ? 'opacity-50 grayscale-[50%]' : ''} 
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
          />
          
          {isOutOfStock && imageLoaded && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-white text-gray-800 px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                Out of Stock
              </span>
            </div>
          )}

          {/* Tag (Optional) */}
          {product.tag && !isOutOfStock && (
            <span className="absolute top-1 left-1 bg-white/90 text-gray-700 px-1.5 py-0.5 rounded text-[9px] font-semibold shadow-sm border border-gray-100">
              {product.tag}
            </span>
          )}

          {/* 🆕 ADD / Qty Button - Zepto Style overlapping the bottom border */}
          {!isOutOfStock && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-[80%] flex justify-center">
              {quantity === 0 ? (
                <button 
                  onClick={handleAddClick} 
                  className="w-full bg-white text-[#ff3269] border border-[#ff3269] py-1.5 rounded-md font-bold text-[11px] md:text-xs shadow-sm hover:bg-pink-50 active:scale-95 transition-all"
                >
                  ADD
                </button>
              ) : (
                <div className="w-full bg-[#ff3269] text-white flex justify-between items-center rounded-md font-bold text-[11px] md:text-xs shadow-md px-1 py-1">
                  <button onClick={handleMinusClick} className="px-1.5 active:scale-75">-</button>
                  <span>{quantity}</span>
                  <button onClick={handlePlusClick} className="px-1.5 active:scale-75">+</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Area */}
        <div className="pt-3 pb-1 flex flex-col flex-grow">
          
          {/* 🆕 Price & Original Price (Zepto Style) */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-[#1a8a3f] text-white px-1.5 py-0.5 rounded text-[10px] md:text-[11px] font-bold tracking-wide">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-[10px] md:text-[11px]">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Product Name & Unit */}
          <h3 className="text-[12px] md:text-[13px] font-semibold text-gray-800 leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-500 text-[10px] md:text-[11px]">{product.unit || product.weight}</p>
          
          {!isOutOfStock && product.stock <= 5 && (
            <p className="text-red-500 text-[9px] font-bold mt-1">
              Only {product.stock} left!
            </p>
          )}

          {/* Delete Button (Only Admin) */}
          {isAdmin && onDelete && (
            <div className="mt-1 pt-1 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleDeleteClick}
                className="text-red-500 hover:text-red-700 text-[10px] font-semibold active:scale-95"
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