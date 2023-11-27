/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#f1f1f1",
        darker: "#3c3c3c",
        lightBlack: "#202020",
        bloodRed: "#d30000",
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
