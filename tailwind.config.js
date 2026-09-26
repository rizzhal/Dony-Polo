module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: '#0F2A24', river: '#1F6F63', sun: '#F2A900', mist: '#EEF3F1' },
    fontFamily: { display: ['var(--font-display)', 'system-ui', 'sans-serif'], sans: ['var(--font-body)', 'system-ui', 'sans-serif'] },
  } },
  plugins: [],
};
