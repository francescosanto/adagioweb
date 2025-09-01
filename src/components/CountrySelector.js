import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Globe } from 'lucide-react';

// Lista completa dei paesi con prefissi telefonici e bandiere (emoji)
const countries = [
  { name: 'Afghanistan', code: 'AF', phone: '+93', flag: '🇦🇫' },
  { name: 'Albania', code: 'AL', phone: '+355', flag: '🇦🇱' },
  { name: 'Algeria', code: 'DZ', phone: '+213', flag: '🇩🇿' },
  { name: 'Andorra', code: 'AD', phone: '+376', flag: '🇦🇩' },
  { name: 'Angola', code: 'AO', phone: '+244', flag: '🇦🇴' },
  { name: 'Antigua e Barbuda', code: 'AG', phone: '+1268', flag: '🇦🇬' },
  { name: 'Arabia Saudita', code: 'SA', phone: '+966', flag: '🇸🇦' },
  { name: 'Argentina', code: 'AR', phone: '+54', flag: '🇦🇷' },
  { name: 'Armenia', code: 'AM', phone: '+374', flag: '🇦🇲' },
  { name: 'Australia', code: 'AU', phone: '+61', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', phone: '+43', flag: '🇦🇹' },
  { name: 'Azerbaigian', code: 'AZ', phone: '+994', flag: '🇦🇿' },
  { name: 'Bahamas', code: 'BS', phone: '+1242', flag: '🇧🇸' },
  { name: 'Bahrain', code: 'BH', phone: '+973', flag: '🇧🇭' },
  { name: 'Bangladesh', code: 'BD', phone: '+880', flag: '🇧🇩' },
  { name: 'Barbados', code: 'BB', phone: '+1246', flag: '🇧🇧' },
  { name: 'Belgio', code: 'BE', phone: '+32', flag: '🇧🇪' },
  { name: 'Belize', code: 'BZ', phone: '+501', flag: '🇧🇿' },
  { name: 'Benin', code: 'BJ', phone: '+229', flag: '🇧🇯' },
  { name: 'Bhutan', code: 'BT', phone: '+975', flag: '🇧🇹' },
  { name: 'Bielorussia', code: 'BY', phone: '+375', flag: '🇧🇾' },
  { name: 'Birmania', code: 'MM', phone: '+95', flag: '🇲🇲' },
  { name: 'Bolivia', code: 'BO', phone: '+591', flag: '🇧🇴' },
  { name: 'Bosnia ed Erzegovina', code: 'BA', phone: '+387', flag: '🇧🇦' },
  { name: 'Botswana', code: 'BW', phone: '+267', flag: '🇧🇼' },
  { name: 'Brasile', code: 'BR', phone: '+55', flag: '🇧🇷' },
  { name: 'Brunei', code: 'BN', phone: '+673', flag: '🇧🇳' },
  { name: 'Bulgaria', code: 'BG', phone: '+359', flag: '🇧🇬' },
  { name: 'Burkina Faso', code: 'BF', phone: '+226', flag: '🇧🇫' },
  { name: 'Burundi', code: 'BI', phone: '+257', flag: '🇧🇮' },
  { name: 'Cambogia', code: 'KH', phone: '+855', flag: '🇰🇭' },
  { name: 'Camerun', code: 'CM', phone: '+237', flag: '🇨🇲' },
  { name: 'Canada', code: 'CA', phone: '+1', flag: '🇨🇦' },
  { name: 'Capo Verde', code: 'CV', phone: '+238', flag: '🇨🇻' },
  { name: 'Ciad', code: 'TD', phone: '+235', flag: '🇹🇩' },
  { name: 'Cile', code: 'CL', phone: '+56', flag: '🇨🇱' },
  { name: 'Cina', code: 'CN', phone: '+86', flag: '🇨🇳' },
  { name: 'Cipro', code: 'CY', phone: '+357', flag: '🇨🇾' },
  { name: 'Colombia', code: 'CO', phone: '+57', flag: '🇨🇴' },
  { name: 'Comore', code: 'KM', phone: '+269', flag: '🇰🇲' },
  { name: 'Congo', code: 'CG', phone: '+242', flag: '🇨🇬' },
  { name: 'Costa d\'Avorio', code: 'CI', phone: '+225', flag: '🇨🇮' },
  { name: 'Costa Rica', code: 'CR', phone: '+506', flag: '🇨🇷' },
  { name: 'Croazia', code: 'HR', phone: '+385', flag: '🇭🇷' },
  { name: 'Cuba', code: 'CU', phone: '+53', flag: '🇨🇺' },
  { name: 'Danimarca', code: 'DK', phone: '+45', flag: '🇩🇰' },
  { name: 'Dominica', code: 'DM', phone: '+1767', flag: '🇩🇲' },
  { name: 'Ecuador', code: 'EC', phone: '+593', flag: '🇪🇨' },
  { name: 'Egitto', code: 'EG', phone: '+20', flag: '🇪🇬' },
  { name: 'El Salvador', code: 'SV', phone: '+503', flag: '🇸🇻' },
  { name: 'Emirati Arabi Uniti', code: 'AE', phone: '+971', flag: '🇦🇪' },
  { name: 'Eritrea', code: 'ER', phone: '+291', flag: '🇪🇷' },
  { name: 'Estonia', code: 'EE', phone: '+372', flag: '🇪🇪' },
  { name: 'Etiopia', code: 'ET', phone: '+251', flag: '🇪🇹' },
  { name: 'Fiji', code: 'FJ', phone: '+679', flag: '🇫🇯' },
  { name: 'Filippine', code: 'PH', phone: '+63', flag: '🇵🇭' },
  { name: 'Finlandia', code: 'FI', phone: '+358', flag: '🇫🇮' },
  { name: 'Francia', code: 'FR', phone: '+33', flag: '🇫🇷' },
  { name: 'Gabon', code: 'GA', phone: '+241', flag: '🇬🇦' },
  { name: 'Gambia', code: 'GM', phone: '+220', flag: '🇬🇲' },
  { name: 'Georgia', code: 'GE', phone: '+995', flag: '🇬🇪' },
  { name: 'Germania', code: 'DE', phone: '+49', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', phone: '+233', flag: '🇬🇭' },
  { name: 'Giamaica', code: 'JM', phone: '+1876', flag: '🇯🇲' },
  { name: 'Giappone', code: 'JP', phone: '+81', flag: '🇯🇵' },
  { name: 'Gibuti', code: 'DJ', phone: '+253', flag: '🇩🇯' },
  { name: 'Giordania', code: 'JO', phone: '+962', flag: '🇯🇴' },
  { name: 'Grecia', code: 'GR', phone: '+30', flag: '🇬🇷' },
  { name: 'Guatemala', code: 'GT', phone: '+502', flag: '🇬🇹' },
  { name: 'Guinea', code: 'GN', phone: '+224', flag: '🇬🇳' },
  { name: 'Guinea-Bissau', code: 'GW', phone: '+245', flag: '🇬🇼' },
  { name: 'Guinea Equatoriale', code: 'GQ', phone: '+240', flag: '🇬🇶' },
  { name: 'Guyana', code: 'GY', phone: '+592', flag: '🇬🇾' },
  { name: 'Haiti', code: 'HT', phone: '+509', flag: '🇭🇹' },
  { name: 'Honduras', code: 'HN', phone: '+504', flag: '🇭🇳' },
  { name: 'India', code: 'IN', phone: '+91', flag: '🇮🇳' },
  { name: 'Indonesia', code: 'ID', phone: '+62', flag: '🇮🇩' },
  { name: 'Iran', code: 'IR', phone: '+98', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', phone: '+964', flag: '🇮🇶' },
  { name: 'Irlanda', code: 'IE', phone: '+353', flag: '🇮🇪' },
  { name: 'Islanda', code: 'IS', phone: '+354', flag: '🇮🇸' },
  { name: 'Israele', code: 'IL', phone: '+972', flag: '🇮🇱' },
  { name: 'Italia', code: 'IT', phone: '+39', flag: '🇮🇹' },
  { name: 'Kazakistan', code: 'KZ', phone: '+7', flag: '🇰🇿' },
  { name: 'Kenya', code: 'KE', phone: '+254', flag: '🇰🇪' },
  { name: 'Kirghizistan', code: 'KG', phone: '+996', flag: '🇰🇬' },
  { name: 'Kiribati', code: 'KI', phone: '+686', flag: '🇰🇮' },
  { name: 'Kuwait', code: 'KW', phone: '+965', flag: '🇰🇼' },
  { name: 'Laos', code: 'LA', phone: '+856', flag: '🇱🇦' },
  { name: 'Lesotho', code: 'LS', phone: '+266', flag: '🇱🇸' },
  { name: 'Lettonia', code: 'LV', phone: '+371', flag: '🇱🇻' },
  { name: 'Libano', code: 'LB', phone: '+961', flag: '🇱🇧' },
  { name: 'Liberia', code: 'LR', phone: '+231', flag: '🇱🇷' },
  { name: 'Libia', code: 'LY', phone: '+218', flag: '🇱🇾' },
  { name: 'Liechtenstein', code: 'LI', phone: '+423', flag: '🇱🇮' },
  { name: 'Lituania', code: 'LT', phone: '+370', flag: '🇱🇹' },
  { name: 'Lussemburgo', code: 'LU', phone: '+352', flag: '🇱🇺' },
  { name: 'Macedonia del Nord', code: 'MK', phone: '+389', flag: '🇲🇰' },
  { name: 'Madagascar', code: 'MG', phone: '+261', flag: '🇲🇬' },
  { name: 'Malawi', code: 'MW', phone: '+265', flag: '🇲🇼' },
  { name: 'Malaysia', code: 'MY', phone: '+60', flag: '🇲🇾' },
  { name: 'Maldive', code: 'MV', phone: '+960', flag: '🇲🇻' },
  { name: 'Mali', code: 'ML', phone: '+223', flag: '🇲🇱' },
  { name: 'Malta', code: 'MT', phone: '+356', flag: '🇲🇹' },
  { name: 'Marocco', code: 'MA', phone: '+212', flag: '🇲🇦' },
  { name: 'Mauritania', code: 'MR', phone: '+222', flag: '🇲🇷' },
  { name: 'Mauritius', code: 'MU', phone: '+230', flag: '🇲🇺' },
  { name: 'Messico', code: 'MX', phone: '+52', flag: '🇲🇽' },
  { name: 'Moldavia', code: 'MD', phone: '+373', flag: '🇲🇩' },
  { name: 'Monaco', code: 'MC', phone: '+377', flag: '🇲🇨' },
  { name: 'Mongolia', code: 'MN', phone: '+976', flag: '🇲🇳' },
  { name: 'Montenegro', code: 'ME', phone: '+382', flag: '🇲🇪' },
  { name: 'Mozambico', code: 'MZ', phone: '+258', flag: '🇲🇿' },
  { name: 'Namibia', code: 'NA', phone: '+264', flag: '🇳🇦' },
  { name: 'Nepal', code: 'NP', phone: '+977', flag: '🇳🇵' },
  { name: 'Nicaragua', code: 'NI', phone: '+505', flag: '🇳🇮' },
  { name: 'Niger', code: 'NE', phone: '+227', flag: '🇳🇪' },
  { name: 'Nigeria', code: 'NG', phone: '+234', flag: '🇳🇬' },
  { name: 'Norvegia', code: 'NO', phone: '+47', flag: '🇳🇴' },
  { name: 'Nuova Zelanda', code: 'NZ', phone: '+64', flag: '🇳🇿' },
  { name: 'Oman', code: 'OM', phone: '+968', flag: '🇴🇲' },
  { name: 'Paesi Bassi', code: 'NL', phone: '+31', flag: '🇳🇱' },
  { name: 'Pakistan', code: 'PK', phone: '+92', flag: '🇵🇰' },
  { name: 'Panama', code: 'PA', phone: '+507', flag: '🇵🇦' },
  { name: 'Papua Nuova Guinea', code: 'PG', phone: '+675', flag: '🇵🇬' },
  { name: 'Paraguay', code: 'PY', phone: '+595', flag: '🇵🇾' },
  { name: 'Perù', code: 'PE', phone: '+51', flag: '🇵🇪' },
  { name: 'Polonia', code: 'PL', phone: '+48', flag: '🇵🇱' },
  { name: 'Portogallo', code: 'PT', phone: '+351', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QA', phone: '+974', flag: '🇶🇦' },
  { name: 'Regno Unito', code: 'GB', phone: '+44', flag: '🇬🇧' },
  { name: 'Repubblica Ceca', code: 'CZ', phone: '+420', flag: '🇨🇿' },
  { name: 'Repubblica Centrafricana', code: 'CF', phone: '+236', flag: '🇨🇫' },
  { name: 'Repubblica del Congo', code: 'CD', phone: '+243', flag: '🇨🇩' },
  { name: 'Repubblica Dominicana', code: 'DO', phone: '+1809', flag: '🇩🇴' },
  { name: 'Romania', code: 'RO', phone: '+40', flag: '🇷🇴' },
  { name: 'Ruanda', code: 'RW', phone: '+250', flag: '🇷🇼' },
  { name: 'Russia', code: 'RU', phone: '+7', flag: '🇷🇺' },
  { name: 'Saint Kitts e Nevis', code: 'KN', phone: '+1869', flag: '🇰🇳' },
  { name: 'Saint Lucia', code: 'LC', phone: '+1758', flag: '🇱🇨' },
  { name: 'Saint Vincent e Grenadine', code: 'VC', phone: '+1784', flag: '🇻🇨' },
  { name: 'Samoa', code: 'WS', phone: '+685', flag: '🇼🇸' },
  { name: 'Senegal', code: 'SN', phone: '+221', flag: '🇸🇳' },
  { name: 'Serbia', code: 'RS', phone: '+381', flag: '🇷🇸' },
  { name: 'Seychelles', code: 'SC', phone: '+248', flag: '🇸🇨' },
  { name: 'Sierra Leone', code: 'SL', phone: '+232', flag: '🇸🇱' },
  { name: 'Singapore', code: 'SG', phone: '+65', flag: '🇸🇬' },
  { name: 'Siria', code: 'SY', phone: '+963', flag: '🇸🇾' },
  { name: 'Slovacchia', code: 'SK', phone: '+421', flag: '🇸🇰' },
  { name: 'Slovenia', code: 'SI', phone: '+386', flag: '🇸🇮' },
  { name: 'Somalia', code: 'SO', phone: '+252', flag: '🇸🇴' },
  { name: 'Spagna', code: 'ES', phone: '+34', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: 'LK', phone: '+94', flag: '🇱🇰' },
  { name: 'Stati Uniti', code: 'US', phone: '+1', flag: '🇺🇸' },
  { name: 'Sudafrica', code: 'ZA', phone: '+27', flag: '🇿🇦' },
  { name: 'Sudan', code: 'SD', phone: '+249', flag: '🇸🇩' },
  { name: 'Suriname', code: 'SR', phone: '+597', flag: '🇸🇷' },
  { name: 'Svezia', code: 'SE', phone: '+46', flag: '🇸🇪' },
  { name: 'Svizzera', code: 'CH', phone: '+41', flag: '🇨🇭' },
  { name: 'Tagikistan', code: 'TJ', phone: '+992', flag: '🇹🇯' },
  { name: 'Tanzania', code: 'TZ', phone: '+255', flag: '🇹🇿' },
  { name: 'Thailandia', code: 'TH', phone: '+66', flag: '🇹🇭' },
  { name: 'Timor Est', code: 'TL', phone: '+670', flag: '🇹🇱' },
  { name: 'Togo', code: 'TG', phone: '+228', flag: '🇹🇬' },
  { name: 'Tonga', code: 'TO', phone: '+676', flag: '🇹🇴' },
  { name: 'Trinidad e Tobago', code: 'TT', phone: '+1868', flag: '🇹🇹' },
  { name: 'Tunisia', code: 'TN', phone: '+216', flag: '🇹🇳' },
  { name: 'Turchia', code: 'TR', phone: '+90', flag: '🇹🇷' },
  { name: 'Turkmenistan', code: 'TM', phone: '+993', flag: '🇹🇲' },
  { name: 'Ucraina', code: 'UA', phone: '+380', flag: '🇺🇦' },
  { name: 'Uganda', code: 'UG', phone: '+256', flag: '🇺🇬' },
  { name: 'Ungheria', code: 'HU', phone: '+36', flag: '🇭🇺' },
  { name: 'Uruguay', code: 'UY', phone: '+598', flag: '🇺🇾' },
  { name: 'Uzbekistan', code: 'UZ', phone: '+998', flag: '🇺🇿' },
  { name: 'Vanuatu', code: 'VU', phone: '+678', flag: '🇻🇺' },
  { name: 'Venezuela', code: 'VE', phone: '+58', flag: '🇻🇪' },
  { name: 'Vietnam', code: 'VN', phone: '+84', flag: '🇻🇳' },
  { name: 'Yemen', code: 'YE', phone: '+967', flag: '🇾🇪' },
  { name: 'Zambia', code: 'ZM', phone: '+260', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: 'ZW', phone: '+263', flag: '🇿🇼' }
];

const CountrySelector = ({ selectedCountry, onCountrySelect, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const dropdownRef = useRef(null);

  // Filtra i paesi in base al termine di ricerca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.phone.includes(searchTerm)
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm]);

  // Chiude il dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    onCountrySelect(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedCountryData = selectedCountry || countries.find(c => c.code === 'ES'); // Default Spagna

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 border-2 border-adagio-black/20 rounded-lg focus:border-adagio-green focus:outline-none transition-colors bg-white hover:border-adagio-green"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedCountryData.flag}</span>
          <span className="text-sm font-medium text-adagio-black">
            {selectedCountryData.phone}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-adagio-black transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white border-2 border-adagio-black/20 rounded-lg shadow-xl max-h-80 overflow-hidden min-w-[280px] w-max">
          {/* Barra di ricerca */}
          <div className="p-3 border-b border-adagio-black/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca paese, codice o prefisso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-adagio-black/20 rounded-lg focus:border-adagio-green focus:outline-none text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Lista paesi */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Nessun paese trovato
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-adagio-green hover:text-adagio-cream transition-colors text-left"
                >
                  <span className="text-xl">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{country.name}</div>
                    <div className="text-xs opacity-75">{country.code}</div>
                  </div>
                  <span className="font-mono text-sm">{country.phone}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;

