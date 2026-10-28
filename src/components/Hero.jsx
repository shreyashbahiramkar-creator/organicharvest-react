import { useState, useEffect } from 'react';

function Hero() {
  const slides = [
    {
      // 1. Farmer holding fresh produce (Trust Building)
      image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=85",
      title: "Good food starts with",
      span: "good choices.",
      desc: "Discover fresh produce and everyday grocery essentials sourced directly from local farmers."
    },
    {
      // 2. Fresh organic vegetables in a farm setup
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
      title: "Farm fresh veggies",
      span: "delivered daily.",
      desc: "Get the ripest and most organic vegetables directly from the farms to your doorstep."
    },
    {
      // 3. Farmers harvesting (Real organic feel)
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=85",
      title: "Healthy grains",
      span: "for a better life.",
      desc: "Build a healthy lifestyle with our premium, chemical-free grains and pulses."
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="home" className="max-w-[1200px] mx-auto px-4 md:px-6 pt-4 pb-8 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 items-center scroll-mt-20">
      
      {/* Right Image Slider - Mobile par order-1 (Upar) */}
      {/* 🆕 Image height kam ki (h-[220px]) taaki mobile me text upar aaye */}
      <div className="order-1 md:order-2 relative h-[220px] sm:h-[300px] md:h-[460px] w-full rounded-[20px] md:rounded-[26px] overflow-hidden shadow-md">
        {slides.map((slide, index) => (
          <img 
            key={index}
            src={slide.image} 
            alt={`Organic Farm ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
        
        {/* Floating Label */}
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20 bg-[#fffefa]/95 backdrop-blur-sm px-2 py-1.5 md:px-4 md:py-3 rounded-md md:rounded-[10px] flex items-center gap-1.5 md:gap-2 border border-white/70 shadow-sm">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#6d985a]"></span>
          <span className="text-[9px] md:text-xs font-bold text-[#26362b]">100% Organic & Farm Fresh</span>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-20 flex gap-1.5 md:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-5 md:w-6 bg-[#245b3b]' : 'w-1.5 md:w-2 bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Left Content (Text) - Mobile par order-2 (Niche) */}
      <div className="order-2 md:order-1">
        <span className="inline-block mb-2 md:mb-4 text-[#245b3b] text-[10px] md:text-xs font-extrabold tracking-[1.7px]">
          FRESHNESS, DELIVERED
        </span>
        
        <div className="min-h-[100px] md:h-[160px]">
          {/* 🆕 Mobile heading size thoda aur optimize kiya (text-3xl) */}
          <h1 className="text-3xl sm:text-4xl md:text-[61px] font-bold text-[#245b3b] leading-[1.15] md:leading-[1.1] tracking-[-1px] md:tracking-[-2.5px] mb-3 md:mb-6 transition-all duration-500">
            {slides[currentSlide].title}
            <span className="block text-[#839d72]">{slides[currentSlide].span}</span>
          </h1>
        </div>
        
        <p className="text-[#737b72] text-sm md:text-base leading-relaxed mb-5 md:mb-8 max-w-[440px] transition-all duration-500">
          {slides[currentSlide].desc}
        </p>

        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-5 md:mb-8">
          <a href="#products" className="bg-[#245b3b] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-[10px] font-bold text-sm flex items-center gap-2 hover:bg-[#19452c] transition-colors">
            Explore groceries <span>→</span>
          </a>
          <a href="#categories" className="text-[#245b3b] font-bold text-sm hover:underline underline-offset-4">
            Browse categories
          </a>
        </div>

        <div className="flex items-center gap-2 md:gap-3 text-[#737b72] text-[11px] md:text-xs">
          <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-[#eaf0e5] text-[#245b3b] rounded-full font-bold shrink-0">✓</span>
          Sourced directly from local farmers.
        </div>
      </div>

    </section>
  );
}

export default Hero;