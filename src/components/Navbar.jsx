import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; 

function Navbar({ searchQuery, setSearchQuery }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#fffefa]/95 border-b border-[#e6e8df]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 min-h-[82px] flex items-center justify-between gap-4">
        
        <Link to="/" className="flex items-center gap-1 text-2xl font-extrabold text-[#245b3b] tracking-tight">
          <span className="text-3xl">✳</span>
          Organic<span className="text-[#77956b] -ml-1">Harvest</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#26362b]">
          <Link to="/" className="hover:text-[#245b3b] transition-colors">Home</Link>
          <a href="/#categories" className="hover:text-[#245b3b] transition-colors">Categories</a>
          <a href="/#products" className="hover:text-[#245b3b] transition-colors">Shop</a>
          <a href="/#about" className="hover:text-[#245b3b] transition-colors">About</a>
          <a href="/#contact" className="hover:text-[#245b3b] transition-colors">Contact</a>
          {/* 🆕 Track Order Link */}
          <Link to="/track-order" className="font-semibold text-[#245b3b] hover:text-[#1a452c] transition-colors border-l border-gray-300 pl-6">
            Track Order
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hidden md:block w-[150px] px-3 py-1.5 text-sm bg-[#f6f6f0] border border-[#e6e8df] rounded-lg outline-none focus:border-[#245b3b]"
          />
          
          <button 
            onClick={openCart}
            className="flex items-center gap-2 font-bold text-sm text-[#26362b] hover:text-[#245b3b] transition-colors"
          >
            Cart<span className="bg-[#eaf0e5] text-[#245b3b] w-6 h-6 flex items-center justify-center rounded-full text-xs">
              {cartCount}
            </span>
          </button>

          <button 
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="w-6 h-0.5 bg-[#245b3b] rounded"></span>
            <span className="w-6 h-0.5 bg-[#245b3b] rounded"></span>
            <span className="w-6 h-0.5 bg-[#245b3b] rounded"></span>
          </button>
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
          {/* 🆕 Mobile Track Order Link */}
          <Link to="/track-order" onClick={() => setIsMenuOpen(false)} className="text-[#245b3b] font-bold pb-2">Track Order</Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;