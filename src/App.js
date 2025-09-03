import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './translations';
import Header from './components/Header';
import Home from './components/Home';
import Gallery from './components/Gallery';
import ChiSiamo from './components/ChiSiamo';
import Prenotazioni from './components/Prenotazioni';
import Recensioni from './components/Recensioni';
import Footer from './components/Footer';
// import Serranda from './components/Serranda';


function App() {
  const [currentSection, setCurrentSection] = useState('home');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(sectionId);
    }
  };



  useEffect(() => {
    const handleScroll = () => {
               const sections = ['home', 'gallery', 'chi-siamo', 'prenotazioni', 'recensioni'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen">
        {/* Contenuto del sito - sempre visibile ma coperto dalla serranda */}
        <Header currentSection={currentSection} onSectionChange={scrollToSection} />
        
        <main>
          <section id="home" className="min-h-screen">
            <Home />
          </section>
          
          <section id="gallery" className="min-h-screen">
            <Gallery />
          </section>
          
          <section id="chi-siamo" className="min-h-screen">
            <ChiSiamo />
          </section>
          
          <section id="prenotazioni" className="min-h-screen">
            <Prenotazioni />
          </section>
          
          <section id="recensioni" className="min-h-screen">
            <Recensioni />
          </section>
        </main>
        
        <Footer />
        
        {/* Serranda di apertura - si sovrappone al contenuto */}
        {/* <Serranda /> */}
      </div>
    </LanguageProvider>
  );
}

export default App;
