/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VEH Teaching Hub Exact Theme Tokens
        veh: {
          gold: '#ffc600',          // V Gold
          goldDark: '#8c6500',      // Gold Dark
          goldSoft: '#fff1ad',      // Gold Soft
          ink: '#2b2b2b',           // Ink charcoal
          inkDark: '#1f241f',       // Sidebar deep obsidian
          paper: '#f4f5f0',         // Cream paper background
          paperLight: '#fffdf8',    // White paper cards
          paper2: '#eeeadf',        // Table head paper
          line: '#dedfd9',          // Clean border line
          lineStrong: '#c8c9c3',
          muted: '#6f7169',         // Muted gray
          // Skill system from VEH Teaching Hub
          speaking: '#d7a400',
          listening: '#4d89aa',
          reading: '#4f9474',
          writing: '#725c86',
        },
        // Gamified button colors (Kahoot / Duolingo)
        game: {
          red: '#e21b3c',
          blue: '#1368ce',
          yellow: '#ffa602',
          green: '#26890c',
          purple: '#46178f',
          duoGreen: '#58cc02',
          duoGreenDark: '#46a302',
        }
      },
      boxShadow: {
        'veh-card': '0 7px 24px rgba(59, 48, 23, 0.08)',
        'veh-hover': '0 14px 28px rgba(43, 43, 43, 0.12)',
        'duo-yellow': '0 4px 0 #8c6500',
        'duo-green': '0 4px 0 #46a302',
        'duo-blue': '0 4px 0 #1899d6',
        'duo-dark': '0 4px 0 #1c2024',
      },
      fontFamily: {
        brand: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
