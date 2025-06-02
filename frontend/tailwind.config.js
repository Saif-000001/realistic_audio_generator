/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Custom brand colors
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Professional grays
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    themes: [
      {
        // Light theme for professional applications
        light: {
          "primary": "#2563eb",        // Professional blue
          "primary-content": "#ffffff", // White text on primary
          "secondary": "#7c3aed",      // Purple accent
          "secondary-content": "#ffffff",
          "accent": "#059669",         // Green accent
          "accent-content": "#ffffff",
          "neutral": "#374151",        // Neutral gray
          "neutral-content": "#f9fafb",
          "base-100": "#ffffff",       // White background
          "base-200": "#f9fafb",       // Light gray
          "base-300": "#f3f4f6",       // Lighter gray
          "base-content": "#111827",   // Dark text
          "info": "#0ea5e9",          // Sky blue
          "info-content": "#ffffff",
          "success": "#10b981",       // Emerald green
          "success-content": "#ffffff",
          "warning": "#f59e0b",       // Amber
          "warning-content": "#ffffff",
          "error": "#ef4444",         // Red
          "error-content": "#ffffff",
        },
        // Dark theme for developers
        dark: {
          "primary": "#3b82f6",        // Bright blue
          "primary-content": "#ffffff",
          "secondary": "#8b5cf6",      // Violet
          "secondary-content": "#ffffff",
          "accent": "#10b981",         // Emerald
          "accent-content": "#ffffff",
          "neutral": "#374151",        // Gray
          "neutral-content": "#f9fafb",
          "base-100": "#0f172a",       // Dark slate
          "base-200": "#1e293b",       // Slate 800
          "base-300": "#334155",       // Slate 700
          "base-content": "#f1f5f9",   // Light text
          "info": "#0ea5e9",          // Sky blue
          "info-content": "#ffffff",
          "success": "#22c55e",       // Green
          "success-content": "#ffffff",
          "warning": "#eab308",       // Yellow
          "warning-content": "#000000",
          "error": "#ef4444",         // Red
          "error-content": "#ffffff",
        },
        // Professional theme (your fixed version)
        professional: {
          "primary": "#1e40af",        // Deep blue - professional and trustworthy
          "primary-content": "#ffffff",
          "secondary": "#7c2d12",      // Deep orange - warm accent
          "secondary-content": "#ffffff",
          "accent": "#059669",         // Emerald - success/positive actions
          "accent-content": "#ffffff",
          "neutral": "#374151",        // Professional gray
          "neutral-content": "#f9fafb",
          "base-100": "#ffffff",       // Clean white background
          "base-200": "#f8fafc",       // Very light gray
          "base-300": "#e2e8f0",       // Light gray for borders
          "base-content": "#1f2937",   // Dark gray text
          "info": "#0369a1",          // Professional blue info
          "info-content": "#ffffff",
          "success": "#047857",       // Professional green
          "success-content": "#ffffff",
          "warning": "#d97706",       // Professional amber
          "warning-content": "#ffffff",
          "error": "#dc2626",         // Professional red
          "error-content": "#ffffff",
        },
      },
      "light", // Built-in light theme
      "dark",  // Built-in dark theme
    ],
    darkTheme: "dark", // Set default dark theme
    base: true, // Apply background color and foreground color for root element
    styled: true, // Include DaisyUI colors and design decisions
    utils: true, // Add responsive and modifier utility classes
    logs: true, // Show info about DaisyUI version and used config
  },
  plugins: [
    require('daisyui'),
    // Add custom plugin for additional utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
      }
      addUtilities(newUtilities);
    }
  ],
}