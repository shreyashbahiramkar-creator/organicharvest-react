// src/components/ScrollToTopOnNavigate.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jaise hi URL change hoga (naya page khulega), yeh window ko top pe le aayega
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Yeh UI mein kuch render nahi karta
}

export default ScrollToTopOnNavigate;