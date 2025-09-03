const express = require('express');
require('dotenv').config();

console.log('🔧 Test server minimo...');

const app = express();

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test server funzionante',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test server avviato sulla porta ${PORT}`);
  console.log(`🌐 Server disponibile su http://localhost:${PORT}`);
});

console.log('✅ Test server configurato');

// Mantieni il processo attivo
process.on('SIGINT', () => {
  console.log('\n🛑 Server fermato');
  process.exit(0);
});
