function Category({ selectedCategory, setSelectedCategory }) {
  const categories = [
    { name: "All", icon: "🛒" },
    { name: "Vegetables", icon: "🥦" },
    { name: "Fruits", icon: "🍎" },
    { name: "Grains", icon: "🌾" },
    { name: "Herbs", icon: "🌿" },
    { name: "Dairy", icon: "🥛" },
    { name: "Bakery", icon: "🍞" },
    { name: "Spices", icon: "🌶️" }
  ];

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName === 'All' ? '' : categoryName);
  };

  return (
    // 🆕 Mobile par Horizontal Scroll, Desktop par Vertical Sidebar
    <aside className="w-full md:w-[220px] flex-shrink-0 bg-white md:border-r border-gray-100 md:h-full md:overflow-y-auto md:sticky md:top-20 md:h-[calc(100vh-80px)] custom-scrollbar">
      
      <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible py-3 md:py-4 px-2 md:px-0 gap-2 md:gap-1 no-scrollbar">
        {categories.map((cat, index) => {
          const isActive = selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory);
          
          return (
            <div 
              key={index} 
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-none cursor-pointer transition-all duration-200
                ${isActive 
                  ? 'bg-[#245b3b] md:bg-[#eaf0e5] text-white md:text-[#245b3b] md:border-r-4 md:border-[#245b3b]' 
                  : 'bg-gray-50 md:bg-transparent text-gray-600 hover:bg-gray-100 md:hover:bg-gray-50 md:border-r-4 md:border-transparent'}
              `}
            >
              <span className="text-lg md:text-2xl">{cat.icon}</span>
              <span className={`text-xs md:text-sm font-semibold whitespace-nowrap ${isActive ? 'text-white md:text-[#245b3b]' : 'text-gray-600'}`}>
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>

    </aside>
  );
}

export default Category;