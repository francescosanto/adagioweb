// Configurazione per l'ambiente di produzione
module.exports = {
  // Configurazioni di sicurezza
  security: {
    // Rate limiting più severo in produzione
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minuti
      max: 50, // limite ridotto per produzione
      message: {
        success: false,
        error: 'Troppe richieste, riprova più tardi'
      }
    },
    
    // Rate limiting per endpoint pubblici
    publicRateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minuti
      max: 5, // limite molto ridotto per prenotazioni/newsletter
      message: {
        success: false,
        error: 'Troppe richieste, riprova più tardi'
      }
    }
  },
  
  // Domini consentiti per CORS
  allowedOrigins: [
    'https://adagiosevilla.github.io',
    'https://adagio-restaurant.netlify.app',
    'https://adagio-restaurant.vercel.app'
  ],
  
  // Configurazioni del server
  server: {
    port: process.env.PORT || process.env.BACKEND_PORT || 5001,
    host: '0.0.0.0' // Per compatibilità con servizi cloud
  },
  
  // Logging
  logging: {
    level: 'info',
    format: 'combined'
  }
};
