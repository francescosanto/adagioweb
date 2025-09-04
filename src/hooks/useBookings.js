import { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { api } from '../config/api';
import { config } from '../config/config';
import { useLanguage } from '../translations';

export const useBookings = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const { t, language } = useLanguage();

  // Funzione per verificare se un giorno è chiuso
  const isDayClosed = (date) => {
    const dayOfWeek = getDay(date); // 0 = Domenica, 1 = Lunedì, 2 = Martedì, ecc.
    return config.closedDays.includes(dayOfWeek);
  };

  // Funzione per ottenere il nome del mese tradotto
  const getMonthName = (date) => {
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const monthIndex = date.getMonth();
    const monthKey = monthNames[monthIndex];
    const year = date.getFullYear();
    return `${t(`calendar.months.${monthKey}`)} ${year}`;
  };

  // Funzione per ottenere i giorni della settimana tradotti
  const getWeekDays = () => {
    const days = {
      es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
    };
    return days[language] || days.es;
  };

  // Funzione per ottenere il nome del giorno tradotto
  const getDayName = (date) => {
    const dayNames = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ];
    const dayIndex = date.getDay();
    const dayKey = dayNames[dayIndex];
    return t(`calendar.weekdays.${dayKey}`);
  };

  // Testa la connessione a Google Sheets tramite API
  const testGoogleSheetsConnection = useCallback(async () => {
    try {
      const result = await api.testConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setConnectionStatus('error');
      setError('Errore nella connessione al server');
    }
  }, []);

  // Sincronizza le prenotazioni tramite API
  const syncBookings = useCallback(async () => {
    if (connectionStatus !== 'connected') return;
    
    try {
      setLoading(true);
      const allBookings = await api.readBookings();
      setBookings(allBookings);
      setError(null);
    } catch (err) {
      setError('Errore nella sincronizzazione delle prenotazioni');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [connectionStatus]);

  // Aggiorna la disponibilità per il mese corrente tramite API
  const updateAvailability = useCallback(async (month) => {
    if (connectionStatus !== 'connected') return;
    
    try {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      const newAvailability = {};
      
      for (const day of days) {
        const dateStr = format(day, 'dd/MM/yyyy');
        const dayAvailability = await api.getAvailability(dateStr);
        newAvailability[dateStr] = dayAvailability;
      }
      
      setAvailability(newAvailability);
    } catch (err) {
      console.error('Errore nell\'aggiornamento disponibilità:', err);
    }
  }, [connectionStatus]);

  // Inizializza e testa la connessione
  useEffect(() => {
    testGoogleSheetsConnection();
  }, [testGoogleSheetsConnection]);

  // Sincronizza quando la connessione è stabilita
  useEffect(() => {
    if (connectionStatus === 'connected') {
      syncBookings();
      updateAvailability(currentMonth);
    }
  }, [connectionStatus, syncBookings, updateAvailability, currentMonth]);

  // Sincronizza ogni X minuti (configurabile)
  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    
    const interval = setInterval(syncBookings, config.syncInterval);
    return () => clearInterval(interval);
  }, [connectionStatus, syncBookings]);

  // Funzione per aggiungere una prenotazione tramite API
  const createBooking = async (bookingData) => {
    if (connectionStatus !== 'connected') {
      throw new Error('Nessuna connessione al server');
    }
    
    try {
      setLoading(true);
      await api.addBooking(bookingData);
      
      // Ricarica le prenotazioni e la disponibilità
      await syncBookings();
      await updateAvailability(currentMonth);
      
      return { success: true };
    } catch (err) {
      setError('Errore nella creazione della prenotazione');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funzione per cambiare mese
  const changeMonth = (direction) => {
    if (direction === 'next') {
      setCurrentMonth(addMonths(currentMonth, 1));
    } else {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  // Genera le date per il mese corrente
  const generateMonthDates = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return days.map(day => ({
      date: day,
      dateStr: format(day, 'dd/MM/yyyy'),
      isCurrentMonth: isSameMonth(day, currentMonth),
      isToday: isSameDay(day, new Date()),
      dayName: getDayName(day),
      dayNumber: day.getDate(),
      isClosed: isDayClosed(day)
    }));
  };

  // Forza la riconnessione
  const reconnect = async () => {
    setConnectionStatus('checking');
    setError(null);
    await testGoogleSheetsConnection();
  };

  return {
    currentMonth,
    bookings,
    availability,
    loading,
    error,
    connectionStatus,
    syncBookings,
    createBooking,
    changeMonth,
    generateMonthDates,
    reconnect,
    monthName: getMonthName(currentMonth),
    getWeekDays,
    isDayClosed
  };
};
