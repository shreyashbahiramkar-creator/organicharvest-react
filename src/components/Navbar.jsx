import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate, useLocation } from 'react-router-dom'; // useLocation add kiya
import { SearchIcon } from './icons';
import { User, LogOut, Package } from 'lucide-react'; 

// scrollToProducts prop add kiya
function Navbar({ searchQuery, setSearchQuery, scrollToProducts }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); // location add kiya

  const handleLogout = () => {
    logout();
    navigate('/'); 
    setIsMenuOpen(false);
  };

  // 1. SEARCH KARNE PAR ENTER DABANE KA FIX
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Page reload hone se rokega
    if (scrollToProducts) {
      scrollToProducts(); // Products tak scroll karega
    }
  };

  // 2. FOOTER PE JUMP HONE WALE LINKS KA FIX
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fffefa]/95 backdrop-blur border-b border-[#e6e8df]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="min-h-[60px] md:min-h-[68px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-1.5 text-[22px] md:text-[26px] font-extrabold tracking-tight">
            <span className="text-[26px] md:text-3xl text-[#245b3b] leading-none">✳</span>
            <span>
              <span className="text-[#245b3b]">Organic</span>
              <span className="text-[#77956b]">Harvest</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-[#26362b]">
            <Link to="/" className="hover:text-[#245b3b] transition-colors">Home</Link>
            
            {/* <a href="/#..."> ki jagah <button> use kiya taki footer pe jump na ho */}
            <button onClick={(e) => handleNavClick(e, 'categories')} className="hover:text-[#245b3b] transition-colors">Categories</button>
            <button onClick={(e) => handleNavClick(e, 'products')} className="hover:text-[#245b3b] transition-colors">Shop</button>
            <button onClick={(e) => handleNavClick(e, 'about')} className="hover:text-[#245b3b] transition-colors">About</button>
            <button onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-[#245b3b] transition-colors">Contact</button>
            
            {user && (
              <Link to="/orders" className="font-semibold text-[#245b3b] hover:text-[#1a452c] transition-colors border-l border-gray-300 pl-6 flex items-center gap-1.5">
                <Package size={16} /> Orders
              </Link>
            )}
          </nav>

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

            <div className="hidden md:flex items-center gap-4 border-l border-gray-300 pl-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#245b3b] flex items-center gap-1">
                    <User size={16} /> {user.name.split(' ')[0]}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-bold text-[#245b3b] hover:text-[#1a452c] transition-colors">
                  Login
                </Link>
              )}
            </div>

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

        {/* Search Bar ko <form> mein wrap kiya taki Enter kaam kare */}
        <div className="pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search fresh vegetables, fruits, groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 md:py-3 text-sm bg-[#f3f5ee] border border-transparent rounded-xl outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:border-[#245b3b]/30 focus:shadow-sm"
            />
          </form>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e6e8df] px-4 py-4 flex flex-col gap-4 shadow-md absolute w-full">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-[#26362b] font-medium border-b border-gray-100 pb-2">Home</Link>
          
          {/* Mobile menu mein bhi button use kiya */}
          <button onClick={(e) => handleNavClick(e, 'categories')} className="text-left text-[#26362b] font-medium border-b border-gray-100 pb-2">Categories</button>
          <button onClick={(e) => handleNavClick(e, 'products')} className="text-left text-[#26362b] font-medium border-b border-gray-100 pb-2">Shop</button>
          <button onClick={(e) => handleNavClick(e, 'about')} className="text-left text-[#26362b] font-medium border-b border-gray-100 pb-2">About</button>
          <button onClick={(e) => handleNavClick(e, 'contact')} className="text-left text-[#26362b] font-medium border-b border-gray-100 pb-2">Contact</button>
          
          <div className="border-t border-gray-100 pt-2 flex flex-col gap-4">
            {user ? (
              <>
                <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="text-[#245b3b] font-bold flex items-center gap-2">
                  <Package size={18} /> My Orders
                </Link>
                <button onClick={handleLogout} className="text-red-500 font-medium text-left flex items-center gap-2">
                  <LogOut size={18} /> Logout ({user.name.split(' ')[0]})
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-[#245b3b] font-bold flex items-center gap-2">
                <User size={18} /> Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;