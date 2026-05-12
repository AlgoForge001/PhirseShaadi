/**
 * Normalizes an image URL to work across different environments.
 * Specifically handles the case where URLs stored in the database point to 
 * the production server while the app is running on localhost.
 */
export const normalizeImageUrl = (url) => {
  if (!url) return null;

  // Handle absolute URLs
  if (url.startsWith('http')) {
    const isLocal = window.location.hostname === 'localhost';
    // If we are local, but the URL points to the production render server
    if (isLocal && url.includes('phirseshaadi.onrender.com')) {
      return url.replace('https://phirseshaadi.onrender.com', 'http://localhost:5000');
    }
    // Also handle rebranding domain if it was already updated in DB
    if (isLocal && url.includes('phirseshaadi.onrender.com')) {
      return url.replace('https://phirseshaadi.onrender.com', 'http://localhost:5000');
    }
    return url;
  }

  // Handle relative paths
  const backendUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://phirseshaadi.onrender.com' : 'http://localhost:5000');
  
  // Ensure we don't double up slashes
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  // If the relative path already starts with /api, we might need to be careful
  // but usually it's just /uploads/...
  return `${backendUrl.replace(/\/api$/, '')}${cleanUrl}`;
};



