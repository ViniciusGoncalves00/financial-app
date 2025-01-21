/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,css,js,ts}"],
  theme:
  {
    extend:
    {
      fontFamily: {
        Montserrat: ["Montserrat"],
        RobotoCondensed: ["Roboto Condensed"],
      },
      dropShadow:
      {
        "soft-bot-right": "1px 1px 4px rgb(0 0 0 / 0.25)",
      },
      borderRadius:
      {
        primary: "8px"
      },
      colors:
      {
        primary: "rgba(var(--primary))",
        primary_highlight: "rgba(var(--primary_highlight))",
        secondary: "rgba(var(--secondary))",
    
        primary_text: "rgba(var(--primary_text))",
        primary_highlight_text:"rgba(var(--primary_highlight_text))",

        info: "rgba(var(--info))",
        success: "rgba(var(--success))",
        warning: "rgba(var(--warning))",
        error: "rgba(var(--error))",

        neutral_0: "rgba(255, 255, 255)",
        neutral_1: "rgba(250, 250, 250)",
        neutral_2: "rgba(245, 245, 245)",
        neutral_3: "rgba(240, 240, 240)",
        neutral_4: "rgba(235, 235, 235)",
        neutral_5: "rgba(10, 10, 10)",
        neutral_6: "rgba(15, 15, 15)",
        neutral_7: "rgba(20, 20, 20)",
        neutral_8: "rgba(25, 25, 25)",
        neutral_9: "rgba(30, 30, 30)",
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};