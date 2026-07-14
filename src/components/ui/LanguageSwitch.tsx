'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[36px] ${
          language === 'en'
            ? 'bg-white text-red shadow-sm'
            : 'text-white/80 hover:text-white'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ta')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[36px] ${
          language === 'ta'
            ? 'bg-white text-primary shadow-sm'
            : 'text-white/80 hover:text-white'
        }`}
        aria-label="தமிழுக்கு மாற்றவும்"
      >
        த
      </button>
    </div>
  );
}

export function LanguageSwitchLight() {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.div 
      className="flex items-center gap-1 bg-gray-100 rounded-full p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[36px] ${
          language === 'en'
            ? 'bg-blue-900 text-white shadow-sm'
            : 'text-gray-600 hover:text-primary'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ta')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[36px] ${
          language === 'ta'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-600 hover:text-primary'
        }`}
        aria-label="தமிழுக்கு மாற்றவும்"
      >
        த
      </button>
    </motion.div>
  );
}
