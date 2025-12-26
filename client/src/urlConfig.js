// Ce petit script détecte automatiquement où on est
export const getApiUrl = () => {
  // Si on est sur ton PC (localhost)
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  } 
  // Sinon, on est en ligne (Vercel), donc on vise Render
  else {
    return 'https://bookstore-d1k4.onrender.com/api';
  }
};