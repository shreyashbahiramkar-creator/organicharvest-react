import ProductCard from './ProductCard';

// 1. Props mein onDelete add kiya
function Products({ filteredProducts, selectedCategory, setSelectedCategory, onDelete }) {
  return (
    <section className="bg-[#f6f6f0] py-16" id="products">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Heading */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="block mb-2 text-[#245b3b] text-xs font-extrabold tracking-[1.7px]">
              GOODNESS FOR YOUR KITCHEN
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#245b3b] tracking-tight">
              {selectedCategory ? selectedCategory : 'Popular groceries'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory('')}
                className="text-sm font-semibold border border-[#e6e8df] bg-white px-3 py-1.5 rounded-full hover:border-[#245b3b] hover:text-[#245b3b] transition-colors"
              >
                Clear Filter ✕
              </button>
            )}
            <a href="#" className="text-[#245b3b] font-bold text-sm hover:underline underline-offset-4 hidden md:block">
              View categories →
            </a>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-[#737b72]">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              // 2. ProductCard ko onDelete pass kiya
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Products;