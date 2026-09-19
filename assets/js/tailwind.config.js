/* Configuração do design system — Fabiano Barbosa Advocacia */
tailwind.config = {
  theme: {
    screens: {
      xs: '440px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        silver: {
          100: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
        },
      },
      animation: {
        'ping-slow': 'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
};
