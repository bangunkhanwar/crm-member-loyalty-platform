export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'], // default Member
        inter: ['"Inter"', 'sans-serif'],             // Admin
        hanken: ['"Hanken Grotesk"', 'sans-serif'],   // Admin - angka KPI
      },
      colors: {
        primary: { DEFAULT: '#006A64', dark: '#00504B', muted: '#8AF4EA' },
        secondary: '#2DA299',
        slate: { DEFAULT: '#545F73' },
        success: '#2DA299',
        danger: { DEFAULT: '#EF4444', dark: '#BA1A1A', bright: '#FF383C' },
        text: { black: '#191C1E', body: '#1E293B', muted: '#94A3B8', soft: '#64748B' },
        bg: { page: '#F7F9FB', alt: '#F8FAFC', field: '#F2F4F6' },
        border: { DEFAULT: '#E2E8F0', soft: 'rgba(188,201,199,0.3)' },
        // Admin-specific
        admin: {
          bg: '#F9F9FF',
          navy: '#111C2D',
          text: '#3D4947',
          indigo: '#E7EEFF',
          green: '#29CC6A',
          gold: '#FFCC00',
          teal: '#00C8B3',
          red: '#FF2D55',
        },
      },
      borderRadius: { card: '16px', 'card-lg': '24px' },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.04)',
        elevated: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        btn3d: '0px 4px 0px #00504B',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #006A64 0%, #2DA299 50%, #545F73 100%)',
        'page-gradient': 'linear-gradient(180deg, rgba(138,244,234,0.2) 0%, #F7F9FB 100%)',
      },
    },
  },
  plugins: [],
}