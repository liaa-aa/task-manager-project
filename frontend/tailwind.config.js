/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B1D51",   // Navy Gelap
        secondary: "#725CAD", // Ungu Muted
        accent: "#8CCDEB",    // Biru Muda
        base: "#FFE3A9",      // Krem
      },
    },
  },
  plugins: [],
};
