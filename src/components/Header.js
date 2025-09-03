import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../translations';
import LanguageSelector from './LanguageSelector';

const Header = ({ currentSection, onSectionChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('navigation.home') },
    { id: 'gallery', label: t('navigation.gallery') },
    { id: 'chi-siamo', label: t('navigation.about') },
    { id: 'prenotazioni', label: t('navigation.bookings') },
    { id: 'recensioni', label: t('navigation.reviews') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-adagio-green-light/95 backdrop-blur-sm border-b-2 border-adagio-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <img 
              src="/Logo/LOGO png.png" 
              alt="Logo Adagio" 
              className="h-16 w-auto object-contain"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentSection === item.id
                    ? 'text-adagio-cream bg-adagio-green-light shadow-lg'
                    : 'text-adagio-black hover:text-adagio-green hover:bg-adagio-tile'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Language Selector and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-adagio-black hover:text-adagio-green transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    currentSection === item.id
                      ? 'text-adagio-cream bg-adagio-green-light shadow-lg'
                      : 'text-adagio-black hover:text-adagio-green hover:bg-adagio-tile'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Language Selector for Mobile */}
              <div className="pt-4 border-t border-adagio-black/20">
                <div className="px-4">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;
