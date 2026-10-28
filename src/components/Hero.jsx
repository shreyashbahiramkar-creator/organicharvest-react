import { useState, useEffect } from 'react';

function Hero() {
  // Slider Images Data
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

  // Auto Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000); // 4 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="home" className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center scroll-mt-20">
      
      {/* Left Content */}
      <div>
        <span className="inline-block mb-4 text-[#245b3b] text-xs font-extrabold tracking-[1.7px]">
          FRESHNESS, DELIVERED
        </span>
        
        {/* Dynamic Text with transition */}
        <div className="h-[140px] md:h-[160px] overflow-hidden">
          <h1 className="text-5xl md:text-[61px] font-bold text-[#245b3b] leading-[1.1] tracking-[-2.5px] mb-6 transition-all duration-500">
            {slides[currentSlide].title}
            <span className="block text-[#839d72]">{slides[currentSlide].span}</span>
          </h1>
        </div>
        
        <p className="text-[#737b72] text-base leading-relaxed mb-8 max-w-[440px] transition-all duration-500">
          {slides[currentSlide].desc}
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

      {/* Right Image Slider */}
      <div className="relative h-[300px] md:h-[460px] w-full rounded-[26px] overflow-hidden">
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
        <div className="absolute bottom-4 right-4 z-20 bg-[#fffefa]/95 backdrop-blur-sm px-4 py-3 rounded-[10px] flex items-center gap-2 border border-white/70 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#6d985a]"></span>
          <span className="text-xs font-bold text-[#26362b]">A little goodness, every day</span>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-4 left-4 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-[#245b3b]' : 'w-2 bg-white/70'
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