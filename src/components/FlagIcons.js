import React, { useState } from 'react';

// Componente per la bandiera spagnola (versione semplificata)
export const SpanishFlag = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    <rect width="24" height="16" fill="#c60b1e"/>
    <rect width="24" height="8" y="4" fill="#ffc400"/>
  </svg>
);

// Componente per la bandiera inglese (versione corretta)
export const EnglishFlag = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    {/* Sfondo blu scuro */}
    <rect width="24" height="16" fill="#012169"/>
    
    {/* Croci diagonali bianche (primo livello) */}
    <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="2"/>
    
    {/* Croci diagonali rosse (secondo livello) */}
    <path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" strokeWidth="1"/>
    
    {/* Croce centrale bianca di San Giorgio (terzo livello) */}
    <rect x="10" y="0" width="4" height="16" fill="#fff"/>
    <rect x="0" y="6" width="24" height="4" fill="#fff"/>
    
    {/* Croce centrale rossa di San Giorgio (livello superiore) */}
    <rect x="11" y="0" width="2" height="16" fill="#c8102e"/>
    <rect x="0" y="7" width="24" height="2" fill="#c8102e"/>
  </svg>
);

// Componente per la bandiera italiana (versione semplificata)
export const ItalianFlag = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    <rect width="8" height="16" fill="#009246"/>
    <rect x="8" width="8" height="16" fill="#fff"/>
    <rect x="16" width="8" height="16" fill="#ce2b37"/>
  </svg>
);

// Versione alternativa con emoji (fallback)
export const SpanishFlagEmoji = ({ className = "w-4 h-4" }) => (
  <span className={className} style={{ fontSize: '1rem' }}>🇪🇸</span>
);

export const EnglishFlagEmoji = ({ className = "w-4 h-4" }) => (
  <span className={className} style={{ fontSize: '1rem' }}>🇬🇧</span>
);

export const ItalianFlagEmoji = ({ className = "w-4 h-4" }) => (
  <span className={className} style={{ fontSize: '1rem' }}>🇮🇹</span>
);

// Componente intelligente che prova prima SVG e poi emoji
export const SmartFlag = ({ country, className = "w-4 h-4" }) => {
  const [useEmoji, setUseEmoji] = useState(false);

  const handleSvgError = () => {
    setUseEmoji(true);
  };

  if (useEmoji) {
    switch (country) {
      case 'es': return <SpanishFlagEmoji className={className} />;
      case 'en': return <EnglishFlagEmoji className={className} />;
      case 'it': return <ItalianFlagEmoji className={className} />;
      default: return <SpanishFlagEmoji className={className} />;
    }
  }

  switch (country) {
    case 'es': return <SpanishFlag className={className} onError={handleSvgError} />;
    case 'en': return <EnglishFlag className={className} onError={handleSvgError} />;
    case 'it': return <ItalianFlag className={className} onError={handleSvgError} />;
    default: return <SpanishFlag className={className} onError={handleSvgError} />;
  }
};

// Componente per la bandiera spagnola (versione più dettagliata)
export const SpanishFlagDetailed = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 640 480" fill="none">
    <rect width="640" height="480" fill="#c60b1e"/>
    <rect width="640" height="240" fill="#ffc400"/>
    <rect width="640" height="120" y="180" fill="#c60b1e"/>
    {/* Scudo semplificato */}
    <rect x="280" y="200" width="80" height="60" fill="#ffc400"/>
    <rect x="300" y="210" width="40" height="40" fill="#c60b1e"/>
  </svg>
);

// Componente per la bandiera inglese (versione più dettagliata)
export const EnglishFlagDetailed = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    <rect width="24" height="16" fill="#012169"/>
    <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="1"/>
    <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="2"/>
  </svg>
);

// Componente per la bandiera italiana (versione più dettagliata)
export const ItalianFlagDetailed = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    <rect width="8" height="16" fill="#009246"/>
    <rect x="8" width="8" height="16" fill="#fff"/>
    <rect x="16" width="8" height="16" fill="#ce2b37"/>
  </svg>
);
