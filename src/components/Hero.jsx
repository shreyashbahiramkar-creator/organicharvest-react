import { useState, useEffect } from 'react';
import { LeafIcon, ShieldIcon, PinIcon, TruckIcon, ArrowIcon } from './icons';

/* ✅ Tumhari existing images */
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';

/* ───────── Slider data ─────────
   pos → image ka kaunsa hissa dikhe (banners me text left side pe hai,
   isliye right side focus — baked text crop ho jayega) */
const slides = [
  {
    title: 'Fresh From Farm to Your Home',
    subtitle: 'Organic vegetables, fresh fruits and everyday essentials.',
    cta: 'Shop Fresh',
    href: '#products',
    image: hero1,
    alt: 'Organic Harvest — Goodness of Nature, Delivered to Your Home',
    note: 'Support Local Farmers ♡',
    pos: '75% center',
  },
  {
    title: 'Pure. Organic. Straight from Nature.',
    subtitle: 'Handpicked fruits and vegetables, delivered farm-fresh.',
    cta: 'Explore Products',
    href: '#products',
    image: hero2,
    alt: 'Organic Harvest — Fresh. Organic. Straight from Nature.',
    note: 'Naturally Better ♡',
    pos: '75% center',
  },
  {
    title: 'Eat Healthy, Live Better',
    subtitle: 'Everyday groceries sourced directly from local farmers.',
    cta: 'Start Shopping',
    href: '#products',
    image: hero3,
    alt: 'Organic Harvest — Doctor Approved. Naturally Better.',
    note: 'Farm to Home ♡',
    pos: '75% center',
  },
];

/* ───────── Features strip ───────── */
const features = [
  { Icon: LeafIcon,   title: 'Farm Fresh',      sub: 'Straight from farms' },
  { Icon: ShieldIcon, title: 'Quality Checked', sub: 'Pure & Safe' },
  { Icon: PinIcon,    title: 'Local Sourcing',  sub: 'Support Local Farmers' },
  { Icon: TruckIcon,  title: 'Home Delivery',   sub: 'At Your Doorstep' },
];

function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section id="home" className="w-full scroll-mt-36">
      <h1 className="sr-only">Organic Harvest — Fresh Organic Groceries Delivered to Your Home</h1>

      {/* ═══════════ GREEN BANNER ═══════════ */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-[#f3f9ee] via-[#e6f3d8] to-[#c9e7b2]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 🍃 floating leaves */}
        <LeafIcon className="absolute top-8 left-[40%] w-6 h-6 text-green-600/30 rotate-12 pointer-events-none" />
        <LeafIcon className="absolute top-1/2 right-[35%] w-4 h-4 text-green-600/25 -rotate-45 pointer-events-none hidden md:block" />
        <LeafIcon className="absolute bottom-8 left-[6%] w-5 h-5 text-green-600/20 rotate-45 pointer-events-none hidden md:block" />

        <div className="grid">
          {slides.map((slide, i) => (
            <div
              key={i}
              aria-hidden={i !== current}
              className={`col-start-1 row-start-1 transition-all duration-700 ease-in-out ${
                i === current
                  ? 'opacity-100 translate-x-0 z-10'
                  : 'opacity-0 translate-x-6 z-0 pointer-events-none'
              }`}
            >
              <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-10 md:py-14 grid md:grid-cols-2 gap-2 md:gap-6 items-center">

                {/* ── LEFT : text ── */}
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2.5 mb-3 md:mb-6">
                    <span className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/80 shadow-sm flex items-center justify-center">
                      <LeafIcon className="w-5 h-5 md:w-6 md:h-6 text-green-700" />
                    </span>
                    <span className="leading-tight text-left">
                      <span className="block text-lg md:text-2xl font-extrabold">
                        <span className="text-green-900">Organic</span>
                        <span className="text-green-600">Harvest</span>
                      </span>
                      <span className="block text-[8px] md:text-[10px] font-bold tracking-[0.22em] text-green-800/70">
                        PURE FOOD • HEALTHY LIFE
                      </span>
                    </span>
                  </div>

                  <h2 className="text-[26px] sm:text-4xl lg:text-[50px] font-extrabold text-green-900 leading-[1.15]">
                    {slide.title}
                  </h2>

                  <p className="mt-2.5 md:mt-4 text-green-900/70 text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0">
                    {slide.subtitle}
                  </p>

                  <a
                    href={slide.href}
                    className="group inline-flex items-center gap-2 mt-5 md:mt-8 px-6 md:px-8 py-2.5 md:py-3.5 rounded-full bg-green-800 hover:bg-green-900 text-white text-sm md:text-base font-semibold shadow-lg shadow-green-900/20 transition-all"
                  >
                    {slide.cta}
                    <ArrowIcon className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>

                {/* ── RIGHT : image ── */}
                <div className="relative h-48 sm:h-60 md:h-[330px] lg:h-[390px]">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    draggable="false"
                    className="w-full h-full object-cover select-none"
                    style={{
                      objectPosition: slide.pos,
                      /* left edge fade → image green bg me smoothly blend hogi */
                      WebkitMaskImage: 'linear-gradient(to right, transparent, black 22%)',
                      maskImage: 'linear-gradient(to right, transparent, black 22%)',
                    }}
                  />
                  <p
                    className="absolute -top-1 right-1 md:right-4 text-green-800/90 text-base md:text-2xl -rotate-3 pointer-events-none"
                    style={{ fontFamily: "'Caveat', 'Segoe Script', cursive" }}
                  >
                    {slide.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-7 bg-green-800' : 'w-2 bg-green-800/30 hover:bg-green-800/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ═══════════ FEATURES STRIP ═══════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-[#f3f8ec] rounded-2xl grid grid-cols-2 md:grid-cols-4">
          {features.map(({ Icon, title, sub }, i) => (
            <div
              key={title}
              className={`flex flex-col items-center text-center gap-1 px-3 py-5 md:py-6 border-green-900/10
                ${i % 2 === 1 ? 'border-l' : ''}
                ${i >= 2 ? 'border-t md:border-t-0' : ''}
                ${i === 2 ? 'md:border-l' : ''}`}
            >
              <Icon className="w-7 h-7 md:w-9 md:h-9 text-green-800" />
              <p className="font-bold text-green-900 text-sm md:text-base">{title}</p>
              <p className="text-green-900/55 text-[11px] md:text-sm">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;