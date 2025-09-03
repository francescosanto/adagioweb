const { body, validationResult } = require('express-validator');

// Middleware per gestire i risultati della validazione
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Dati non validi',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Validazioni per le prenotazioni
const validateBooking = [
  body('date')
    .notEmpty()
    .withMessage('La data è obbligatoria')
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage('Formato data non valido (DD-MM-YYYY)'),
  
  body('time')
    .notEmpty()
    .withMessage('L\'orario è obbligatorio')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('Formato orario non valido (HH:MM)'),
  
  body('name')
    .notEmpty()
    .withMessage('Il nome è obbligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('Il nome deve essere tra 2 e 50 caratteri')
    .trim()
    .escape(),
  
  body('phone')
    .notEmpty()
    .withMessage('Il telefono è obbligatorio')
    .isLength({ min: 7, max: 25 })
    .withMessage('Il telefono deve essere tra 7 e 25 caratteri')
    .matches(/^[\+]?[0-9\s\-\(\)\.\/]+$/)
    .withMessage('Formato telefono non valido'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Formato email non valido')
    .normalizeEmail(),
  
  body('guests')
    .notEmpty()
    .withMessage('Il numero di ospiti è obbligatorio')
    .isInt({ min: 1, max: 20 })
    .withMessage('Il numero di ospiti deve essere tra 1 e 20'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Le note non possono superare i 500 caratteri')
    .trim()
    .escape(),
  
  handleValidationErrors
];

// Validazioni per la newsletter
const validateNewsletter = [
  body('email')
    .notEmpty()
    .withMessage('L\'email è obbligatoria')
    .isEmail()
    .withMessage('Formato email non valido')
    .normalizeEmail(),
  
  body('source')
    .optional()
    .isLength({ max: 50 })
    .withMessage('La fonte non può superare i 50 caratteri')
    .trim()
    .escape(),
  
  body('language')
    .optional()
    .isLength({ max: 10 })
    .withMessage('La lingua non può superare i 10 caratteri')
    .trim()
    .escape(),
  
  handleValidationErrors
];

module.exports = {
  validateBooking,
  validateNewsletter,
  handleValidationErrors
};
