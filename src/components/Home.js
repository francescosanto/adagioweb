import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../translations';

const Home = () => {
  const [tilesVisible, setTilesVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const { t } = useLanguage();

  const videoSrc = '/Video/Adagio 1 Video.mp4';
  const fallbackImage = '/Ambiente/DSC_2627.jpg';

  useEffect(() => {
    const timer = setTimeout(() => setTilesVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleVideoLoad = () => {
      console.log('Video caricato:', videoSrc);
      setVideoLoaded(true);
      setVideoError(false);
    };

    const handleVideoPlay = () => {
      console.log('Video in riproduzione:', videoSrc);
      setIsPlaying(true);
    };

    const handleVideoError = (e) => {
      console.error('Errore caricamento video:', videoSrc, e);
      setVideoError(true);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', handleVideoLoad);
      video.addEventListener('play', handleVideoPlay);
      video.addEventListener('error', handleVideoError);
      
      return () => {
        video.removeEventListener('loadeddata', handleVideoLoad);
        video.removeEventListener('play', handleVideoPlay);
        video.removeEventListener('error', handleVideoError);
      };
    }
  }, []);



  const scrollToPrenotazioni = () => {
    const element = document.getElementById('prenotazioni');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Background Video/Image - Sfondo completo */}
      <div className="absolute inset-0">
        {/* Fallback immagine se i video non funzionano */}
        {videoError && (
          <img 
            src={fallbackImage} 
            alt="Ambiente ristorante" 
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Video di sfondo in loop */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop={true}
          className={`w-full h-full object-cover ${videoError ? 'hidden' : ''}`}
          onLoadedData={() => setVideoLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onError={(e) => {
            console.error('Errore video:', e);
            setVideoError(true);
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Il tuo browser non supporta i video.
        </video>
        
        {/* Overlay più leggero per rendere il video più visibile */}
        <div className="absolute inset-0 bg-black/25"></div>
        
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-24">
        {/* Container interno per il contenuto testuale con sfondo semi-trasparente */}
        <div className="w-full max-w-4xl lg:max-w-3xl mx-auto bg-black/20 backdrop-blur-sm border-4 border-white/20 p-8 lg:p-6 rounded-2xl shadow-2xl">
          {/* Logo Adagio */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={tilesVisible ? { 
              opacity: 1, 
              y: 0, 
              scale: 1 
            } : {}}
            transition={{ 
              duration: 1.2,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -10,
              scale: 1.05 
            }}
            className="mb-12 flex justify-center"
          >
            <img
              src="/Logo/Adagio Titolo.png"
              alt="Adagio - Ristorante"
              className="w-56 md:w-72 lg:w-[500px] h-auto object-contain drop-shadow-2xl mx-auto"
              onError={(e) => {
                console.log('Errore caricamento logo Adagio Titolo');
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Logo Adagio Titolo caricato con successo');
              }}
            />
          </motion.div>

          {/* Motto del Ristorante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-12"
          >
            <p className="text-xl md:text-2xl text-white font-elegant font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {t('home.subtitle')}
            </p>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="mt-12"
          >
            <button 
              onClick={scrollToPrenotazioni}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-light py-4 px-12 rounded-full text-lg transition-all duration-500 transform hover:scale-105 border border-white/30 hover:border-white/50 shadow-2xl hover:shadow-white/20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {t('home.bookNow')}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
