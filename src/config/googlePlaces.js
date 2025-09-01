// Configurazione e servizi per Google Places API
import axios from 'axios';

// Configurazione per Google Places API
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const PLACE_ID = 'ChIJvfLE8RVrEg0RdJn5qwLZafk'; // Place ID di Adagio Sevilla

// Debug: stampa le variabili d'ambiente
console.log('🔧 DEBUG - Variabili d\'ambiente:');
console.log('🔑 REACT_APP_GOOGLE_PLACES_API_KEY:', GOOGLE_PLACES_API_KEY);
console.log('🔑 API Key presente:', !!GOOGLE_PLACES_API_KEY);
console.log('🔑 API Key lunghezza:', GOOGLE_PLACES_API_KEY ? GOOGLE_PLACES_API_KEY.length : 0);
console.log('🔑 API Key inizia con AIza:', GOOGLE_PLACES_API_KEY ? GOOGLE_PLACES_API_KEY.startsWith('AIza') : false);

// Funzione per testare se il Place ID è valido
export const testPlaceId = async () => {
  try {
    console.log('🔍 Test Place ID esistente tramite backend...');
    
    const response = await fetch('/api/test-place-id');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Luogo trovato tramite backend:', data.place);
      return data.place;
    } else {
      console.error('❌ Errore tramite backend:', data.message);
      return null;
    }
  } catch (error) {
    console.error('💥 Errore nella chiamata al backend:', error);
    return null;
  }
};

// Funzione per cercare il Place ID corretto del ristorante
export const searchRestaurantPlaceId = async (restaurantName, address) => {
  try {
    console.log('🔍 Ricerca Place ID tramite backend per:', restaurantName, 'a', address);
    
    const response = await fetch(`/api/search-place-id?name=${encodeURIComponent(restaurantName)}&location=${encodeURIComponent(address)}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Place ID trovato tramite backend:', data.placeId);
      return data.placeId;
    } else {
      console.warn('⚠️ Nessun luogo trovato tramite backend:', data.message);
      return null;
    }
  } catch (error) {
    console.error('💥 Errore nella chiamata al backend:', error);
    return null;
  }
};

// Funzione per ottenere le recensioni da Google Places
export const getGoogleReviews = async () => {
  try {
    console.log('🔍 Tentativo di caricamento recensioni Google tramite backend...');
    
    const response = await fetch('/api/google-reviews');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Recensioni caricate tramite backend:', data.reviews.length);
      console.log('⭐ Rating:', data.rating, 'su', data.totalReviews, 'recensioni');
      return data.reviews;
    } else {
      console.warn('⚠️ Nessuna recensione trovata tramite backend:', data.message);
      if (data.rating && data.totalReviews) {
        console.log('⭐ Rating disponibile:', data.rating, 'su', data.totalReviews, 'recensioni');
      }
      // Non restituire più recensioni finte, restituire array vuoto
      return [];
    }
  } catch (error) {
    console.error('💥 Errore nel recupero delle recensioni tramite backend:', error);
    // Non restituire più recensioni finte, restituire array vuoto
    return [];
  }
};

// Funzione per formattare la data esatta
const formatExactDate = (timestamp) => {
  if (!timestamp) return 'Data non disponibile';
  
  const date = new Date(timestamp * 1000);
  
  // Formato italiano: "15 marzo 2024"
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  
  return date.toLocaleDateString('it-IT', options);
};

// Recensioni di fallback rimosse - ora il sistema mostra solo recensioni reali

// Funzione per ottenere il rating complessivo
export const getGoogleOverallRating = async () => {
  try {
    console.log('🔍 Caricamento rating Google tramite backend...');
    
    const response = await fetch('/api/google-reviews');
    const data = await response.json();
    
    if (data.success) {
      const rating = data.rating || 0;
      const totalReviews = data.totalReviews || 0;
      
      console.log('⭐ Rating Google reale tramite backend:', rating, 'su', totalReviews, 'recensioni');
      
      return { rating, totalReviews };
    } else {
      console.log('⚠️ Nessun rating disponibile tramite backend');
      return { rating: 0, totalReviews: 0 };
    }
  } catch (error) {
    console.error('💥 Errore nel recupero del rating Google tramite backend:', error);
    return { rating: 0, totalReviews: 0 };
  }
};
