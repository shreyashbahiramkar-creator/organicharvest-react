import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

function Toast() {
  const { toastMessage } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (toastMessage) {
      setDisplayMessage(toastMessage);
      // Chhota sa delay taaki transition trigger ho
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [toastMessage]);

  if (!displayMessage) return null;

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-[300] pointer-events-none">
      <div
        className={`bg-[#245b3b] text-white px-6 py-3 rounded-full font-semibold shadow-[0_8px_24px_rgba(36,91,59,0.3)] flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isVisible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-6 scale-90'
        }`}
      >
        <span>✅</span> {displayMessage}
      </div>
    </div>
  );
}

export default Toast;