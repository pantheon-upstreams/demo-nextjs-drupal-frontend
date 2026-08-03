import type { Config } from "tailwindcss";

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        border: "var(--border)",
        card: "var(--card)",
        nav: "var(--nav)",
        highlight: "var(--highlight)",
      },
      backgroundImage: {
        'space-gradient': 'var(--space-gradient)',
        'tech-gradient': 'var(--tech-gradient)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(239, 208, 27, 0.35)',
        'glow-lg': '0 0 40px rgba(239, 208, 27, 0.45)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;