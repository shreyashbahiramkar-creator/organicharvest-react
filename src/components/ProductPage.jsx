import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { optimizeImage } from '../utils/imageOptimizer';

function ProductPage({ allProducts }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  
  const product = allProducts.find(p => p.id.toString() === id);

  // 🆕 Dynamic Variants Logic
  // Check karta hai ki product liquid (doodh/tel) hai ya solid (sabzi/anaj)
  const generateVariants = () => {
    if (!product) return [];
    
    // Agar backend se custom variants aa rahe hain toh unhe use karein
    if (product.variants && product.variants.length > 0) return product.variants;

    const unitStr = (product.unit || "").toLowerCase();
    
    // Liquid check: agar unit me 'ml', 'l', 'ltr', 'litre' hai
    const isLiquid = unitStr.includes("ml") || unitStr.includes("ltr") || unitStr.includes("l") || unitStr.includes("litre");
    const isKgBased = unitStr.includes("kg");

    const basePrice = product.price || 0;
    const baseOriginalPrice = product.originalPrice || null;

    if (isLiquid) {
      return [
        { unit: '250 ml', price: Math.round(basePrice * 0.6), originalPrice: baseOriginalPrice ? Math.round(baseOriginalPrice * 0.6) : null },
        { unit: '500 ml', price: basePrice, originalPrice: baseOriginalPrice },
        { unit: '1 L', price: Math.round(basePrice * 1.8), originalPrice: baseOriginalPrice ? Math.round(baseOriginalPrice * 1.8) : null }
      ];
    } else if (isKgBased) {
      return [
        { unit: '250 g', price: Math.round(basePrice * 0.6), originalPrice: baseOriginalPrice ? Math.round(baseOriginalPrice * 0.6) : null },
        { unit: '500 g', price: basePrice, originalPrice: baseOriginalPrice },
        { unit: '1 kg', price: Math.round(basePrice * 1.8), originalPrice: baseOriginalPrice ? Math.round(baseOriginalPrice * 1.8) : null }
      ];
    } else {
      // Agar packets/pieces (pc) hain (jaise Bread, Eggs)
      return [
        { unit: product.unit, price: basePrice, originalPrice: baseOriginalPrice }
      ];
    }
  };

  const variants = generateVariants();
  
  // Default selection middle wale variant (500g ya 500ml) par set karein, agar available ho
  const [selectedVariant, setSelectedVariant] = useState(variants[1] || variants[0]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Jab product change ho, toh naye variants ke hisaab se reset karein
    const newVariants = generateVariants();
    setSelectedVariant(newVariants[1] || newVariants[0]);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffefa]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <Link to="/" className="bg-[#245b3b] text-white px-6 py-2 rounded-lg font-bold">Go to Home</Link>
      </div>
    );
  }

  const recommendedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 10); 

  // Cart check for this specific variant
  const variantId = selectedVariant ? `${product.id}-${selectedVariant.unit.replace(/\s/g, '')}` : product.id;
  const cartItem = cart?.find(item => item.id === variantId);
  const quantity = cartItem ? cartItem.quantity : 0;

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

  return (
    <div className="bg-[#fffefa] min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[#245b3b] font-bold mb-6 hover:underline"
        >
          ← Back to Shop
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e6e8df] overflow-hidden">
          <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              
              {/* Left: Image */}
              <div className="bg-[#f8f8f8] rounded-xl overflow-hidden aspect-square relative">
                <img 
                  src={optimizeImage(product.image, 800, 800)} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-[#eaf0e5] text-[#245b3b] px-3 py-1 rounded-md text-sm font-bold shadow-sm">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Right: Details */}
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-[#245b3b] font-semibold text-sm mb-4 bg-[#eaf0e5] inline-block px-3 py-1 rounded-full w-max">
                  {product.category}
                </p>
                
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  {product.description || `Fresh and high-quality ${product.name.toLowerCase()} sourced directly from local farms. Perfect for your daily kitchen needs.`}
                </p>

                {/* Variants Selector */}
                {variants.length > 1 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Select Quantity</h3>
                    <div className="flex gap-3 flex-wrap">
                      {variants.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedVariant(v)}
                          className={`flex flex-col items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold border-2 transition-all min-w-[90px] ${
                            selectedVariant?.unit === v.unit 
                              ? 'border-[#245b3b] bg-[#eaf0e5] text-[#245b3b] shadow-sm' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <span>{v.unit}</span>
                          <span className="text-xs font-bold mt-1">₹{v.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic Price */}
                {selectedVariant && (
                  <div className="flex items-end gap-3 mb-8">
                    <span className="text-4xl font-extrabold text-gray-900">₹{selectedVariant.price}</span>
                    {selectedVariant.originalPrice && (
                      <span className="text-xl text-gray-400 line-through mb-1">₹{selectedVariant.originalPrice}</span>
                    )}
                    {selectedVariant.originalPrice && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold mb-1">
                        {Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                )}

                {/* Add to Cart / Counter */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                  {quantity === 0 ? (
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-[#ff3269] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#e62b5e] active:scale-95 transition-all shadow-lg shadow-pink-200"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="w-full bg-[#ff3269] text-white flex items-center justify-between rounded-xl font-bold text-lg p-2">
                      <button onClick={handleMinusClick} className="px-8 py-2 active:scale-90 transition-transform text-2xl">-</button>
                      <span>{quantity} in cart</span>
                      <button onClick={() => updateQuantity(variantId, 1)} className="px-8 py-2 active:scale-90 transition-transform text-2xl">+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Frequently Bought Together */}
            {recommendedProducts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Frequently Bought Together</h3>
                  <Link 
                    to="/"
                    className="text-sm font-bold text-[#245b3b] hover:underline"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {recommendedProducts.map(rec => (
                    <div 
                      key={rec.id} 
                      className="min-w-[160px] md:min-w-[200px] bg-white border border-gray-100 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow relative group"
                      onClick={() => navigate(`/product/${rec.id}`)} 
                    >
                      <img src={optimizeImage(rec.image, 300, 300)} alt={rec.name} className="w-full aspect-square object-cover rounded-lg mb-3" />
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{rec.name}</p>
                      <p className="text-sm text-gray-500 mt-1 font-semibold">₹{rec.price}</p>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          addToCart(rec);
                        }}
                        className="absolute bottom-14 right-3 bg-white text-[#ff3269] border border-[#ff3269] px-3 py-1 rounded-md text-xs font-bold shadow-sm hover:bg-pink-50 active:scale-90 transition-all"
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
    </div>
  );
}

export default ProductPage;