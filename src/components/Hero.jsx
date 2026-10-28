import { useState, useEffect } from 'react';

function Hero() {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=85",
      title: "Good food starts with",
      span: "good choices.",
      desc: "Discover fresh produce and everyday grocery essentials sourced directly from local farmers."
    },
    {
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
      title: "Farm fresh veggies",
      span: "delivered daily.",
      desc: "Get the ripest and most organic vegetables directly from the farms to your doorstep."
    },
    {
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
    // 🆕 Mobile par background ko halka grey kiya aur gap adjust kiya
    <section id="home" className="max-w-[1200px] mx-auto px-3 md:px-6 pt-3 pb-6 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center scroll-mt-20">
      
      {/* 🆕 Image Slider Container - Mobile par Card Style */}
      <div className="order-1 md:order-2 relative h-[240px] sm:h-[320px] md:h-[460px] w-full rounded-2xl md:rounded-[26px] overflow-hidden shadow-sm border border-gray-100">
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
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-3 rounded-lg flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
          <span className="text-[10px] md:text-xs font-bold text-gray-800">100% Organic & Farm Fresh</span>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-3 left-3 z-20 flex gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Left Content (Text) */}
      <div className="order-2 md:order-1 px-1 md:px-0">
        <span className="inline-block mb-2 text-[#245b3b] text-[10px] md:text-xs font-extrabold tracking-[1.7px]">
          FRESHNESS, DELIVERED
        </span>
        
        <div className="min-h-[85px] md:h-[160px]">
          <h1 className="text-[28px] sm:text-4xl md:text-[61px] font-bold text-[#245b3b] leading-[1.1] tracking-tight md:tracking-[-2.5px] mb-2 md:mb-6 transition-all duration-500">
            {slides[currentSlide].title}
            <span className="block text-[#839d72]">{slides[currentSlide].span}</span>
          </h1>
        </div>
        
        <p className="text-gray-500 text-[13px] md:text-base leading-relaxed mb-5 max-w-[440px]">
          {slides[currentSlide].desc}
        </p>

        <div className="flex items-center gap-4 mb-4 md:mb-8">
          <a href="#products" className="bg-[#245b3b] text-white px-5 py-2.5 rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-[#19452c] transition-colors shadow-md shadow-green-900/20">
            Shop Now <span>→</span>
          </a>
          <a href="#categories" className="text-[#245b3b] font-bold text-xs md:text-sm hover:underline underline-offset-4">
            Categories
          </a>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-[10px] md:text-xs font-medium">
          <span className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center bg-[#eaf0e5] text-[#245b3b] rounded-full text-[10px] font-bold">✓</span>
          Sourced directly from local farmers.
        </div>
      </div>

    </section>
  );
}

export default Hero;