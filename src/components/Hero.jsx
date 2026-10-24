function Hero() {
  return (
    <section id="home" className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center scroll-mt-20">
      
      {/* Left Content */}
      <div>
        <span className="inline-block mb-4 text-[#245b3b] text-xs font-extrabold tracking-[1.7px]">
          FRESHNESS, DELIVERED
        </span>
        
        <h1 className="text-5xl md:text-[61px] font-bold text-[#245b3b] leading-[1.1] tracking-[-2.5px] mb-6">
          Good food starts with
          <span className="block text-[#839d72]">good choices.</span>
        </h1>
        
        <p className="text-[#737b72] text-base leading-relaxed mb-8 max-w-[440px]">
          Discover fresh produce and everyday grocery essentials
          for a happier, healthier kitchen.
        </p>

        <div className="flex flex-wrap items-center gap-6 mb-8">
          <a href="#products" className="bg-[#245b3b] text-white px-6 py-3 rounded-[10px] font-bold text-sm flex items-center gap-2 hover:bg-[#19452c] transition-colors">
            Explore groceries <span>→</span>
          </a>
          <a href="#categories" className="text-[#245b3b] font-bold text-sm hover:underline underline-offset-4">
            Browse categories
          </a>
        </div>

        <div className="flex items-center gap-3 text-[#737b72] text-xs">
          <span className="w-6 h-6 flex items-center justify-center bg-[#eaf0e5] text-[#245b3b] rounded-full font-bold">✓</span>
          Everyday essentials, made simple.
        </div>
      </div>

      {/* Right Image */}
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85" 
          alt="Fresh vegetables" 
          className="w-full h-[300px] md:h-[460px] object-cover rounded-[26px]"
        />
        
        {/* Floating Label */}
        <div className="absolute bottom-4 right-4 bg-[#fffefa]/95 backdrop-blur-sm px-4 py-3 rounded-[10px] flex items-center gap-2 border border-white/70 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#6d985a]"></span>
          <span className="text-xs font-bold text-[#26362b]">A little goodness, every day</span>
        </div>
      </div>

    </section>
  );
}

export default Hero;