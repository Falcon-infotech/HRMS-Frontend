export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        dash: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100% 0' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideIn: {
          from: { transform: 'translateY(10px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        dash: 'dash 2.5s linear infinite',
      },
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        accent: {
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
        },
        success: {
          500: 'var(--success-500)',
          600: '#16a34a',
        },
        warning: {
          500: 'var(--warning-500)',
          600: '#d97706',
        },
        error: {
          500: 'var(--error-500)',
          600: '#dc2626',
        },
        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
        },
         primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)", // #4f46e5
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
