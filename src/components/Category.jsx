function Category({ selectedCategory, setSelectedCategory }) {
  const categories = [
    { name: "All", icon: "🛒" },
    { name: "Vegetables", icon: "🥦" },
    { name: "Fruits", icon: "🍎" },
    { name: "Grains & Pulses", icon: "🌾" },
    { name: "Herbs & Greens", icon: "🌿" },
    { name: "Dairy & Eggs", icon: "🥛" },
    { name: "Bakery", icon: "🍞" },
    { name: "Spices", icon: "🌶️" },
    { name: "Dry Fruits", icon: "🥜" }
  ];

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName === 'All' ? '' : categoryName);
  };

  return (
    <aside className="w-[85px] md:w-[220px] flex-shrink-0 bg-[#fcfcfc] border-r border-gray-200 h-full overflow-y-auto sticky top-0 md:top-20 md:h-[calc(100vh-80px)] custom-scrollbar">
      
      <div className="flex flex-col py-2 gap-1">
        {categories.map((cat, index) => {
          const isActive = selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory);
          
          return (
            <div 
              key={index} 
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col md:flex-row items-center gap-1.5 md:gap-4 px-1 md:px-4 py-2.5 md:py-3 cursor-pointer transition-all duration-200
                ${isActive 
                  ? 'bg-[#f3e8ff] md:bg-[#eaf0e5] md:border-r-4 md:border-[#245b3b]' 
                  : 'hover:bg-gray-100 md:border-r-4 md:border-transparent'}
              `}
            >
              {/* Icon Image/Emoji */}
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-2xl md:text-3xl">
                {cat.icon}
              </div>
              
              {/* Category Name */}
              <span className={`text-[10px] md:text-sm text-center md:text-left font-medium leading-tight 
                ${isActive ? 'text-[#7a1c8c] md:text-[#245b3b] font-bold' : 'text-gray-600'}`}>
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