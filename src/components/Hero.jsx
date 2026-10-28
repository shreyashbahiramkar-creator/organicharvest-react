import { useState, useEffect } from 'react';

function Hero() {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
      title: "Good food starts with",
      span: "good choices.",
      desc: "Discover fresh produce and everyday grocery essentials for a happier, healthier kitchen."
    },
    {
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=85",
      title: "Farm fresh fruits",
      span: "delivered daily.",
      desc: "Get the juiciest and ripest fruits directly from the farmers to your doorstep."
    },
    {
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1200&q=85",
      title: "Healthy grains",
      span: "for a better life.",
      desc: "Build a healthy lifestyle with our premium quality grains and pulses."
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
    // 🆕 Mobile pe gap kam kiya (gap-8) aur padding adjust ki
    <section id="home" className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center scroll-mt-20">
      
      {/* Left Content */}
      <div>
        <span className="inline-block mb-3 md:mb-4 text-[#245b3b] text-[10px] md:text-xs font-extrabold tracking-[1.7px]">
          FRESHNESS, DELIVERED
        </span>
        
        {/* 🆕 Text size mobile pe chhota kiya (text-3xl se text-5xl) aur height fix ki */}
        <div className="h-[110px] md:h-[160px] overflow-hidden">
          <h1 className="text-3xl sm:text-4xl md:text-[61px] font-bold text-[#245b3b] leading-[1.15] md:leading-[1.1] tracking-[-1px] md:tracking-[-2.5px] mb-4 md:mb-6 transition-all duration-500">
            {slides[currentSlide].title}
            <span className="block text-[#839d72]">{slides[currentSlide].span}</span>
          </h1>
        </div>
        
        <p className="text-[#737b72] text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-[440px] transition-all duration-500">
          {slides[currentSlide].desc}
        </p>

        {/* 🆕 Buttons mobile pe gap kam kiya */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <a href="#products" className="bg-[#245b3b] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-[10px] font-bold text-sm flex items-center gap-2 hover:bg-[#19452c] transition-colors">
            Explore groceries <span>→</span>
          </a>
          <a href="#categories" className="text-[#245b3b] font-bold text-sm hover:underline underline-offset-4">
            Browse categories
          </a>
        </div>

        <div className="flex items-center gap-3 text-[#737b72] text-xs">
          <span className="w-6 h-6 flex items-center justify-center bg-[#eaf0e5] text-[#245b3b] rounded-full font-bold shrink-0">✓</span>
          Everyday essentials, made simple.
        </div>
      </div>

      {/* Right Image Slider */}
      {/* 🆕 Mobile pe height thodi kam ki (h-[250px]) */}
      <div className="relative h-[250px] sm:h-[300px] md:h-[460px] w-full rounded-[20px] md:rounded-[26px] overflow-hidden mt-4 md:mt-0">
        {slides.map((slide, index) => (
          <img 
            key={index}
            src={slide.image} 
            alt={`Slide ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
        
        {/* Floating Label */}
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20 bg-[#fffefa]/95 backdrop-blur-sm px-3 py-2 md:px-4 md:py-3 rounded-[10px] flex items-center gap-2 border border-white/70 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#6d985a]"></span>
          <span className="text-[10px] md:text-xs font-bold text-[#26362b]">A little goodness, every day</span>
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

    </section>
  );
}

export default Hero;