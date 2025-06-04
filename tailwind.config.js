import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", 
        disabledOpacity: 0.45, 
        fontSize: {
          tiny: "0.75rem",   // 12px
          small: "0.875rem", // 14px
          medium: "1rem", // 16px
          large: "1.125rem", // 18px
        },
        lineHeight: {
          tiny: "1rem", 
          small: "1.25rem", 
          medium: "1.6", // As specified in the requirements 
          large: "1.75rem", 
        },
        radius: {
          small: "6px", 
          medium: "8px", 
          large: "12px", 
        },
        borderWidth: {
          small: "1px", 
          medium: "1px", // 1px for default
          large: "2px", // 2px for focus states as specified
        },
      },
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: "#F9FAFB" // Almost white/light gray as specified
            },
            content1: {
              DEFAULT: "#FFFFFF",
              foreground: "#1F2937" // Dark gray for main text
            },
            content2: {
              DEFAULT: "#F9FAFB",
              foreground: "#1F2937"
            },
            content3: {
              DEFAULT: "#F3F4F6",
              foreground: "#1F2937"
            },
            content4: {
              DEFAULT: "#E5E7EB",
              foreground: "#1F2937"
            },
            divider: {
              DEFAULT: "#E5E7EB" // Border color as specified
            },
            focus: {
              DEFAULT: "#4F46E5" // Primary color (indigo)
            },
            foreground: {
              50: "#F9FAFB",
              100: "#F3F4F6",
              200: "#E5E7EB",
              300: "#D1D5DB",
              400: "#9CA3AF",
              500: "#6B7280", // Secondary text color
              600: "#4B5563",
              700: "#374151",
              800: "#1F2937", // Main text color
              900: "#111827",
              DEFAULT: "#1F2937"
            },
            primary: {
              50: "#EEF2FF",
              100: "#E0E7FF",
              200: "#C7D2FE",
              300: "#A5B4FC",
              400: "#818CF8",
              500: "#6366F1",
              600: "#4F46E5", // Primary color as specified
              700: "#4338CA", // Hover state as specified
              800: "#3730A3",
              900: "#312E81",
              DEFAULT: "#4F46E5",
              foreground: "#FFFFFF"
            },
            secondary: {
              50: "#FFFBEB",
              100: "#FEF3C7",
              200: "#FDE68A",
              300: "#FCD34D",
              400: "#FBBF24", // Accent color as specified
              500: "#F59E0B", // Hover state as specified
              600: "#D97706",
              700: "#B45309",
              800: "#92400E",
              900: "#78350F",
              DEFAULT: "#FBBF24",
              foreground: "#1F2937" // Dark text on yellow background
            },
            success: {
              50: "#ECFDF5",
              100: "#D1FAE5",
              200: "#A7F3D0",
              300: "#6EE7B7",
              400: "#34D399",
              500: "#10B981", // Success color as specified
              600: "#059669",
              700: "#047857",
              800: "#065F46",
              900: "#064E3B",
              DEFAULT: "#10B981",
              foreground: "#FFFFFF"
            },
            danger: {
              50: "#FEF2F2",
              100: "#FEE2E2",
              200: "#FECACA",
              300: "#FCA5A5",
              400: "#F87171",
              500: "#EF4444", // Error color as specified
              600: "#DC2626",
              700: "#B91C1C",
              800: "#991B1B",
              900: "#7F1D1D",
              DEFAULT: "#EF4444",
              foreground: "#FFFFFF"
            }
          }
        }
      }
    })
  ]
}
