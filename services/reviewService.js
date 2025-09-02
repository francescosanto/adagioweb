const { GOOGLE_PLACES_API_KEY, PLACE_ID } = require('../config/googlePlaces');

class ReviewService {
  // Testa se il Place ID è valido
  async testPlaceId() {
    try {
      console.log('🔍 Test Place ID esistente:', PLACE_ID);
      
      if (!GOOGLE_PLACES_API_KEY) {
        console.warn('⚠️ Google Places API key non configurata');
        return null;
      }

      // Prima prova la nuova Places API (New)
      try {
        const basicInfoUrl = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=displayName,formattedAddress,rating,userRatingCount&key=${GOOGLE_PLACES_API_KEY}`;
        console.log('🌐 Test info base (nuova API):', basicInfoUrl);
        
        const response = await fetch(basicInfoUrl);
        const data = await response.json();
        console.log('📡 Risposta info base (nuova API):', data);
        
        if (response.ok && data) {
          const place = data;
          console.log('✅ Luogo trovato (nuova API):', {
            name: place.displayName?.text || 'N/A',
            address: place.formattedAddress || 'N/A',
            rating: place.rating || 'N/A',
            totalReviews: place.userRatingCount || 'N/A'
          });
          return place;
        }
      } catch (error) {
        console.log('⚠️ Nuova API fallita, provo la vecchia API...');
      }

      // Fallback alla vecchia API
      try {
        const basicInfoUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,formatted_address,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`;
        console.log('🌐 Test info base (vecchia API):', basicInfoUrl);
        
        const response = await fetch(basicInfoUrl);
        const data = await response.json();
        console.log('📡 Risposta info base (vecchia API):', data);
        
        if (data.status === 'OK' && data.result) {
          const place = data.result;
          console.log('✅ Luogo trovato (vecchia API):', {
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            totalReviews: place.user_ratings_total
          });
          return place;
        } else {
          console.error('❌ Errore info base (vecchia API):', data.status, data.error_message);
        }
      } catch (error) {
        console.error('💥 Errore anche con la vecchia API:', error);
      }

      return null;
    } catch (error) {
      console.error('💥 Errore nel test del Place ID:', error);
      return null;
    }
  }

  // Cerca il Place ID corretto del ristorante
  async searchRestaurantPlaceId(restaurantName, address) {
    try {
      console.log('🔍 Ricerca Place ID per:', restaurantName, 'a', address);
      
      if (!GOOGLE_PLACES_API_KEY) {
        console.warn('⚠️ Google Places API key non configurata');
        return null;
      }

      const searchQuery = `${restaurantName} ${address}`;
      const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}`;
      
      console.log('🌐 Chiamata ricerca API (classica):', apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('📡 Risposta ricerca API:', data);
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const place = data.results[0];
        console.log('✅ Luogo trovato (API classica):', {
          name: place.name,
          place_id: place.place_id,
          address: place.formatted_address,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total
        });
        return place.place_id;
      } else {
        console.warn('⚠️ Nessun luogo trovato per la ricerca');
        return null;
      }
    } catch (error) {
      console.error('💥 Errore nella ricerca del Place ID:', error);
      return null;
    }
  }

  // Ottiene le recensioni Google
  async getGoogleReviews() {
    try {
      if (!GOOGLE_PLACES_API_KEY) {
        throw new Error('Google Places API key non configurata');
      }

      // Usa la nuova Places API (New) per le recensioni
      const apiUrl = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews,rating,userRatingCount&key=${GOOGLE_PLACES_API_KEY}`;
      console.log('🌐 Chiamata API recensioni (nuova):', apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('📡 Risposta API recensioni:', data);
      
      if (response.ok && data) {
        if (data.reviews && data.reviews.length > 0) {
          const reviews = data.reviews.map(review => {
            console.log('🔍 Debug recensione completa:', {
              keys: Object.keys(review),
              createTime: review.createTime,
              publishTime: review.publishTime,
              updateTime: review.updateTime,
              raw: review
            });
            
            // Prova diversi campi per la data
            let timestamp = review.createTime || review.publishTime || review.updateTime;
            
            return {
              id: review.name || Math.random(),
              author: review.authorAttribution?.displayName || 'Anonimo',
              rating: review.rating || 5,
              date: this.formatExactDate(timestamp),
              text: review.text?.text || 'Nessun testo',
              helpful: Math.floor(Math.random() * 20) + 5,
              profilePhoto: review.authorAttribution?.photoUri || null,
              source: 'google'
            };
          });
          
          return { success: true, reviews, rating: data.rating, totalReviews: data.userRatingCount };
        } else {
          return { success: false, message: 'Nessuna recensione trovata', rating: data.rating, totalReviews: data.userRatingCount };
        }
      } else {
        return { success: false, message: 'Errore API', error: data.error?.message || 'Errore sconosciuto' };
      }
    } catch (error) {
      console.error('💥 Errore nel recupero delle recensioni:', error);
      throw new Error('Errore nel recupero delle recensioni');
    }
  }

  // Formatta la data esatta
  formatExactDate(timestamp) {
    console.log('🔍 formatExactDate ricevuto:', timestamp, 'tipo:', typeof timestamp);
    
    if (!timestamp) {
      console.log('❌ Nessun timestamp fornito');
      return 'Data non disponibile';
    }
    
    try {
      let date;
      
      // Gestisce diversi formati di timestamp
      if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (typeof timestamp === 'number') {
        if (timestamp > 1000000000000) {
          date = new Date(timestamp);
        } else {
          date = new Date(timestamp * 1000);
        }
      } else {
        console.log('❌ Formato timestamp non riconosciuto:', timestamp);
        return 'Data non disponibile';
      }
      
      if (isNaN(date.getTime())) {
        console.log('❌ Data non valida dopo il parsing:', date);
        return 'Data non disponibile';
      }
      
      console.log('✅ Data parsata correttamente:', date);
      
      // Formato italiano: "15 marzo 2024"
      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      
      const formattedDate = date.toLocaleDateString('it-IT', options);
      console.log('✅ Data formattata:', formattedDate);
      
      return formattedDate;
    } catch (error) {
      console.error('❌ Errore nel parsing della data:', error, 'timestamp:', timestamp);
      return 'Data non disponibile';
    }
  }
}

module.exports = new ReviewService();
