import React from 'react';
import { motion } from 'framer-motion';
import { Star, Globe } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import ReviewsCarousel from './ReviewsCarousel';
import { useLanguage } from '../translations';

const Recensioni = () => {
  const { 
    googleReviews, 
    overallRating, 
    loading, 
    error
  } = useReviews();
  const { t } = useLanguage();

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
    <div className="min-h-screen bg-section-main relative overflow-hidden">
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 max-w-7xl mx-auto w-full">
        {/* Container interno per il contenuto testuale */}
        <div className="w-full max-w-6xl mx-auto bg-transparent border-4 border-transparent p-12">
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-adagio-black mb-6 font-heading text-center"
          >
            {t('reviews.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-adagio-black mb-12 text-center max-w-3xl mx-auto"
          >
            {t('reviews.subtitle')}
          </motion.p>

          {/* Overall Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <div className="bg-adagio-cream p-8 rounded-2xl shadow-xl border-2 border-adagio-black/20 inline-block">
              <h3 className="text-2xl font-bold text-adagio-black mb-4">{t('reviews.averageRating')}</h3>
              <div className="flex justify-center mb-4">
                {renderStars(Math.round(overallRating.rating))}
              </div>
              <p className="text-4xl font-bold text-adagio-green mb-2">
                {overallRating.rating.toFixed(1)}/5
              </p>
              <p className="text-adagio-black">
                {t('reviews.basedOn')} {overallRating.totalReviews} {t('reviews.reviews')}
              </p>
            </div>
          </motion.div>





          {/* Reviews Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            {googleReviews.length > 0 ? (
              <ReviewsCarousel
                reviews={googleReviews}
                loading={loading}
                error={error}
              />
            ) : (
              <div className="text-center py-12 bg-adagio-cream/50 rounded-2xl border border-adagio-black/20">
                <Globe className="w-16 h-16 text-adagio-black/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-adagio-black mb-2">
                  {t('reviews.noReviewsAvailable')}
                </h3>
                <p className="text-adagio-black/70 mb-4">
                  {t('reviews.noReviewsDescription')}
                </p>
                {error && (
                  <p className="text-red-600 text-sm mb-4">
                    {t('common.error')}: {error}
                  </p>
                )}
                <p className="text-sm text-adagio-black/50">
                  {t('reviews.tryAgain')}
                </p>
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center mt-8"
          >
            <div className="bg-adagio-tile/50 p-4 rounded-xl border border-adagio-black/20 max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-adagio-black mb-3">
                {t('reviews.leaveReview')}
              </h3>
              <p className="text-sm text-adagio-black mb-4">
                {t('reviews.leaveReviewDescription')}
              </p>
              <div className="flex justify-center">
                <a 
                  href="https://maps.app.goo.gl/5RxYZ4LUQdYDRHuj9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-adagio-green hover:bg-adagio-green-dark text-adagio-cream font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                >
                  {t('reviews.googleMapsReview')}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Recensioni;
