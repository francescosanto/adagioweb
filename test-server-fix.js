#!/usr/bin/env node

/**
 * Script di test per verificare che il server funzioni correttamente
 * Esegui: node test-server-fix.js
 */

const axios = require('axios');

// Configurazione
const BASE_URL = process.env.TEST_URL || 'http://localhost:5001';
const RENDER_URL = 'https://il-tuo-servizio.onrender.com'; // Sostituisci con il tuo URL Render

async function testEndpoint(url, description) {
  try {
    console.log(`\n🔍 Test: ${description}`);
    console.log(`📍 URL: ${url}`);
    
    const response = await axios.get(url, { timeout: 10000 });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response:`, JSON.stringify(response.data, null, 2));
    
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`❌ Errore: ${error.message}`);
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📊 Response:`, error.response.data);
    }
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Avvio test del server Adagio...\n');
  
  const tests = [
    {
      url: `${BASE_URL}/api/health`,
      description: 'Health Check'
    },
    {
      url: `${BASE_URL}/api/test-place-id`,
      description: 'Test Place ID'
    },
    {
      url: `${BASE_URL}/api/google-reviews`,
      description: 'Google Reviews'
    },
    {
      url: `${BASE_URL}/api/search-place-id?name=Adagio&location=Sevilla`,
      description: 'Search Place ID'
    },
    {
      url: `${BASE_URL}/api/test-connection`,
      description: 'Test Connection (Prenotazioni)'
    },
    {
      url: `${BASE_URL}/api/bookings`,
      description: 'Get Bookings'
    },
    {
      url: `${BASE_URL}/api/bookings/stats`,
      description: 'Get Booking Stats'
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.url, test.description);
    results.push({ ...test, result });
    
    // Pausa tra i test
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Riepilogo
  console.log('\n📊 RIEPILOGO TEST:');
  console.log('==================');
  
  const successful = results.filter(r => r.result.success).length;
  const failed = results.filter(r => !r.result.success).length;
  
  console.log(`✅ Test riusciti: ${successful}`);
  console.log(`❌ Test falliti: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ TEST FALLITI:');
    results.filter(r => !r.result.success).forEach(test => {
      console.log(`- ${test.description}: ${test.result.error}`);
    });
  }
  
  if (successful === results.length) {
    console.log('\n🎉 TUTTI I TEST SONO RIUSCITI! Il server funziona correttamente.');
  } else {
    console.log('\n⚠️ Alcuni test sono falliti. Controlla la configurazione.');
  }
  
  // Test su Render (se specificato)
  if (process.env.TEST_RENDER === 'true') {
    console.log('\n🌐 Test su Render...');
    const renderTests = [
      {
        url: `${RENDER_URL}/api/health`,
        description: 'Render Health Check'
      },
      {
        url: `${RENDER_URL}/api/google-reviews`,
        description: 'Render Google Reviews'
      }
    ];
    
    for (const test of renderTests) {
      await testEndpoint(test.url, test.description);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Esegui i test
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };
