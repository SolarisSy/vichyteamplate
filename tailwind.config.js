/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondaryBrown: "#0dcaf0",
        primaryWhite: "#FFFFFF",
      },
    },
  },
  plugins: ["@tailwindcss/forms"],
};
