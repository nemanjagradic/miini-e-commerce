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
        big: "10px 10px 15px #e3e2e2",
      },
      fontFamily: {
        Heebo: ["Heebo", "sans-serif"],
      },
      fontSize: {
        xl: "19px",
      },
      gridTemplateRows: {
        200: "repeat(2, minmax(0, 200px))",
      },
      transitionDuration: {
        400: "400ms",
      },
      screens: {
        "lg-2": "910px",
      },
    },
  },
  plugins: [],
};
