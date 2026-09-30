import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { primary: "#1A1A1A", accent: "#25D366", border: "#E5E7EB", muted: "#6B7280", danger: "#DC2626", success: "#16A34A" },
      fontFamily: { heading: ["Idealist Sans", "Manrope", "sans-serif"], body: ["Manrope", "sans-serif"], mono: ["Ubuntu Mono", "monospace"] },
      keyframes: { "cart-pop": { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.18)" } } },
      animation: { "cart-pop": "cart-pop 180ms ease-out" },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
