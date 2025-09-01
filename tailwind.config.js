/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adagio-green': '#9aa593',
        'adagio-green-light': '#acb8a4',
        'adagio-green-dark': '#7a8a73',
        'adagio-black': '#000000',
        'adagio-tile': '#E6D7B8',
        'adagio-cream': '#F5F5DC',
        'adagio-orange': '#D2691E',
        'adagio-red': '#B22222',
        'section-alt': '#9aa593',
        'section-main': '#acb8a4',
      },
      fontFamily: {
        'modern': ['Inter', 'sans-serif'],
        'heading': ['Poppins', 'sans-serif'],
        'elegant': ['Playfair Display', 'Georgia', 'serif'],
        'classic': ['Crimson Text', 'Times New Roman', 'serif'],
      },
      backgroundImage: {
        'brick-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%238B4513\" fill-opacity=\"0.1\"%3E%3Crect width=\"60\" height=\"60\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'tile-fall': 'tileFall 1s ease-out forwards',
        'tile-bounce': 'tileBounce 0.6s ease-out',
      },
      keyframes: {
        tileFall: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        tileBounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-30px,0)' },
          '70%': { transform: 'translate3d(0,-15px,0)' },
          '90%': { transform: 'translate3d(0,-4px,0)' },
        }
      }
    },
  },
  plugins: [],
}
