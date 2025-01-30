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

        neutral_0: "rgba(230, 230, 230)",
        neutral_1: "rgba(225, 225, 225)",
        neutral_2: "rgba(220, 220, 220)",
        neutral_3: "rgba(215, 215, 215)",
        neutral_4: "rgba(210, 210, 210)",
        neutral_5: "rgba(20, 20, 20)",
        neutral_6: "rgba(40, 40, 40)",
        neutral_7: "rgba(60, 60, 60)",
        neutral_8: "rgba(80, 80, 80)",
        neutral_9: "rgba(100, 100, 100)",

        color_1: "#E3E6E8",
        color_2: "#C7CCD1",
        color_3: "#ABB3BA",
        color_4: "#8F99A3",
        color_5: "#737F8C",
        color_6: "#5C6670",
        color_7: "#454C54",
        color_8: "#2E3338",
        color_9: "#17191C",

      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};