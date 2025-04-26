import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/**
 * Enhanced Tailwind Configuration
 * 
 * This configuration centralizes theme tokens and adds custom utility classes
 * to make styling more consistent and maintainable across the application.
 */

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Border Radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // Core Color Palette
      colors: {
        // Base UI Colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        // Primary Brand Colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          500: "hsl(var(--primary-500))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
          950: "hsl(var(--primary-950))",
        },
        
        // Secondary Colors
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "hsl(var(--secondary-50))",
          100: "hsl(var(--secondary-100))",
          200: "hsl(var(--secondary-200))",
          300: "hsl(var(--secondary-300))",
          400: "hsl(var(--secondary-400))",
          500: "hsl(var(--secondary-500))",
          600: "hsl(var(--secondary-600))",
          700: "hsl(var(--secondary-700))",
          800: "hsl(var(--secondary-800))",
          900: "hsl(var(--secondary-900))",
          950: "hsl(var(--secondary-950))",
        },
        
        // Neutral/UI Colors
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        
        // Feedback/Status Colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          50: "hsl(var(--success-50))",
          100: "hsl(var(--success-100))",
          200: "hsl(var(--success-200))",
          300: "hsl(var(--success-300))",
          400: "hsl(var(--success-400))",
          500: "hsl(var(--success-500))",
          600: "hsl(var(--success-600))",
          700: "hsl(var(--success-700))",
          800: "hsl(var(--success-800))",
          900: "hsl(var(--success-900))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          50: "hsl(var(--warning-50))",
          100: "hsl(var(--warning-100))",
          200: "hsl(var(--warning-200))",
          300: "hsl(var(--warning-300))",
          400: "hsl(var(--warning-400))",
          500: "hsl(var(--warning-500))",
          600: "hsl(var(--warning-600))",
          700: "hsl(var(--warning-700))",
          800: "hsl(var(--warning-800))",
          900: "hsl(var(--warning-900))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          50: "hsl(var(--destructive-50))",
          100: "hsl(var(--destructive-100))",
          200: "hsl(var(--destructive-200))",
          300: "hsl(var(--destructive-300))",
          400: "hsl(var(--destructive-400))",
          500: "hsl(var(--destructive-500))",
          600: "hsl(var(--destructive-600))",
          700: "hsl(var(--destructive-700))",
          800: "hsl(var(--destructive-800))",
          900: "hsl(var(--destructive-900))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          50: "hsl(var(--info-50))",
          100: "hsl(var(--info-100))",
          200: "hsl(var(--info-200))",
          300: "hsl(var(--info-300))",
          400: "hsl(var(--info-400))",
          500: "hsl(var(--info-500))",
          600: "hsl(var(--info-600))",
          700: "hsl(var(--info-700))",
          800: "hsl(var(--info-800))",
          900: "hsl(var(--info-900))",
        },
        
        // UI Element Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Chart Colors
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
          "6": "hsl(var(--chart-6))",
          "7": "hsl(var(--chart-7))",
          "8": "hsl(var(--chart-8))",
        },
        
        // Layout-specific Colors
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      
      // Typography
      fontSize: {
        // Add more precise font sizing if needed
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      
      // Spacing
      spacing: {
        // Add additional spacing values if needed
      },
      
      // Z-index
      zIndex: {
        'modal': '50',
        'dropdown': '40',
        'popover': '30',
        'tooltip': '20',
        'header': '10',
      },
      
      // Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fadeIn": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fadeOut": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slideInFromRight": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slideOutToRight": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": "fadeIn 0.3s ease-out",
        "fadeOut": "fadeOut 0.3s ease-out",
        "slideIn": "slideInFromRight 0.3s ease-out",
        "slideOut": "slideOutToRight 0.3s ease-out",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      
      // Shadows
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'dropdown': '0 2px 5px -1px rgba(0, 0, 0, 0.1), 0 1px 3px -1px rgba(0, 0, 0, 0.1)',
        'modal': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  
  // Custom Utility Classes
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    
    // Custom component classes
    plugin(({ addComponents }) => {
      addComponents({
        // Button variants
        '.btn-primary': {
          '@apply inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50': {},
        },
        '.btn-secondary': {
          '@apply inline-flex items-center justify-center gap-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50': {},
        },
        '.btn-outline': {
          '@apply inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50': {},
        },
        '.btn-ghost': {
          '@apply inline-flex items-center justify-center gap-2 rounded-md hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50': {},
        },
        '.btn-destructive': {
          '@apply inline-flex items-center justify-center gap-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50': {},
        },
        '.btn-success': {
          '@apply inline-flex items-center justify-center gap-2 rounded-md bg-success text-success-foreground hover:bg-success/90 h-10 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50': {},
        },
        
        // Card variants
        '.card': {
          '@apply rounded-lg border bg-card text-card-foreground shadow-sm': {},
        },
        '.card-glass': {
          '@apply rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/70 text-card-foreground shadow-sm backdrop-blur-sm': {},
        },
        
        // Form field variants
        '.form-field': {
          '@apply block w-full': {},
        },
        '.form-label': {
          '@apply block text-sm font-medium leading-none mb-2': {},
        },
        '.form-input': {
          '@apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50': {},
        },
        '.form-select': {
          '@apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50': {},
        },
        '.form-textarea': {
          '@apply flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50': {},
        },
        '.form-checkbox': {
          '@apply h-4 w-4 rounded border-border text-primary focus:ring-primary/80 focus:ring-offset-background': {},
        },
        '.form-error': {
          '@apply text-destructive text-sm mt-1': {},
        },
        
        // Table styles
        '.table-container': {
          '@apply w-full overflow-auto': {},
        },
        '.table': {
          '@apply w-full caption-bottom text-sm': {},
        },
        '.table-header': {
          '@apply [&_tr]:border-b': {},
        },
        '.table-head': {
          '@apply h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0': {},
        },
        '.table-body': {
          '@apply [&_tr:last-child]:border-0': {},
        },
        '.table-row': {
          '@apply border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted': {},
        },
        '.table-cell': {
          '@apply p-4 align-middle [&:has([role=checkbox])]:pr-0': {},
        },
        '.table-footer': {
          '@apply bg-primary-50/50 dark:bg-neutral-800/50': {},
        },
        
        // Status pill/badge
        '.status-badge': {
          '@apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold': {},
        },
        '.status-pending': {
          '@apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500': {},
        },
        '.status-success': {
          '@apply bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500': {},
        },
        '.status-error': {
          '@apply bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500': {},
        },
        '.status-info': {
          '@apply bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500': {},
        },
        
        // Page layout containers
        '.page-container': {
          '@apply container mx-auto p-4 sm:p-6': {},
        },
        '.section': {
          '@apply py-6': {},
        },
        '.section-header': {
          '@apply flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6': {},
        },
        '.section-title': {
          '@apply text-2xl font-semibold tracking-tight': {},
        },
        '.section-description': {
          '@apply text-muted-foreground': {},
        },
      });
    }),
  ],
} satisfies Config;
