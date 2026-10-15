export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      keyframes: {
        toastIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        toastProgress: {
          "0%": {
            transform: "scaleX(0)",
          },
          "100%": {
            transform: "scaleX(1)",
          },
        },
      },

      animation: {
        toastIn: "toastIn 0.35s ease-out",
        toastProgress: "toastProgress linear forwards",
      },
    },
  },
};
