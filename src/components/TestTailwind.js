import React from 'react';

const TestTailwind = () => {
  return (
    <div className="min-h-screen bg-section-alt relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 max-w-7xl mx-auto">
        {/* Container interno per il contenuto testuale */}
        <div className="w-full max-w-6xl mx-auto bg-transparent border-4 border-transparent p-12">
          <h1 className="text-4xl font-bold text-adagio-brick mb-8 font-heading">
            Test Tailwind CSS
          </h1>
          
          {/* Test Colori Personalizzati */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-adagio-brick mb-4">Colori Personalizzati</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="w-32 h-32 bg-adagio-green rounded-lg flex items-center justify-center text-adagio-cream font-bold text-center">
                <div>
                  <div>adagio-green</div>
                  <div className="text-sm">#7A9A7B</div>
                </div>
              </div>
              <div className="w-32 h-32 bg-adagio-green-light rounded-lg flex items-center justify-center text-adagio-cream font-bold text-center">
                <div>
                  <div>adagio-green-light</div>
                  <div className="text-sm">#9BBF9C</div>
                </div>
              </div>
              <div className="w-32 h-32 bg-adagio-green-dark rounded-lg flex items-center justify-center text-adagio-cream font-bold text-center">
                <div>
                  <div>adagio-green-dark</div>
                  <div className="text-sm">#5A7A5B</div>
                </div>
              </div>
              <div className="w-32 h-32 bg-adagio-black rounded-lg flex items-center justify-center text-adagio-cream font-bold text-center">
                <div>
                  <div>adagio-black</div>
                  <div className="text-sm">#000000</div>
                </div>
              </div>
              <div className="w-32 h-32 bg-adagio-green rounded-lg flex items-center justify-center text-adagio-cream font-bold text-center">
                <div>
                  <div>adagio-green</div>
                  <div className="text-sm">#9aa593</div>
                </div>
              </div>
              <div className="w-32 h-32 bg-adagio-tile rounded-lg flex items-center justify-center text-adagio-black font-bold text-center">
                <div>
                  <div>adagio-tile</div>
                  <div className="text-sm">#E6D7B8</div>
                </div>
              </div>
              <div className="w-32 h-32 bg-adagio-cream rounded-lg flex items-center justify-center text-adagio-black font-bold text-center border-2 border-adagio-black">
                <div>
                  <div>adagio-cream</div>
                  <div className="text-sm">#F5F5DC</div>
                </div>
              </div>
              <div className="w-32 h-32 bg-adagio-orange rounded-lg flex items-center justify-center text-adagio-cream font-bold text-center">
                <div>
                  <div>adagio-orange</div>
                  <div className="text-sm">#D2691E</div>
                </div>
              </div>
              <div className="w-32 h-32 bg-section-alt rounded-lg flex items-center justify-center text-adagio-cream font-bold text-center">
                <div>
                  <div>section-alt</div>
                  <div className="text-sm">#9aa593</div>
                </div>
              </div>
              <div className="w-32 h-32 bg-section-main rounded-lg flex items-center justify-center text-adagio-cream font-bold text-center">
                <div>
                  <div>section-main</div>
                  <div className="text-sm">#acb8a4</div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Font */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-adagio-black mb-4">Test Font</h2>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-adagio-black font-heading">
                Font Heading (Poppins)
              </h1>
              <p className="text-2xl text-adagio-black font-modern">
                Font Modern (Inter) - Questo è un testo di esempio per testare il font Inter
              </p>
              <p className="text-xl text-adagio-black">
                Font Default - Questo è il font di default del sistema
              </p>
            </div>
          </div>

          {/* Test Utility Classes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-adagio-black mb-4">Test Utility Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-adagio-tile p-6 rounded-lg border border-adagio-black/20">
                <h3 className="text-xl font-bold text-adagio-black mb-4">Spacing e Layout</h3>
                <div className="space-y-2">
                  <div className="bg-adagio-green text-adagio-cream p-2 rounded">Padding e Margini</div>
                  <div className="bg-adagio-black text-adagio-cream p-2 rounded">Bordi e Rounded</div>
                  <div className="bg-adagio-green-light text-adagio-cream p-2 rounded">Colori e Opacità</div>
                </div>
              </div>
              
              <div className="bg-adagio-tile p-6 rounded-lg border border-adagio-black/20">
                <h3 className="text-xl font-bold text-adagio-black mb-4">Responsive Design</h3>
                <div className="space-y-2">
                  <div className="bg-adagio-green text-adagio-cream p-2 rounded text-center md:text-left">
                    Testo Responsive
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="bg-adagio-black text-adagio-cream p-2 rounded text-center">1</div>
                    <div className="bg-adagio-black text-adagio-cream p-2 rounded text-center">2</div>
                    <div className="bg-adagio-black text-adagio-cream p-2 rounded text-center">3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-adagio-tile p-6 rounded-lg border border-adagio-black/20">
            <h3 className="text-xl font-bold text-adagio-black mb-4">Informazioni</h3>
            <ul className="text-adagio-black space-y-2">
              <li>• Se vedi i colori personalizzati, Tailwind è configurato correttamente</li>
              <li>• Se vedi i font personalizzati, Google Fonts è caricato correttamente</li>
              <li>• Se vedi le utility classes, Tailwind è funzionante</li>
              <li>• Controlla la console per eventuali errori</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTailwind;
