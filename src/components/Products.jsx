import ProductCard from './ProductCard';
import Category from './Category'; 

function Products({ filteredProducts, selectedCategory, setSelectedCategory, onDelete }) {
  
  return (
    // 🆕 Mobile par bg-gray-50 aur border-t lagaya taaki separation dikhe
    <section className="bg-gray-50 md:bg-white min-h-screen relative border-t border-gray-200 md:border-none" id="products">
      <div className="max-w-[1400px] mx-auto flex items-start flex-col md:flex-row">
        
        {/* LEFT SIDEBAR (Category) */}
        <div id="categories" className="w-full md:w-auto">
          <Category 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="flex-1 w-full p-4 md:p-8 min-w-0 bg-white md:bg-white rounded-t-3xl md:rounded-none shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none -mt-4 md:mt-0 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="text-[10px] md:text-sm text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
            <span className="hover:text-[#245b3b] cursor-pointer">Home</span>
            <span>/</span>
            <span className="hover:text-[#245b3b] cursor-pointer">Store</span>
            <span>/</span>
            <span className="text-gray-900 font-bold">
              {selectedCategory ? selectedCategory : 'All Products'}
            </span>
          </div>

          {/* Heading & Filter Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 gap-3">
            <div>
              <span className="block mb-1 text-[#245b3b] text-[9px] md:text-xs font-extrabold tracking-[1.7px] uppercase">
                Goodness for your kitchen
              </span>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">
                {selectedCategory ? selectedCategory : 'Popular groceries'}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory('')}
                  className="text-[10px] md:text-sm font-semibold border border-gray-200 bg-white px-3 py-1.5 rounded-full hover:border-[#245b3b] hover:text-[#245b3b] transition-colors shadow-sm"
                >
                  Clear Filter ✕
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-lg text-gray-500 font-medium">No products found here.</p>
              <button 
                onClick={() => setSelectedCategory('')}
                className="mt-3 text-[#245b3b] font-bold hover:underline text-sm"
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