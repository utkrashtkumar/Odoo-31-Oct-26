/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        odoo: {
          purple: '#714B67',
          'purple-dark': '#56384e',
          'purple-light': '#8a5c7e',
          'purple-subtle': '#f3ecf1',
          teal: '#00A09D',
          'teal-dark': '#008784',
          'teal-subtle': '#e6f6f5',
          amber: '#F0AD4E',
          'amber-subtle': '#fdf6ec',
          coral: '#D9534F',
          'coral-subtle': '#faeceb',
          canvas: '#F9F9FA',
          sheet: '#FFFFFF',
          border: '#D8DADD',
          text: '#212529',
          muted: '#6C757D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        odoo: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'odoo-card': '0 2px 4px -1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.1)',
        'odoo-modal': '0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

