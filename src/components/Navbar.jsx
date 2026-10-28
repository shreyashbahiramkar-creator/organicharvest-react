import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { SearchIcon } from './icons';

function Navbar({ searchQuery, setSearchQuery }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#fffefa]/95 backdrop-blur border-b border-[#e6e8df]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">

        {/* ═══ ROW 1 : Logo | Links | Cart + Menu ═══ */}
        <div className="min-h-[60px] md:min-h-[68px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 text-[22px] md:text-[26px] font-extrabold tracking-tight">
            <span className="text-[26px] md:text-3xl text-[#245b3b] leading-none">✳</span>
            <span>
              <span className="text-[#245b3b]">Organic</span>
              <span className="text-[#77956b]">Harvest</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#26362b]">
            <Link to="/" className="hover:text-[#245b3b] transition-colors">Home</Link>
            <a href="/#categories" className="hover:text-[#245b3b] transition-colors">Categories</a>
            <a href="/#products" className="hover:text-[#245b3b] transition-colors">Shop</a>
            <a href="/#about" className="hover:text-[#245b3b] transition-colors">About</a>
            <a href="/#contact" className="hover:text-[#245b3b] transition-colors">Contact</a>
            <Link to="/track-order" className="font-semibold text-[#245b3b] hover:text-[#1a452c] transition-colors border-l border-gray-300 pl-6">
              Track Order
            </Link>
          </nav>

          {/* Right : Cart + Hamburger */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={openCart}
              className="flex items-center gap-2 font-bold text-[#26362b] hover:text-[#245b3b] transition-colors"
            >
              Cart
              <span className="bg-white border border-[#e6e8df] shadow-sm text-[#245b3b] min-w-[28px] h-7 px-1.5 flex items-center justify-center rounded-full text-sm font-bold">
                {cartCount}
              </span>
            </button>

            <button
              className="md:hidden flex flex-col gap-[5px] p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="w-7 h-[3px] bg-[#245b3b] rounded"></span>
              <span className="w-7 h-[3px] bg-[#245b3b] rounded"></span>
              <span className="w-7 h-[3px] bg-[#245b3b] rounded"></span>
            </button>
          </div>
        </div>

        {/* ═══ ROW 2 : Full-width Search Bar ═══ */}
        <div className="pb-3">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search fresh vegetables, fruits, groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 md:py-3 text-sm bg-[#f3f5ee] border border-transparent rounded-xl outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:border-[#245b3b]/30 focus:shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e6e8df] px-4 py-4 flex flex-col gap-4 shadow-md absolute w-full">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-[#26362b] font-medium border-b border-gray-100 pb-2">Home</Link>
          <a href="/#categories" onClick={() => setIsMenuOpen(false)} className="text-[#26362b] font-medium border-b border-gray-100 pb-2">Categories</a>
          <a href="/#products" onClick={() => setIsMenuOpen(false)} className="text-[#26362b] font-medium border-b border-gray-100 pb-2">Shop</a>
          <a href="/#about" onClick={() => setIsMenuOpen(false)} className="text-[#26362b] font-medium border-b border-gray-100 pb-2">About</a>
          <a href="/#contact" onClick={() => setIsMenuOpen(false)} className="text-[#26362b] font-medium border-b border-gray-100 pb-2">Contact</a>
          <Link to="/track-order" onClick={() => setIsMenuOpen(false)} className="text-[#245b3b] font-bold pb-2">Track Order</Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;