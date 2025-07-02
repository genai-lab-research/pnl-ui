/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Roboto"],
        body: ["Inter"],
      },
      colors: {
        primary: "#3545EE",
        success: "#489F68",
        warning: "#F97316",
        error: "#FF0000",
        gray: {
          100: "#F3F4F6",
          200: "#E5E7EB",
          500: "#6B7280",
          900: "#111827",
        },
        background: "#F7F9FD",
      },
    },
  },
  plugins: [],
};
