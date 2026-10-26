// src/utils/imageOptimizer.js

/**
 * External image URL ko optimize karta hai
 * @param {string} url - Original image URL
 * @param {number} width - Desired width (default 400)
 * @param {number} height - Desired height (default 400)
 * @returns {string} - Optimized URL
 */
export const optimizeImage = (url, width = 400, height = 400) => {
  if (!url) return '';
  
  // Agar already optimized URL hai toh wapas karo
  if (url.includes('wsrv.nl')) return url;
  
  // Unsplash URLs ke liye direct params use karo (fastest)
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&h=${height}&fit=crop&q=70&auto=format`;
  }
  
  // Baaki sab external images ke liye wsrv.nl proxy use karo
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&h=${height}&fit=cover&output=webp&q=75`;
};