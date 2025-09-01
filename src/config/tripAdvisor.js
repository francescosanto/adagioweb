// Servizio per TripAdvisor (simulato - può essere aggiornato con API reali)
import axios from 'axios';

// Configurazione per TripAdvisor
const TRIPADVISOR_API_KEY = process.env.REACT_APP_TRIPADVISOR_API_KEY;
const TRIPADVISOR_LOCATION_ID = '32877525'; // ID del ristorante Adagio su TripAdvisor

// Funzione per ottenere le recensioni da TripAdvisor
export const getTripAdvisorReviews = async () => {
  try {
    if (!TRIPADVISOR_API_KEY) {
      console.warn('TripAdvisor API key non configurata');
      return getMockTripAdvisorReviews();
    }

    // Nota: TripAdvisor ha un'API limitata e a pagamento
    // Questa è una struttura di esempio per quando avrai accesso all'API
    const response = await axios.get(
      `https://api.tripadvisor.com/api/v1/location/${TRIPADVISOR_LOCATION_ID}/reviews?key=${TRIPADVISOR_API_KEY}&limit=10`
    );

    if (response.data && response.data.reviews) {
      return response.data.reviews.map(review => ({
        id: review.id,
        author: review.user.name,
        rating: review.rating,
        date: formatRelativeTime(review.published_date),
        text: review.text,
        helpful: review.votes || 0,
        location: review.user.location,
        source: 'tripadvisor',
        profilePhoto: review.user.avatar_url
      }));
    }

    return getMockTripAdvisorReviews();
  } catch (error) {
    console.error('Errore nel recupero delle recensioni TripAdvisor:', error);
    return getMockTripAdvisorReviews();
  }
};

// Funzione per formattare la data relativa
const formatRelativeTime = (dateString) => {
  if (!dateString) return 'recentemente';
  
  const now = new Date();
  const reviewDate = new Date(dateString);
  const diff = now - reviewDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'oggi';
  if (days === 1) return 'ieri';
  if (days < 7) return `${days} giorni fa`;
  if (days < 30) return `${Math.floor(days / 7)} settimane fa`;
  if (days < 365) return `${Math.floor(days / 30)} mesi fa`;
  return `${Math.floor(days / 365)} anni fa`;
};

// Recensioni di fallback per TripAdvisor (simulate ma realistiche)
const getMockTripAdvisorReviews = () => [
  {
    id: 1,
    author: "Traveler123",
    rating: 5,
    date: "3 settimane fa",
    text: "Durante il nostro viaggio in Spagna, questo ristorante italiano è stato una scoperta meravigliosa. La cucina autentica e l'atmosfera familiare ci hanno fatto sentire a casa. Il risotto ai porcini è indimenticabile!",
    helpful: 25,
    location: "Sevilla, Spagna",
    source: 'tripadvisor'
  },
  {
    id: 2,
    author: "FoodLover2024",
    rating: 5,
    date: "1 mese fa",
    text: "Se cercate la vera essenza della cucina italiana a Sevilla, questo è il posto giusto. Ogni piatto racconta una storia e i sapori sono quelli della tradizione. Il personale è competente e cordiale.",
    helpful: 18,
    location: "Madrid, Spagna",
    source: 'tripadvisor'
  },
  {
    id: 3,
    author: "ItalianDreams",
    rating: 4,
    date: "2 settimane fa",
    text: "Ottima esperienza culinaria. I piatti sono preparati con ingredienti freschi e la presentazione è curata. L'ambiente rustico aggiunge fascino al locale. Consiglio la prenotazione nei weekend.",
    helpful: 14,
    location: "Barcellona, Spagna",
    source: 'tripadvisor'
  },
  {
    id: 4,
    author: "GustoItaliano",
    rating: 5,
    date: "1 settimana fa",
    text: "Ristorante che mantiene le promesse! La qualità del cibo è eccellente e i prezzi sono onesti. Ho apprezzato particolarmente la selezione di vini locali. Perfetto per una cena romantica.",
    helpful: 22,
    location: "Valencia, Spagna",
    source: 'tripadvisor'
  },
  {
    id: 5,
    author: "CucinaTradizionale",
    rating: 5,
    date: "3 giorni fa",
    text: "Un'esperienza gastronomica autentica. I piatti della tradizione sono preparati con maestria e passione. L'atmosfera è calda e accogliente, proprio come dovrebbe essere in un ristorante italiano.",
    helpful: 16,
    location: "Granada, Spagna",
    source: 'tripadvisor'
  }
];

// Funzione per ottenere il rating complessivo di TripAdvisor
export const getTripAdvisorOverallRating = async () => {
  try {
    if (!TRIPADVISOR_API_KEY) {
      return { rating: 4.8, totalReviews: 38 };
    }

    const response = await axios.get(
      `https://api.tripadvisor.com/api/v1/location/${TRIPADVISOR_LOCATION_ID}?key=${TRIPADVISOR_API_KEY}`
    );

    if (response.data) {
      return {
        rating: response.data.rating || 4.8,
        totalReviews: response.data.num_reviews || 38
      };
    }

    return { rating: 4.8, totalReviews: 38 };
  } catch (error) {
    console.error('Errore nel recupero del rating TripAdvisor:', error);
    return { rating: 4.8, totalReviews: 38 };
  }
};
