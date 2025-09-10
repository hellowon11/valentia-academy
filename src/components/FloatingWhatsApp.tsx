import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateWhatsAppUrl } from '../config/contact';

const FloatingWhatsApp: React.FC = () => {
  const { language, t } = useLanguage();

  const handleClick = () => {
    const url = generateWhatsAppUrl(language);
    window.open(url, '_blank');
  };

  return (
    <button
      aria-label={t('header.contactUs')}
      onClick={handleClick}
      className="md:hidden fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-[0_10px_20px_rgba(16,185,129,0.45)] border-2 border-white/90 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
    >
      {/* Refined WhatsApp glyph */}
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="currentColor" className="opacity-0" />
        <path fill="white" d="M26.6 5.4A13.3 13.3 0 0 0 4.8 22.7L4 28l5.4-.7A13.3 13.3 0 1 0 26.6 5.4zM16 25.9c-1.7 0-3.3-.4-4.7-1.2l-.3-.2-3 .4.4-2.9-.2-.3a9.9 9.9 0 1 1 8 4.2zm5-7.1c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.6-1.5-.9-2.1-.2-.6-.5-.5-.7-.5h-1c-.3 0-.7.1-1 .4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.5 3.7 6.1 5.2.9.4 1.6.6 2.1.7.9.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.6-.5z"/>
      </svg>
      <span className="sr-only">{t('header.contactUs')}</span>
    </button>
  );
};

export default FloatingWhatsApp;


