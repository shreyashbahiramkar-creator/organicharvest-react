import { useCart } from '../context/CartContext'; 

function ProductCard({ product, onDelete }) {
  const { addToCart } = useCart(); 

  // Check karo ki stock available hai ya nahi
  const isOutOfStock = !product.stock || product.stock <= 0;

  return (
    <article className="group min-w-0 bg-white border border-[#e6e8df] rounded-[18px] overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(36,91,59,0.07)] transition-all duration-200 relative">
      
      {/* Image Area */}
      <div className="relative overflow-hidden bg-[#eeeee5]">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className={`w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'opacity-60 grayscale-[50%]' : ''}`}
        />
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {product.tag && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-[#eaf0e5] text-[#245b3b] px-2 py-1 rounded-md text-[10px] font-bold">
            {product.tag}
          </span>
        )}
      </div>

      {/* Info Area */}
      <div className="p-4">
        <p className="text-[#737b72] text-[11px] mb-1">{product.category}</p>
        <h3 className="text-[15px] font-semibold text-[#26362b] leading-tight mb-1">
          {product.name}
        </h3>

        {/* 🆕 Low Stock Warning */}
        {!isOutOfStock && product.stock <= 5 && (
          <p className="text-red-500 text-[11px] font-bold mb-2">
            Only {product.stock} left in stock!
          </p>
        )}
        
        <div className="flex items-center justify-between gap-2 mt-3">
          <p className="text-base font-extrabold text-[#26362b]">
            ₹{product.price} <span className="text-[#737b72] text-[11px] font-normal">/ {product.unit}</span>
          </p>
          
          {/* 🆕 Add to Cart Button Logic */}
          {isOutOfStock ? (
            <button 
              disabled
              className="px-3 h-9 flex items-center justify-center border border-gray-200 rounded-[10px] bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <button 
              onClick={() => addToCart(product)} 
              className="w-9 h-9 flex items-center justify-center border border-[#cbd8c5] rounded-[10px] bg-white text-[#245b3b] text-xl font-medium hover:bg-[#245b3b] hover:text-white transition-colors"
              aria-label={`Add ${product.name}`}
            >
              +
            </button>
          )}
        </div>

        {/* 🗑️ Delete Button (Testing ke liye) */}
        <div className="mt-4 pt-3 border-t border-[#e6e8df] flex justify-end">
          <button 
            onClick={() => onDelete(product.id)}
            className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
          >
            🗑️ Delete
          </button>
        </div>

      </div>

    </article>
  );
}

export default ProductCard;