import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin, ThumbsUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Importa i CSS di Swiper
import 'swiper/css';
import 'swiper/css/pagination';

const ReviewsCarousel = ({ reviews, title, subtitle, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adagio-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-adagio-green text-adagio-cream px-4 py-2 rounded-lg hover:bg-adagio-green-dark transition-colors"
        >
          Riprova
        </button>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-adagio-black/60">Nessuna recensione disponibile al momento.</p>
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="w-full">
      {/* Header del carosello */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-adagio-black mb-2">{title}</h3>
        {subtitle && (
          <p className="text-adagio-black/70">{subtitle}</p>
        )}
      </div>

      {/* Carosello Swiper */}
      <div className="relative">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          grabCursor={true}
          touchRatio={1}
          touchAngle={45}
          threshold={5}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="reviews-swiper"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={review.id || index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <div className="bg-adagio-cream p-6 rounded-xl shadow-lg border border-adagio-black/20 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Header della recensione */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-adagio-black text-lg mb-2">
                        {review.author}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-adagio-black/70">{review.date}</span>
                      </div>
                      {review.location && (
                        <div className="flex items-center gap-1 text-sm text-adagio-black/60">
                          <MapPin className="w-4 h-4" />
                          {review.location}
                        </div>
                      )}
                    </div>
                    <Quote className="w-8 h-8 text-adagio-green/40 flex-shrink-0 ml-4" />
                  </div>
                  
                  {/* Testo della recensione */}
                  <div className="flex-1">
                    <p className="text-adagio-black leading-relaxed text-sm line-clamp-4">
                      {review.text}
                    </p>
                  </div>
                  
                  {/* Footer della recensione */}
                  <div className="mt-4 pt-4 border-t border-adagio-black/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-adagio-black/60">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful} utili</span>
                      </div>
                      {review.source && (
                        <span className="text-xs text-adagio-green font-medium uppercase tracking-wide">
                          {review.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Stili personalizzati per Swiper */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .reviews-swiper .swiper-pagination-bullet {
            background: #4ade80;
            opacity: 0.5;
          }
          .reviews-swiper .swiper-pagination-bullet-active {
            opacity: 1;
          }
          .reviews-swiper {
            cursor: grab;
          }
          .reviews-swiper:active {
            cursor: grabbing;
          }
        `
      }} />
    </div>
  );
};

export default ReviewsCarousel;
