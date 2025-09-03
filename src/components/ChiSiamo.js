import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../translations';

const ChiSiamo = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { t } = useLanguage();

  // Solo immagini dalla cartella Ambiente
  const images = [
    '/Ambiente/DSC_2627.jpg',
    '/Ambiente/DSC_2649.jpg',
    '/Ambiente/DSC_2691.jpg',
    '/Ambiente/DSC_2992.jpg',
    '/Ambiente/DSC_3243.jpg',
    '/Ambiente/WhatsApp Image 2025-05-29 at 13.46.03 (3).jpeg',
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      }
    });
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, paginate]);

  return (
    <div className="min-h-screen bg-section-main relative overflow-hidden">
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 max-w-7xl mx-auto">
        {/* Container interno per il contenuto testuale */}
        <div className="w-full max-w-5xl mx-auto bg-transparent border-4 border-transparent p-12">
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-adagio-black mb-6 font-heading text-center"
          >
            {t('about.title')}
          </motion.h2>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-left"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-adagio-black mb-6 font-heading">
                {t('about.storyTitle')}
              </h3>
              
              <div className="space-y-4 text-lg text-adagio-black leading-relaxed">
                <p>
                  {t('about.story1')}
                </p>
                
                <p>
                  {t('about.story2')}
                </p>
                
                <p>
                  {t('about.story3')}
                </p>
              </div>
            </motion.div>

            {/* Carousel delle immagini dei piatti */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full h-full flex flex-col justify-center"
            >
              {/* Carousel Container */}
              <div className="relative w-full h-full">
                {/* Carousel verticale su schermi orizzontali, orizzontale su schermi verticali */}
                <div className="carousel-3d relative overflow-hidden rounded-2xl shadow-2xl
                  h-64 w-full md:h-80 md:w-full lg:h-full lg:w-auto lg:aspect-[3/4]">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                      key={currentIndex}
                      src={images[currentIndex]}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        rotateY: { duration: 0.3 },
                        scale: { duration: 0.3 },
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                          paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                          paginate(-1);
                        }
                      }}
                      className="absolute w-full h-full object-cover cursor-grab active:cursor-grabbing"
                      alt={`Immagine ${currentIndex + 1} del ristorante Adagio`}
                      onError={(e) => {
                        console.log('Errore caricamento immagine gallery:', images[currentIndex]);
                      }}
                      onLoad={() => {
                        console.log('Immagine gallery caricata:', images[currentIndex]);
                      }}
                    />
                  </AnimatePresence>

                  {/* Navigation Buttons - ora posizionate rispetto al carosello */}
                  <button
                    onClick={() => paginate(-1)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  <button
                    onClick={() => paginate(1)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Image Counter - ora posizionato rispetto al carosello */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-adagio-black/80 text-adagio-cream px-3 py-1 rounded-full text-xs font-medium">
                    {currentIndex + 1} / {images.length}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiSiamo;
