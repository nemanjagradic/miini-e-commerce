/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        slideDown: "slideDown 0.3s ease-out",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-20px) translateX(-50%)", opacity: 0 },
          "100%": { transform: "translateY(0) translateX(-50%)", opacity: 1 },
        },
      },
      colors: {
        light: "#f1f1f1",
        darker: "#3c3c3c",
        lightBlack: "#363636",
        bloodRed: "#d30000",
        borderColor: "#e5e7eb",
      },
      boxShadow: {
        small: "0 5px 10px #f1f1f1",
      },
      fontFamily: {
        Heebo: ["Heebo", "sans-serif"],
      },
      gridTemplateRows: {
        200: "repeat(2, minmax(0, 200px))",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
