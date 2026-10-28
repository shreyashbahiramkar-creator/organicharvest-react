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
    <aside className="w-[80px] md:w-[220px] flex-shrink-0 bg-white border-r border-[#e6e8df] h-full overflow-y-auto sticky top-0 md:top-20 md:h-[calc(100vh-80px)] custom-scrollbar">
      
      <div className="flex flex-col py-4 gap-1">
        {categories.map((cat, index) => {
          const isActive = selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory);
          
          return (
            <div 
              key={index} 
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col md:flex-row items-center gap-2 md:gap-4 px-2 md:px-4 py-3 cursor-pointer transition-all duration-200
                ${isActive 
                  ? 'bg-[#eaf0e5] border-r-4 border-[#245b3b] text-[#245b3b]' 
                  : 'hover:bg-gray-50 text-gray-600 border-r-4 border-transparent'}
              `}
            >
              <span className="text-2xl md:text-3xl">{cat.icon}</span>
              
              <span className={`text-[10px] md:text-sm text-center md:text-left font-semibold leading-tight ${isActive ? 'text-[#245b3b]' : 'text-gray-600'}`}>
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