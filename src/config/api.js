// Configurazione API
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5001/api');

// Funzione per gestire le chiamate API
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Errore API ${endpoint}:`, error);
    throw error;
  }
};

// API per le prenotazioni
export const api = {
  // Testa la connessione a Google Sheets
  testConnection: () => apiCall('/test-connection'),

  // Legge tutte le prenotazioni
  readBookings: () => apiCall('/bookings'),

  // Aggiunge una nuova prenotazione
  addBooking: (bookingData) => apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  // Verifica la disponibilità per una data
  getAvailability: (date) => apiCall(`/availability/${date}`),

  // Ottiene le statistiche
  getStats: () => apiCall('/stats'),
};
