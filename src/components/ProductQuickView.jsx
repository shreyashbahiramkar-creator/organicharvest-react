import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { optimizeImage } from '../utils/imageOptimizer';

// 🆕 onProductSelect prop add kiya (Recursive modal ke liye)
function ProductQuickView({ product, allProducts, onClose, onProductSelect, setSelectedCategory }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  
  // Variants State
  const defaultVariants = [
    { unit: '250 g', price: Math.round(product.price * 0.6), originalPrice: product.originalPrice ? Math.round(product.originalPrice * 0.6) : null },
    { unit: '500 g', price: product.price, originalPrice: product.originalPrice },
    { unit: '1 kg', price: Math.round(product.price * 1.8), originalPrice: product.originalPrice ? Math.round(product.originalPrice * 1.8) : null }
  ];
  
  const variants = product.variants || defaultVariants;
  const [selectedVariant, setSelectedVariant] = useState(variants[1] || variants[0]);

  // 🆕 Jab product change ho (recommendation se), toh variant reset ho jaye
  useEffect(() => {
    setSelectedVariant(variants[1] || variants[0]);
  }, [product.id]);

  // 🆕 Recommended Products (Saare same category ke products, 10 tak)
  const recommendedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 10); 

  // Cart check for this specific variant
  const variantId = `${product.id}-${selectedVariant.unit.replace(/\s/g, '')}`;
  const cartItem = cart?.find(item => item.id === variantId);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Handle Add to Cart for specific variant
  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      id: variantId,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      unit: selectedVariant.unit,
      name: `${product.name} (${selectedVariant.unit})`
    };
    addToCart(productToAdd);
  };

  const handleMinusClick = () => {
    if (quantity === 1) {
      removeFromCart(variantId);
    } else {
      updateQuantity(variantId, -1);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
      {/* Modal Container - Explicitly white background for light mode */}
      <div className="bg-white text-gray-900 w-full max-w-4xl rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-y-auto relative animate-slide-up shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full z-10 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            
            {/* Left: Image */}
            <div className="bg-[#f8f8f8] rounded-xl overflow-hidden aspect-square relative">
              <img 
                src={optimizeImage(product.image, 600, 600)} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{product.category}</p>
              
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {product.description || `Fresh and high-quality ${product.name.toLowerCase()} sourced directly from local farms. Perfect for your daily kitchen needs.`}
              </p>

              {/* 🆕 Variants Selector (Price ke saath) */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Select Quantity</h3>
                <div className="flex gap-2 flex-wrap">
                  {variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all min-w-[80px] ${
                        selectedVariant.unit === v.unit 
                          ? 'border-[#245b3b] bg-[#eaf0e5] text-[#245b3b]' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span>{v.unit}</span>
                      <span className="text-xs font-bold mt-1">₹{v.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-extrabold text-gray-900">₹{selectedVariant.price}</span>
                {selectedVariant.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">₹{selectedVariant.originalPrice}</span>
                )}
                {selectedVariant.originalPrice && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                    {Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Add to Cart / Counter */}
              <div className="mt-auto">
                {quantity === 0 ? (
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-[#ff3269] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#e62b5e] active:scale-95 transition-all shadow-lg shadow-pink-200"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="w-full bg-[#ff3269] text-white flex items-center justify-between rounded-xl font-bold text-lg p-1">
                    <button onClick={handleMinusClick} className="px-6 py-2 active:scale-90 transition-transform">-</button>
                    <span>{quantity} in cart</span>
                    <button onClick={() => updateQuantity(variantId, 1)} className="px-6 py-2 active:scale-90 transition-transform">+</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🆕 Frequently Bought Together (Functional) */}
          {recommendedProducts.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Frequently Bought Together</h3>
                {/* 🆕 View All Button */}
                <button 
                  onClick={() => {
                    setSelectedCategory(product.category);
                    onClose();
                  }}
                  className="text-sm font-bold text-[#245b3b] hover:underline"
                >
                  View All →
                </button>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {recommendedProducts.map(rec => (
                  <div 
                    key={rec.id} 
                    className="min-w-[150px] md:min-w-[180px] bg-white border border-gray-100 rounded-xl p-2 cursor-pointer hover:shadow-md transition-shadow relative group"
                    onClick={() => onProductSelect(rec)} // 🆕 Click karne par naya modal khulega
                  >
                    <img src={optimizeImage(rec.image, 200, 200)} alt={rec.name} className="w-full aspect-square object-cover rounded-lg mb-2" />
                    <p className="text-xs font-bold text-gray-800 line-clamp-1">{rec.name}</p>
                    <p className="text-xs text-gray-500 mt-1">₹{rec.price}</p>
                    
                    {/* 🆕 Recommendation Card par ADD button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Modal open hone se roke
                        addToCart(rec);
                      }}
                      className="absolute bottom-12 right-2 bg-white text-[#ff3269] border border-[#ff3269] px-3 py-1 rounded-md text-xs font-bold shadow-sm hover:bg-pink-50 active:scale-90 transition-all"
                    >
                      ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductQuickView;