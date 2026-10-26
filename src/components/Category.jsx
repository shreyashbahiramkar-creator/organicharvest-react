function Category({ selectedCategory, setSelectedCategory }) {
  // 🆕 Zepto style categories (Icons ke saath)
  const categories = [
    { name: "All", icon: "🛒" },
    { name: "Vegetables", icon: "🥦" },
    { name: "Fruits", icon: "🍎" },
    { name: "Grains & Pulses", icon: "🌾" },
    { name: "Herbs & Greens", icon: "🌿" }
  ];

  const handleCategoryClick = (categoryName) => {
    // Agar "All" click kiya toh filter clear (empty string) ho jayega
    setSelectedCategory(categoryName === 'All' ? '' : categoryName);
  };

  return (
    // 🆕 Sidebar Container: Mobile par 80px wide, Desktop par 220px wide
    <aside className="w-[80px] md:w-[220px] flex-shrink-0 bg-white border-r border-[#e6e8df] h-full overflow-y-auto sticky top-0 md:top-20 md:h-[calc(100vh-80px)] custom-scrollbar">
      
      <div className="flex flex-col py-4 gap-1">
        {categories.map((cat, index) => {
          // Active state logic: Agar category select hai ya "All" select hai
          const isActive = selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory);
          
          return (
            <div 
              key={index} 
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col md:flex-row items-center gap-2 md:gap-4 px-2 md:px-4 py-3 cursor-pointer transition-all duration-200
                ${isActive 
                  ? 'bg-[#f3e8ff] border-r-4 border-[#7a1c8c] text-[#7a1c8c]' 
                  : 'hover:bg-gray-50 text-gray-600 border-r-4 border-transparent'}
              `}
            >
              {/* Icon */}
              <span className="text-2xl md:text-3xl">{cat.icon}</span>
              
              {/* Category Name */}
              <span className={`text-[10px] md:text-sm text-center md:text-left font-semibold leading-tight ${isActive ? 'text-[#7a1c8c]' : 'text-gray-600'}`}>
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