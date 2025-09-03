import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Serranda = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Funzione per controllare l'orientamento dello schermo
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      setIsMobile(window.innerWidth <= 768);
    };

    // Controlla l'orientamento iniziale
    checkOrientation();

    // Aggiungi listener per il resize della finestra
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Dopo 1.5 secondi, inizia l'animazione di apertura
    const timer = setTimeout(() => {
      console.log('Inizio animazione serranda');
      setIsVisible(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleImageLoad = () => {
    console.log('Immagine serranda caricata con successo');
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('Errore caricamento immagine serranda');
    setImageError(true);
  };

  // Scegli l'immagine appropriata in base all'orientamento
  const getSerrandaImage = () => {
    if (isLandscape) {
      return "/Logo/Serranda 169.png";
    } else {
      return "/Logo/Serranda.png";
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 pointer-events-none ${isMobile ? 'mobile-serranda' : ''}`}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : '-100vh' }}
      transition={{ 
        duration: 2,
        ease: "easeInOut"
      }}
      onAnimationStart={() => console.log('Animazione serranda iniziata')}
      onAnimationComplete={() => console.log('Animazione serranda completata')}
      style={{
        // Prevenire problemi di zoom su mobile
        transform: isMobile ? 'translateZ(0)' : 'none',
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Immagine della serranda che si alza */}
      <div className="relative w-full h-full">
        {!imageError ? (
          <img
            src={getSerrandaImage()}
            alt="Serranda"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              // Prevenire problemi di zoom su mobile
              maxWidth: '100vw',
              maxHeight: '100vh',
              objectFit: 'cover'
            }}
          />
        ) : (
          // Fallback se l'immagine non carica
          <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
            <div className="text-white text-4xl font-bold">ADAGIO</div>
          </div>
        )}
        
        {/* Overlay nero per un effetto più realistico */}
        <motion.div
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: isVisible ? 0.3 : 0 }}
          transition={{ duration: 1.5 }}
        />
      </div>
    </motion.div>
  );
};

export default Serranda;
