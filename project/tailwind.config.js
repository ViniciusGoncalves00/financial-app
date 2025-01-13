module.exports = {
  content: ['./src/**/*.{html,ts}'],
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

        neutral_0: "rgba(var(--neutral_0))",
        neutral_1: "rgba(var(--neutral_1))",
        neutral_2: "rgba(var(--neutral_2))",
        neutral_3: "rgba(var(--neutral_3))",
        neutral_4: "rgba(var(--neutral_4))",
        neutral_5: "rgba(var(--neutral_5))",
        neutral_6: "rgba(var(--neutral_6))",
        neutral_7: "rgba(var(--neutral_7))",
        neutral_8: "rgba(var(--neutral_8))",
        neutral_9: "rgba(var(--neutral_9))",
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
