import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, ChevronLeft, ChevronRight, RefreshCw, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useBookings } from '../hooks/useBookings';
import { config } from '../config/config';
import CountrySelector from './CountrySelector';
import { useLanguage } from '../translations';

const Prenotazioni = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Spain',
    code: 'ES',
    phone: '+34',
    flag: '🇪🇸'
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    notes: ''
  });
  
  // Stato per le notifiche
  const [notification, setNotification] = useState({
    message: '',
    type: '', // 'success' o 'error'
    show: false
  });
  
  const { t, language } = useLanguage();

  // Funzione per ottenere i giorni della settimana in base alla lingua
  const getWeekDays = () => {
    const days = {
      es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
    };
    return days[language] || days.es;
  };

  const {
    loading,
    error,
    connectionStatus,
    createBooking,
    changeMonth,
    generateMonthDates,
    reconnect,
    monthName,
    isDayClosed
  } = useBookings();

  // Orari disponibili per giorno della settimana
  const getTimeSlotsForDate = (date) => {
    if (!date) return [];
    const dayOfWeek = date.getDay(); // 0 = Domenica, 1 = Lunedì, ecc.
    return config.timeSlotsByDay[dayOfWeek] || [];
  };

  // Funzione per pulire e validare il numero di telefono
  const cleanPhoneNumber = (phone, countryPrefix) => {
    if (!phone) return '';
    
    // Rimuove tutti i caratteri non numerici (spazi, trattini, parentesi, +, ecc.)
    let cleaned = phone.replace(/[^\d]/g, '');
    
    // Se inizia con 00, sostituisce con +
    if (cleaned.startsWith('00')) {
      cleaned = cleaned.substring(2);
    }
    
    // Rimuove il prefisso del paese se presente all'inizio
    const prefixWithoutPlus = countryPrefix.replace('+', '');
    if (cleaned.startsWith(prefixWithoutPlus)) {
      cleaned = cleaned.substring(prefixWithoutPlus.length);
    }
    
    // Assicura che il numero abbia almeno 8 cifre
    if (cleaned.length < 8) {
      return phone; // Ritorna il numero originale se troppo corto
    }
    
    // Formatta il numero in modo leggibile
    if (cleaned.length === 10) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    } else if (cleaned.length === 9) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    } else if (cleaned.length === 8) {
      return `${cleaned.substring(0, 4)} ${cleaned.substring(4)}`;
    } else {
      return cleaned;
    }
  };

  // Funzione per verificare se una data è passata
  const isDatePast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset ore per confrontare solo le date
    return date < today;
  };

  // Funzione per verificare se una data è disponibile (non passata e non chiusa)
  const isDateAvailable = (date) => {
    return !isDatePast(date) && !isDayClosed(date);
  };

  // Funzione per verificare se un orario è passato per una data specifica
  const isTimePast = (date, time) => {
    if (!date || !time) return false;
    
    const now = new Date();
    const selectedDateTime = new Date(date);
    
    // Estrae ore e minuti dall'orario (es: "19:30" -> 19, 30)
    const [hours, minutes] = time.split(':').map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);
    
    // Se la data è oggi, confronta con l'ora attuale
    if (isDatePast(selectedDateTime) === false && 
        selectedDateTime.toDateString() === now.toDateString()) {
      return selectedDateTime < now;
    }
    
    return false;
  };

  // Funzione per verificare se un orario è disponibile per una data
  const isTimeAvailable = (date, time) => {
    if (!date || !time) return false;
    
    // Verifica che l'orario sia disponibile per il giorno della settimana
    const availableTimes = getTimeSlotsForDate(date);
    if (!availableTimes.includes(time)) {
      return false;
    }
    
    return !isDatePast(date) && !isTimePast(date, time);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Nasconde eventuali notifiche precedenti
    setNotification({ message: '', type: '', show: false });
    
    if (!selectedDate || !selectedTime) {
      setNotification({ message: t('bookings.selectDateAndTimeAlert'), type: 'error', show: true });
      return;
    }

    // Validazione aggiuntiva per date e orari passati
    if (isDatePast(selectedDate)) {
      setNotification({ message: t('bookings.pastDateAlert'), type: 'error', show: true });
      return;
    }

    // Validazione per giorni chiusi
    if (isDayClosed(selectedDate)) {
      setNotification({ message: t('bookings.closedDayAlert'), type: 'error', show: true });
      return;
    }

    // Validazione che l'orario sia disponibile per il giorno selezionato
    const availableTimes = getTimeSlotsForDate(selectedDate);
    if (!availableTimes.includes(selectedTime)) {
      setNotification({ message: t('bookings.unavailableTimeAlert'), type: 'error', show: true });
      return;
    }

    if (isTimePast(selectedDate, selectedTime)) {
      setNotification({ message: t('bookings.pastTimeAlert'), type: 'error', show: true });
      return;
    }

    if (connectionStatus !== 'connected') {
      setNotification({ message: t('bookings.noConnectionAlert'), type: 'error', show: true });
      return;
    }

    try {
      const dateStr = format(selectedDate, 'dd-MM-yyyy');
      
      // Pulisce il numero di telefono prima dell'invio
      const cleanedPhone = cleanPhoneNumber(formData.phone, selectedCountry.phone);
      
      const bookingData = {
        date: dateStr,
        time: selectedTime,
        ...formData,
        phone: `${selectedCountry.phone} ${cleanedPhone}`
      };

      await createBooking(bookingData);
      
      // Reset del form
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedCountry({
        name: 'Italia',
        code: 'IT',
        phone: '+39',
        flag: '🇮🇹'
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        guests: 2,
        notes: ''
      });
      
      // Mostra notifica di successo
      setNotification({ message: t('bookings.bookingConfirmed'), type: 'success', show: true });
    } catch (error) {
      // Mostra messaggio di errore più specifico se disponibile
      const errorMessage = error.message || t('bookings.bookingErrorAlert');
      setNotification({ message: errorMessage, type: 'error', show: true });
      console.error(error);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Gestione speciale per il campo telefono
    if (name === 'phone') {
      // Permette solo numeri, spazi, +, -, (, ) e .
      const cleaned = value.replace(/[^\d\s+\-().]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleaned
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Funzione per nascondere le notifiche
  const hideNotification = useCallback(() => {
    setNotification({ message: '', type: '', show: false });
  }, []);

  // Nasconde automaticamente le notifiche di successo dopo 5 secondi
  useEffect(() => {
    if (notification.show && notification.type === 'success') {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show, notification.type, hideNotification]);

  // Genera le date per il mese corrente
  const monthDates = generateMonthDates();

  // Test di connessione al server
  const testServerConnection = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      console.log('🔧 DEBUG Server Health Check:', data);
      return data.status === 'OK';
    } catch (error) {
      console.error('❌ DEBUG Server Health Check Failed:', error);
      return false;
    }
  };

  // Renderizza il messaggio di stato connessione
  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case 'checking':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            {t('bookings.checkingConnection')}
          </div>
        );
      case 'connected':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            Server connesso e funzionante
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <WifiOff className="w-4 h-4" />
            {t('bookings.connectionError')}
            <button
              onClick={reconnect}
              className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
            >
              {t('bookings.retry')}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-section-alt relative overflow-hidden">
      
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
            {t('bookings.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-adagio-black mb-12 text-center max-w-2xl mx-auto"
          >
            {t('bookings.subtitle')}
          </motion.p>

          {/* Status connessione */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 flex flex-col items-center gap-4"
          >
            {renderConnectionStatus()}
            <button
              onClick={testServerConnection}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
            >
              Test Server
            </button>
          </motion.div>

          {/* Status e controlli */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeMonth('prev')}
                className="p-2 rounded-lg bg-adagio-cream hover:bg-adagio-green hover:text-adagio-cream transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-bold text-adagio-black capitalize">
                {monthName}
              </h3>
              
              <button
                onClick={() => changeMonth('next')}
                className="p-2 rounded-lg bg-adagio-cream hover:bg-adagio-green hover:text-adagio-cream transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-adagio-cream p-6 rounded-2xl shadow-xl border-2 border-adagio-black/20"
            >
              <h3 className="text-2xl font-bold text-adagio-black mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                {t('bookings.selectDateAndTime')}
              </h3>

              {/* Calendar */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-adagio-black mb-4">{t('bookings.calendar')}</h4>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {getWeekDays().map(day => (
                    <div key={day} className="text-center text-xs sm:text-sm font-medium text-adagio-black py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Spazi vuoti per allineare le date con i giorni della settimana */}
                  {Array.from({ length: monthDates[0]?.date.getDay() || 0 }, (_, index) => (
                    <div key={`empty-${index}`} className="p-1 sm:p-2"></div>
                  ))}
                  
                  {/* Date del mese */}
                  {monthDates.map((dayData, index) => {
                    const isSelected = selectedDate && 
                      dayData.date.toDateString() === selectedDate.toDateString();
                    const isPast = isDatePast(dayData.date);
                    const isClosed = dayData.isClosed;
                    const isAvailable = isDateAvailable(dayData.date);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => isAvailable && setSelectedDate(dayData.date)}
                        disabled={!dayData.isCurrentMonth || !isAvailable}
                        className={`calendar-day p-1 sm:p-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center min-h-[2rem] sm:min-h-[2.5rem] ${
                          !dayData.isCurrentMonth
                            ? 'text-gray-400 cursor-not-allowed'
                            : !isAvailable
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                            : isSelected 
                            ? 'bg-adagio-green text-adagio-cream shadow-lg scale-105'
                            : dayData.isToday
                            ? 'bg-adagio-black text-adagio-cream'
                            : 'bg-adagio-tile text-adagio-black hover:bg-adagio-green hover:text-adagio-cream'
                        }`}
                        title={isClosed ? t('bookings.closedDay') : isPast ? t('bookings.pastDateAlert') : t('bookings.available')}
                      >
                        {dayData.dayNumber}
                        {isClosed && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <h4 className="text-lg font-semibold text-adagio-black mb-4 flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    {t('bookings.selectTime')}
                  </h4>
                  
                  {/* Informazioni sugli orari disponibili per il giorno */}
                  <div className="mb-4 p-3 bg-adagio-tile rounded-lg border border-adagio-black/20">
                    <p className="text-sm text-adagio-black">
                      <strong>{t('bookings.availableTimes')} {format(selectedDate, 'EEEE', { locale: it })}:</strong>
                    </p>
                    {(() => {
                      const dayOfWeek = selectedDate.getDay();
                      if (dayOfWeek >= 1 && dayOfWeek <= 4) {
                        return <p className="text-sm text-adagio-black mt-1">{t('bookings.lunchOnly')}</p>;
                      } else {
                        return <p className="text-sm text-adagio-black mt-1">{t('bookings.lunchAndDinner')}</p>;
                      }
                    })()}
                  </div>
                  
                  {isDayClosed(selectedDate) ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-center font-medium">
                        {t('bookings.closedDay')} {format(selectedDate, 'EEEE', { locale: it })}. 
                        {t('bookings.selectAnotherDay')}
                      </p>
                    </div>
                  ) : getTimeSlotsForDate(selectedDate).length === 0 ? (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-700 text-center font-medium">
                        {t('bookings.noTimeAvailable')} {format(selectedDate, 'EEEE', { locale: it })}. 
                        {t('bookings.selectAnotherDay')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {getTimeSlotsForDate(selectedDate).map(time => {
                        const isSelected = selectedTime === time;
                        const isAvailable = isTimeAvailable(selectedDate, time);
                        
                        return (
                          <button
                            key={time}
                            onClick={() => isAvailable && setSelectedTime(time)}
                            disabled={!isAvailable || connectionStatus !== 'connected'}
                            className={`calendar-day p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? 'ring-4 ring-adagio-green scale-105'
                                : ''
                            } ${
                              !isAvailable || connectionStatus !== 'connected'
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:scale-105'
                            }`}
                          >
                            <div className={`w-full h-full rounded-lg p-2 ${
                              isAvailable ? 'bg-adagio-green' : 'bg-gray-400'
                            } text-adagio-cream flex flex-col items-center justify-center min-h-[3rem] sm:min-h-[4rem]`}>
                              <span className="font-bold text-xs sm:text-sm">{time}</span>
                              <span className="text-xs opacity-90 mt-1">
                                {isAvailable ? t('bookings.available') : t('bookings.past')}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-adagio-cream p-6 rounded-2xl shadow-xl border-2 border-adagio-black/20"
            >
              <h3 className="text-2xl font-bold text-adagio-black mb-6 flex items-center gap-3">
                <User className="w-6 h-6" />
                {t('bookings.yourData')}
              </h3>

              {/* Notifica di stato */}
              {notification.show && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg flex items-center justify-between gap-3 ${
                    notification.type === 'success' 
                      ? 'bg-green-500/20 text-green-700 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-700 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {notification.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{notification.message}</span>
                  </div>
                  <button
                    onClick={hideNotification}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-adagio-black mb-2">
                    {t('bookings.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border-2 border-adagio-black/20 rounded-lg focus:border-adagio-green focus:outline-none transition-colors"
                    placeholder={t('bookings.namePlaceholder')}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-adagio-black mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      {t('bookings.phone')} *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="w-full sm:w-20 flex-shrink-0">
                        <CountrySelector
                          selectedCountry={selectedCountry}
                          onCountrySelect={handleCountrySelect}
                        />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full sm:flex-1 min-w-0 p-3 border-2 border-adagio-black/20 rounded-lg focus:border-adagio-green focus:outline-none transition-colors"
                        placeholder={t('bookings.phonePlaceholder')}
                        pattern="[0-9\\s+\\-()\\.]+"
                        title="Inserisci un numero di telefono valido"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-adagio-black mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      {t('bookings.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-adagio-black/20 rounded-lg focus:border-adagio-green focus:outline-none transition-colors"
                      placeholder={t('bookings.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-adagio-black mb-2">
                    {t('bookings.guests')} *
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-adagio-black/20 rounded-lg focus:border-adagio-green focus:outline-none transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? t('bookings.person') : t('bookings.people')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-adagio-black mb-2">
                    {t('bookings.notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border-2 border-adagio-black/20 rounded-lg focus:border-adagio-green focus:outline-none transition-colors resize-none"
                    placeholder={t('bookings.notesPlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedDate || !selectedTime || !formData.name || !formData.phone || loading || connectionStatus !== 'connected' || (selectedDate && isDayClosed(selectedDate)) || (selectedDate && selectedTime && !getTimeSlotsForDate(selectedDate).includes(selectedTime)) || (selectedDate && getTimeSlotsForDate(selectedDate).length === 0)}
                  className="w-full bg-adagio-green hover:bg-adagio-green-dark disabled:bg-gray-400 text-adagio-cream font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none"
                >
                  {loading ? t('bookings.sending') : t('bookings.confirmBooking')}
                </button>
              </form>


            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prenotazioni;
