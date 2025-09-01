import { useState, useEffect } from 'react';
import { getGoogleReviews, getGoogleOverallRating } from '../config/googlePlaces';

export const useReviews = () => {
  const [googleReviews, setGoogleReviews] = useState([]);
  const [googleRating, setGoogleRating] = useState({ rating: 4.9, totalReviews: 45 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica tutte le recensioni
  const loadAllReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Inizio caricamento recensioni Google...');
      console.log('🔑 API Key disponibile:', !!process.env.REACT_APP_GOOGLE_PLACES_API_KEY);

      // Carica recensioni e rating in parallelo
      const [googleReviewsData, googleRatingData] = await Promise.all([
        getGoogleReviews(),
        getGoogleOverallRating()
      ]);

      console.log('📊 Dati ricevuti:', {
        reviews: googleReviewsData.length,
        rating: googleRatingData.rating,
        totalReviews: googleRatingData.totalReviews
      });

      console.log('📝 Recensioni complete:', googleReviewsData);
      console.log('⭐ Rating completo:', googleRatingData);

      setGoogleReviews(googleReviewsData);
      setGoogleRating(googleRatingData);
    } catch (err) {
      console.error('💥 Errore nel caricamento delle recensioni:', err);
      setError('Impossibile caricare le recensioni. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  // Calcola il rating complessivo (solo Google per ora)
  const getOverallRating = () => {
    return googleRating;
  };

  // Ricarica le recensioni
  const refreshReviews = () => {
    console.log('🔄 Ricaricamento recensioni...');
    loadAllReviews();
  };

  // Carica le recensioni al mount del componente
  useEffect(() => {
    loadAllReviews();
  }, []);

  return {
    googleReviews,
    tripAdvisorReviews: [], // Vuoto per ora
    googleRating,
    tripAdvisorRating: { rating: 0, totalReviews: 0 }, // Vuoto per ora
    overallRating: getOverallRating(),
    loading,
    error,
    refreshReviews
  };
};
