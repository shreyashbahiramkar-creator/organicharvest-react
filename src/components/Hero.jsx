import { useState, useEffect } from 'react';

// 🆕 Aapki banner images (src/assets me save karo)
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';

function Hero() {
  const slides = [
    { image: hero1, alt: 'Organic Harvest - Goodness of Nature, Delivered to Your Home' },
    { image: hero2, alt: 'Organic Harvest - Fresh. Organic. Straight from Nature.' },
    { image: hero3, alt: 'Organic Harvest - Doctor Approved. Naturally Better.' },
    // 🆕 4th slide — chaaho toh isko hata do ya apni 4th banner image daal do
    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=85', alt: 'Farm fresh organic vegetables' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <section id="home" className="relative w-full scroll-mt-20">
      {/* SEO ke liye hidden heading (text ab images me hai) */}
      <h1 className="sr-only">Organic Harvest - Fresh Organic Groceries Delivered to Your Home</h1>

      {/* 🆕 Full-width Banner Slider */}
      <div className="relative w-full overflow-hidden bg-gray-100 aspect-[16/9] md:aspect-[15/8]">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={slide.alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}

        {/* Desktop arrows (mobile par hidden — clean look) */}
        <button onClick={prevSlide} aria-label="Previous slide"
          className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-700 text-xl shadow-md transition">
          ‹
        </button>
        <button onClick={nextSlide} aria-label="Next slide"
          className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-700 text-xl shadow-md transition">
          ›
        </button>

        {/* Dots — mobile par center me, badi touch targets */}
        <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-7 md:w-9 bg-white shadow-md'
                  : 'w-2 md:w-2.5 bg-white/60 hover:bg-white/90'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;