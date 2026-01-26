/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#021024',      // Azul Profundo (Sidebar)
          navy: '#052659',      // Azul Escuro
          medium: '#5483B3',    // Azul Médio
          light: '#7DA0CA',     // Azul Claro
          highlight: '#C1E8FF', // Azul Realce
          active: '#3b82f6'     // Azul Vibrante (Logo/Ativo)
        }
      }
    },
  },
  plugins: [],
}
