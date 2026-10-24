function Category({ selectedCategory, setSelectedCategory }) {
  const categories = [
    {
      name: "Vegetables",
      desc: "Fresh everyday picks",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Fruits",
      desc: "Colourful and delicious",
      image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Grains & Pulses",
      desc: "Stock your pantry",
      image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Herbs & Greens",
      desc: "Little things that add flavour",
      image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section id="categories" className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-16 scroll-mt-20">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="block mb-2 text-[#245b3b] text-xs font-extrabold tracking-[1.7px]">
            FIND YOUR FAVOURITES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#245b3b] tracking-tight">
            Shop by category
          </h2>
        </div>
        <a href="#products" className="text-[#245b3b] font-bold text-sm hover:underline underline-offset-4 hidden md:block">
          Explore all →
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
            className="group block cursor-pointer"
          >
            <div className={`overflow-hidden rounded-[18px] bg-[#f6f6f0] border-2 transition-colors ${selectedCategory === cat.name ? 'border-[#245b3b]' : 'border-transparent'}`}>
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full aspect-[1/0.9] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="mt-3 mb-1 text-base font-semibold text-[#26362b]">
              {cat.name}
            </h3>
            <p className="text-xs text-[#737b72]">
              {cat.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Category;