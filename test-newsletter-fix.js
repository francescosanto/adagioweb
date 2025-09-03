#!/usr/bin/env node

/**
 * Test per verificare che le correzioni della newsletter funzionino
 * Esegui questo script dopo aver configurato le variabili d'ambiente
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5001';

async function testNewsletter() {
  console.log('🧪 Test Newsletter - Verifica delle correzioni\n');

  try {
    // Test 1: Debug variabili d'ambiente
    console.log('1️⃣ Test variabili d\'ambiente...');
    const envResponse = await fetch(`${BASE_URL}/api/newsletter/debug-env`);
    const envData = await envResponse.json();
    
    if (envData.success) {
      console.log('✅ Variabili d\'ambiente:', envData.data);
    } else {
      console.log('❌ Errore variabili d\'ambiente:', envData.error);
    }

    // Test 2: Test connessione
    console.log('\n2️⃣ Test connessione Google Sheets...');
    const connResponse = await fetch(`${BASE_URL}/api/newsletter/test-connection`);
    const connData = await connResponse.json();
    
    if (connData.success) {
      console.log('✅ Connessione riuscita:', connData.message);
    } else {
      console.log('❌ Errore connessione:', connData.message);
    }

    // Test 3: Test iscrizione newsletter
    console.log('\n3️⃣ Test iscrizione newsletter...');
    const testEmail = `test-${Date.now()}@example.com`;
    const subscribeResponse = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        source: 'Test',
        language: 'it'
      }),
    });
    
    const subscribeData = await subscribeResponse.json();
    
    if (subscribeData.success) {
      console.log('✅ Iscrizione newsletter riuscita:', subscribeData.message);
    } else {
      console.log('❌ Errore iscrizione newsletter:', subscribeData.error);
      if (subscribeData.details) {
        console.log('   Dettagli validazione:', subscribeData.details);
      }
    }

    // Test 4: Test prenotazione con email
    console.log('\n4️⃣ Test prenotazione con email...');
    const bookingResponse = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: '25-12-2024',
        time: '20:00',
        name: 'Test User',
        phone: '+39 123 456 7890',
        email: `booking-test-${Date.now()}@example.com`,
        guests: 2,
        notes: 'Test prenotazione con newsletter'
      }),
    });
    
    const bookingData = await bookingResponse.json();
    
    if (bookingData.success) {
      console.log('✅ Prenotazione riuscita - controlla i log del server per l\'aggiunta automatica alla newsletter');
    } else {
      console.log('❌ Errore prenotazione:', bookingData.error);
      if (bookingData.details) {
        console.log('   Dettagli validazione:', bookingData.details);
      }
    }

    console.log('\n🎉 Test completati!');
    console.log('\n📋 Prossimi passi:');
    console.log('1. Verifica che le variabili d\'ambiente siano configurate correttamente');
    console.log('2. Controlla i log del server per eventuali errori');
    console.log('3. Testa l\'iscrizione newsletter dal frontend');
    console.log('4. Testa una prenotazione con email dal frontend');

  } catch (error) {
    console.error('❌ Errore durante i test:', error.message);
    console.log('\n💡 Assicurati che:');
    console.log('- Il server backend sia in esecuzione su porta 5001');
    console.log('- Le variabili d\'ambiente siano configurate');
    console.log('- Il file .env sia presente nella cartella backend');
  }
}

// Esegui i test
testNewsletter();
