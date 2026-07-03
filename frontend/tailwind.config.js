/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        slideDown: "slideDown 0.3s ease-out",
        alertIn: "alertIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        alertIn: {
          "0%": { opacity: 0, transform: "scale(0.96) translateY(6px)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
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
