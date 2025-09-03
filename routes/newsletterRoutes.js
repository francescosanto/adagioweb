const express = require('express');
const newsletterController = require('../controllers/newsletterController');
const { validateNewsletter } = require('../middleware/validation');

const router = express.Router();

// POST /api/newsletter/subscribe - Aggiunge email alla newsletter (con validazione)
router.post('/subscribe', validateNewsletter, newsletterController.subscribeEmail);

// GET /api/newsletter/emails - Ottiene tutte le email della newsletter
router.get('/emails', newsletterController.getAllEmails);

// GET /api/newsletter/test-connection - Testa la connessione al foglio newsletter
router.get('/test-connection', newsletterController.testConnection);

// GET /api/newsletter/debug-env - Debug delle variabili d'ambiente
router.get('/debug-env', newsletterController.debugEnv);

module.exports = router;
