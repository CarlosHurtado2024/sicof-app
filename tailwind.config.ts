
import type { Config } from "tailwindcss"

const config = {
    darkMode: "class",
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                "background-light": "#F8F5EE",
                "background-dark": "#1A1A1A",
                "surface-light": "#FFFFFF",
                "surface-dark": "#2A2A2A",
                "sidebar-light": "#F2EBE1",
                "sidebar-dark": "#222222",
                "text-main-light": "#333333",
                "text-main-dark": "#F3F3F3",
                "text-muted-light": "#666666",
                "text-muted-dark": "#A0A0A0",
                "success": "#7A9C83",
                "danger": "#E55B5B",
                "warning": "#F2C94C",
                "info": "#2D6A4F",
                "komi-primary": "#2B463C",
                "komi-accent": "#F28C73",
            },
            fontFamily: {
                "display": ["Inter", "var(--font-public-sans)", "sans-serif"],
                "serif": ["var(--font-playfair-display)", "serif"]
            },
            borderRadius: {
                DEFAULT: "0.75rem",
                lg: "1rem",
                xl: "1.5rem",
                "2xl": "2rem",
                "3xl": "2.5rem",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
