import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Instagram, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../translations';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();
  
  // Stato per la newsletter
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' o 'error'

  // Funzione per gestire l'iscrizione alla newsletter
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage('Inserisci un indirizzo email valido');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'Website',
          language: language || 'it'
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.duplicate) {
          setMessage(t('footer.newsletterDuplicate'));
          setMessageType('success');
        } else {
          setMessage(t('footer.newsletterSuccess'));
          setMessageType('success');
        }
        setEmail('');
      } else {
        setMessage(data.error || t('footer.newsletterError'));
        setMessageType('error');
      }
    } catch (error) {
      console.error('Errore newsletter:', error);
      setMessage('Errore di connessione. Riprova più tardi.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Icone personalizzate per TikTok e TripAdvisor
  const TikTokIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );

  const TripAdvisorIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
      <path d="M8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"/>
    </svg>
  );

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, href: "https://www.instagram.com/adagio_sevilla/", label: "Instagram" },
    { icon: <TikTokIcon />, href: "https://www.tiktok.com/@adagio.sevilla?_t=ZN-8z9exLYd4CM&_r=1", label: "TikTok" },
    { icon: <TripAdvisorIcon />, href: "https://www.tripadvisor.it/Restaurant_Review-g187443-d32877525-Reviews-Adagio-Seville_Province_of_Seville_Andalucia.html", label: "TripAdvisor" },
  ];

  const quickLinks = [
    { name: t('navigation.home'), href: "#home" },
    { name: t('navigation.gallery'), href: "#gallery" },
    { name: t('navigation.about'), href: "#chi-siamo" },
    { name: t('navigation.bookings'), href: "#prenotazioni" },
    { name: t('navigation.reviews'), href: "#recensioni" },
  ];

  return (
    <footer className="bg-adagio-black text-adagio-cream relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Logo e Descrizione */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center mb-4">
              <img 
                src="/Logo/LOGO png.png" 
                alt="Logo Adagio" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-adagio-cream/90 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-adagio-green/20 hover:bg-adagio-green text-adagio-cream rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Rapidi */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-6 font-heading">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-adagio-cream/80 hover:text-adagio-green transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Orari e Informazioni */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 font-heading">{t('footer.hours')}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-adagio-green" />
                <div>
                  <p className="font-medium">{t('footer.mondayThursday')}</p>
                  <p className="text-adagio-cream/80">{t('footer.eveningOnly')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-adagio-green" />
                <div>
                  <p className="font-medium">{t('footer.fridaySunday')}</p>
                  <p className="text-adagio-cream/80">{t('footer.lunchAndDinner')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contatti */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 font-heading">{t('footer.contacts')}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-adagio-green mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('footer.address')}</p>
                  <p className="text-adagio-cream/80">
                    Calle Feria 118, Plata Baja B<br />
                    Sevilla 41002, Spagna
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-adagio-green" />
                <div>
                  <p className="font-medium">{t('footer.phone')}</p>
                  <a 
                    href="tel:+34614292733" 
                    className="text-adagio-cream/80 hover:text-adagio-green transition-colors"
                  >
                    +34 614 29 27 33
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-adagio-green" />
                <div>
                  <p className="font-medium">{t('footer.email')}</p>
                  <a 
                    href="mailto:infoadagiosevilla@gmail.com" 
                    className="text-adagio-cream/80 hover:text-adagio-green transition-colors"
                  >
                    infoadagiosevilla@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t border-adagio-cream/20 pt-8 mb-8"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 font-heading">
              {t('footer.newsletter')}
            </h3>
            <p className="text-adagio-cream/80 mb-6">
              {t('footer.newsletterDescription')}
            </p>
            
            {/* Messaggio di stato */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-lg flex items-center justify-center gap-2 ${
                  messageType === 'success' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm">{message}</span>
              </motion.div>
            )}

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                disabled={isLoading}
                className="flex-1 max-w-md px-4 py-3 rounded-lg border-2 border-adagio-cream/20 focus:border-adagio-green focus:outline-none text-adagio-black placeholder-adagio-black/60 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <button 
                type="submit"
                disabled={isLoading || !email}
                className="bg-adagio-green hover:bg-adagio-green-dark disabled:bg-gray-400 text-adagio-cream font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isLoading ? 'Iscrizione...' : t('footer.subscribe')}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-t border-adagio-cream/20 pt-8 text-center"
        >
          <p className="text-adagio-cream/70">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <p className="text-adagio-cream/60 text-sm mt-2">
            {t('footer.madeWith')}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
