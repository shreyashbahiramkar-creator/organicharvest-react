import ProductCard from './ProductCard';
import Category from './Category'; 

function Products({ filteredProducts, selectedCategory, setSelectedCategory, onDelete }) {
  
  return (
    // 🆕 1. Hero ke baad gap dene ke liye 'mt-8 md:mt-12' aur upar ek line 'border-t' add ki hai
    <section className="bg-white min-h-screen relative mt-8 md:mt-12 border-t border-gray-200" id="products">
      <div className="max-w-[1400px] mx-auto flex items-start">
        
        {/* LEFT SIDEBAR (Category) - Wapas original layout */}
        <Category 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />

        {/* RIGHT MAIN CONTENT - Wapas original padding */}
        <div className="flex-1 p-4 md:p-8 min-w-0 bg-white">
          
          {/* Breadcrumbs - 🆕 2. Mobile par upar thoda padding (pt-4) diya taaki chipe nahi */}
          <div className="text-xs md:text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap pt-4 md:pt-0">
            <span className="hover:text-[#245b3b] cursor-pointer transition-colors">Home</span>
            <span className="text-gray-300">/</span>
            <span className="hover:text-[#245b3b] cursor-pointer transition-colors">Fruits & Vegetables</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold">
              {selectedCategory ? selectedCategory : 'All Products'}
            </span>
          </div>

          {/* Heading & Filter Area - Wapas original */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <span className="block mb-1 text-[#245b3b] text-[10px] md:text-xs font-extrabold tracking-[1.7px] uppercase">
                Goodness for your kitchen
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                {selectedCategory ? selectedCategory : 'Popular groceries'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory('')}
                  className="text-xs md:text-sm font-semibold border border-gray-200 bg-white px-3 py-1.5 rounded-full hover:border-[#245b3b] hover:text-[#245b3b] transition-colors shadow-sm"
                >
                  Clear Filter ✕
                </button>
              )}
            </div>
          </div>

          {/* Product Grid - Wapas original */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-xl text-gray-500 font-medium">No products found in this category.</p>
              <button 
                onClick={() => setSelectedCategory('')}
                className="mt-4 text-[#245b3b] font-bold hover:underline"
              >
                View all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onDelete={onDelete} 
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default Products;