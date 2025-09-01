import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../translations';

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const { t } = useLanguage();

  // Solo immagini dalla cartella Piatti (aggiornate)
  const images = [
    '/Piatti/20250202_153459.jpg',
    '/Piatti/20250203_142419.jpg',
    '/Piatti/20250207_150531.jpg',
    '/Piatti/20250207_151725.jpg',
    '/Piatti/DSC_3150.jpg',
    '/Piatti/DSC_3187.jpg',
    '/Piatti/DSC_3223.jpg',
    '/Piatti/image00005.jpeg',
    '/Piatti/image00012.jpeg',
    '/Piatti/image00013.jpeg',
    '/Piatti/image00023.jpeg',
    '/Piatti/image00025.jpeg',
    '/Piatti/image00029.jpeg',
    '/Piatti/WhatsApp Image 2025-02-25 at 17.35.24.jpeg',
    '/Piatti/WhatsApp Image 2025-04-24 at 16.32.37.jpeg',
    '/Piatti/WhatsApp Image 2025-04-24 at 16.32.39 (1).jpeg',
    '/Piatti/WhatsApp Image 2025-04-24 at 16.32.45 (1).jpeg',
    '/Piatti/WhatsApp Image 2025-05-22 at 16.19.05.jpeg',
    '/Piatti/WhatsApp Image 2025-06-08 at 19.09.38.jpeg',
    '/Piatti/WhatsApp Image 2025-06-08 at 19.09.38 (2).jpeg',
    '/Piatti/WhatsApp Image 2025-06-08 at 19.09.39.jpeg',
    '/Piatti/WhatsApp Image 2025-06-08 at 19.09.39 (2).jpeg',
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      zIndex: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      zIndex: 0,
    }),
  };

  // Varianti per le immagini laterali - posizioni fisse senza rotazioni pesanti
  const sideImageVariants = {
    leftSide: {
      x: '-80%',
      scale: 0.7,
      opacity: 0.6,
      zIndex: 0,
    },
    rightSide: {
      x: '80%',
      scale: 0.7,
      opacity: 0.6,
      zIndex: 0,
    },
  };

  const paginate = useCallback((newDirection) => {
    setIsChanging(true);
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return (prevIndex + 1) % images.length;
      } else {
        return prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1;
      }
    });
    
    // Rimuovi il blur dopo un breve delay
    setTimeout(() => setIsChanging(false), 150);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, paginate]);

  // Calcola gli indici per le immagini laterali
  const getPreviousIndex = (current) => {
    return current - 1 < 0 ? images.length - 1 : current - 1;
  };

  const getNextIndex = (current) => {
    return (current + 1) % images.length;
  };

  return (
    <div className="min-h-screen bg-section-alt relative overflow-hidden">
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-6xl mx-auto">
        {/* Container interno per il contenuto testuale */}
        <div className="w-full max-w-4xl mx-auto bg-transparent border-4 border-transparent p-6 lg:p-8">
          
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-adagio-black mb-8 font-heading text-center"
          >
            {t('gallery.title')}
          </motion.h2>
          
          {/* Enhanced 3D Carousel Container */}
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="carousel-3d relative h-80 md:h-96 lg:h-auto lg:aspect-[4/3] lg:max-w-xl mx-auto overflow-visible rounded-2xl bg-adagio-black/5">
              
              {/* Previous Image (Left Side) */}
              <motion.div
                className="absolute left-0 top-0 w-full h-full cursor-pointer"
                initial="leftSide"
                animate="leftSide"
                variants={sideImageVariants}
                whileHover={!isChanging ? { 
                  scale: 0.75,
                  x: '-70%',
                } : {}}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                onClick={() => paginate(-1)}
              >
                <motion.img
                  src={images[getPreviousIndex(currentIndex)]}
                  alt="Immagine precedente"
                  className="w-full h-full object-cover rounded-2xl shadow-lg opacity-60"
                  animate={{
                    filter: isChanging ? 'blur(3px)' : 'blur(0px)',
                  }}
                  transition={{ duration: 0.1 }}
                />
              </motion.div>

              {/* Current Image (Center) */}
              <div className="relative w-full h-full">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "tween", duration: 0.15, ease: "easeInOut" },
                      opacity: { duration: 0.15 },
                      scale: { duration: 0.15 },
                    }}
                    className="absolute w-full h-full object-cover cursor-default rounded-2xl shadow-2xl"
                    alt={`Immagine ${currentIndex + 1} del ristorante Adagio`}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { 
                        duration: 0.5,
                        ease: "easeOut"
                      }
                    }}
                    style={{
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    onError={(e) => {
                      console.log('Errore caricamento immagine gallery:', images[currentIndex]);
                    }}
                    onLoad={() => {
                      console.log('Immagine gallery caricata:', images[currentIndex]);
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Next Image (Right Side) */}
              <motion.div
                className="absolute right-0 top-0 w-full h-full cursor-pointer"
                initial="rightSide"
                animate="rightSide"
                variants={sideImageVariants}
                whileHover={!isChanging ? { 
                  scale: 0.75,
                  x: '70%',
                } : {}}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                onClick={() => paginate(1)}
              >
                <motion.img
                  src={images[getNextIndex(currentIndex)]}
                  alt="Immagine successiva"
                  className="w-full h-full object-cover rounded-2xl shadow-lg opacity-60"
                  animate={{
                    filter: isChanging ? 'blur(3px)' : 'blur(0px)',
                  }}
                  transition={{ duration: 0.1 }}
                />
              </motion.div>

            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-adagio-green/80 hover:bg-adagio-green text-adagio-cream p-3 rounded-full shadow-lg transition-all duration-150 hover:scale-110 z-10"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={() => paginate(1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-adagio-green/80 hover:bg-adagio-green text-adagio-cream p-3 rounded-full shadow-lg transition-all duration-150 hover:scale-110 z-3"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-adagio-black/80 text-adagio-cream px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Enhanced Navigation Info */}
          <div className="mt-8 text-center">
            <p className="text-adagio-black text-lg">
              {t('gallery.navigation')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
