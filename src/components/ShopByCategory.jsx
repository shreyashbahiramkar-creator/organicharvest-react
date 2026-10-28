import { ArrowIcon, LeafIcon } from './icons';

/* Screenshot jaisa "Shop by Category" section.
   Click → product filter + products pe smooth scroll.
   Naam exactly sidebar/backend categories se match. */
const categories = [
  {
    name: 'Vegetables',
    emoji: '🥦',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Fruits',
    emoji: '🍎',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Grains & Pulses',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dairy & Eggs',
    emoji: '🥛',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'All Groceries',
    emoji: '🛒',
    image: 'https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=600&q=80',
    filter: '', // 'All' — koi filter nahi
  },
];

function ShopByCategory({ selectedCategory, setSelectedCategory }) {
  const handleClick = (cat) => {
    setSelectedCategory(cat.filter !== undefined ? cat.filter : cat.name);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories" className="max-w-[1200px] mx-auto px-4 md:px-6 mt-8 md:mt-12 scroll-mt-[130px]">
      {/* Heading + View All */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-lg md:text-2xl font-extrabold text-[#245b3b]">
          <LeafIcon className="w-5 h-5 md:w-6 md:h-6 text-[#77956b]" />
          Shop by Category
        </h2>
        <button
          onClick={() => handleClick(categories[4])}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#245b3b] hover:text-[#1a452c] transition-colors"
        >
          View All <ArrowIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {categories.map((cat) => {
          const isActive = cat.filter !== undefined
            ? selectedCategory === ''          // All Groceries card
            : selectedCategory === cat.name;   // baaki cards

          return (
            <button
              key={cat.name}
              onClick={() => handleClick(cat)}
              className={`group bg-[#f3f8ec] rounded-2xl p-2.5 md:p-3 flex flex-col items-center gap-2 border-2 transition-all duration-200 ${
                isActive
                  ? 'border-[#245b3b] shadow-md'
                  : 'border-transparent hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/70">
                {/* emoji fallback — image load fail ho to ye dikhega */}
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {cat.emoji}
                </div>
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => (e.target.style.display = 'none')}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-[11px] sm:text-sm font-bold text-[#245b3b] text-center leading-tight">
                {cat.name}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ShopByCategory;