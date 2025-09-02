class AvailabilityService {
  // Verifica la disponibilità per una data specifica
  async getAvailability(date) {
    try {
      // Orari disponibili
      const timeSlots = [
        '13:30', '14:00', '14:30', '15:00', '15:30',
        '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
      ];

      const maxCapacity = parseInt(process.env.MAX_CAPACITY) || 50;
      const availability = {};

      // Per ora, rendi tutti gli slot sempre disponibili
      // In futuro qui si può implementare la logica per controllare le prenotazioni esistenti
      for (const time of timeSlots) {
        availability[time] = { 
          available: true, 
          capacity: maxCapacity, 
          reason: 'Libero - Sempre disponibile' 
        };
      }

      return availability;
    } catch (error) {
      console.error('Errore nel controllo disponibilità:', error);
      throw new Error('Impossibile verificare la disponibilità');
    }
  }

  // Controlla se un orario specifico è disponibile
  async checkTimeSlotAvailability(date, time) {
    try {
      const availability = await this.getAvailability(date);
      return availability[time] || { available: false, reason: 'Orario non valido' };
    } catch (error) {
      console.error('Errore nel controllo orario specifico:', error);
      throw new Error('Impossibile verificare la disponibilità dell\'orario');
    }
  }
}

module.exports = new AvailabilityService();
