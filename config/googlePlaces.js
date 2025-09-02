// Configurazione Google Places API
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const PLACE_ID = 'ChIJvfLE8RVrEg0RdJn5qwLZafk'; // Place ID di Adagio Sevilla

// Debug: stampa le variabili d'ambiente nel server
console.log('🔧 DEBUG SERVER - Variabili d\'ambiente:');
console.log('🔑 REACT_APP_GOOGLE_PLACES_API_KEY:', GOOGLE_PLACES_API_KEY);
console.log('🔑 API Key presente:', !!GOOGLE_PLACES_API_KEY);
console.log('🔑 API Key lunghezza:', GOOGLE_PLACES_API_KEY ? GOOGLE_PLACES_API_KEY.length : 0);
console.log('🔑 API Key inizia con AIza:', GOOGLE_PLACES_API_KEY ? GOOGLE_PLACES_API_KEY.startsWith('AIza') : false);
console.log('📍 PLACE_ID:', PLACE_ID);

module.exports = {
  GOOGLE_PLACES_API_KEY,
  PLACE_ID
};
