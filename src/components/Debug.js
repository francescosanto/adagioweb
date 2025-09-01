import React, { useState } from 'react';
import { getGoogleReviews, getGoogleOverallRating } from '../config/googlePlaces';

const Debug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      console.log('🧪 TEST API INIZIATO');
      
      // Test recensioni
      const reviews = await getGoogleReviews();
      console.log('🧪 Recensioni ricevute:', reviews);
      
      // Test rating
      const rating = await getGoogleOverallRating();
      console.log('🧪 Rating ricevuto:', rating);
      
      setDebugInfo({
        reviews: reviews,
        rating: rating,
        apiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY ? 'Presente' : 'Mancante',
        apiKeyLength: process.env.REACT_APP_GOOGLE_PLACES_API_KEY ? process.env.REACT_APP_GOOGLE_PLACES_API_KEY.length : 0,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('🧪 Errore nel test:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    setLoading(true);
    try {
      console.log('🧪 TEST BACKEND INIZIATO');
      
      const response = await fetch('/api/google-reviews');
      const data = await response.json();
      
      console.log('🧪 Risposta backend:', data);
      
      setDebugInfo({
        backendResponse: data,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('🧪 Errore nel test backend:', error);
      setDebugInfo({ backendError: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">🧪 Debug Component</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Test API Frontend'}
        </button>
        
        <button
          onClick={testBackend}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Test Backend'}
        </button>
      </div>

      {Object.keys(debugInfo).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">📊 Informazioni Debug</h2>
          
          <div className="space-y-4">
            {debugInfo.apiKey && (
              <div>
                <strong>🔑 API Key:</strong> {debugInfo.apiKey}
                {debugInfo.apiKeyLength > 0 && ` (${debugInfo.apiKeyLength} caratteri)`}
              </div>
            )}
            
            {debugInfo.timestamp && (
              <div>
                <strong>⏰ Timestamp:</strong> {debugInfo.timestamp}
              </div>
            )}
            
            {debugInfo.reviews && (
              <div>
                <strong>📝 Recensioni:</strong> {debugInfo.reviews.length} recensioni
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(debugInfo.reviews, null, 2)}
                </pre>
              </div>
            )}
            
            {debugInfo.rating && (
              <div>
                <strong>⭐ Rating:</strong> {debugInfo.rating.rating}/5 ({debugInfo.rating.totalReviews} recensioni)
              </div>
            )}
            
            {debugInfo.backendResponse && (
              <div>
                <strong>🌐 Risposta Backend:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(debugInfo.backendResponse, null, 2)}
                </pre>
              </div>
            )}
            
            {debugInfo.error && (
              <div className="text-red-600">
                <strong>❌ Errore Frontend:</strong> {debugInfo.error}
              </div>
            )}
            
            {debugInfo.backendError && (
              <div className="text-red-600">
                <strong>❌ Errore Backend:</strong> {debugInfo.backendError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Debug;

