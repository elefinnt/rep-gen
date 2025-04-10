import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        header: ["36px", { lineHeight: "100%", letterSpacing: "1.08px" }],
        smallLabel: ["10px", { lineHeight: "100%", letterSpacing: "0.28px" }],
        label: ["12px", { lineHeight: "100%", letterSpacing: "0.33px" }],
      },
      colors: {
        border: "hsl(var(--border))",
        black: "#212021",
        gray: {
          dark: "#666563",
          DEFAULT: "#908E8B",
        },
        white: "#ffffff",
        seaSalt: {
          "20": "#FBFBFA",
          "40": "#F8F7F6",
          "60": "#F4F3F1",
          "80": "#F1EFED",
          k40: "#8E8D8B",
          DEFAULT: "#EDEBE8",
        },
        orange: {
          "20": "#FFE8D9",
          "40": "#FED1B3",
          "60": "#FEBA8C",
          "80": "#FDA366",
          k40: "#985426",
          DEFAULT: "#fd8c40",
        },
        red: {
          "20": "#FFD9DC",
          "40": "#FEB3BA",
          "60": "#FE8C97",
          "80": "#FD6675",
          k40: "#982631",
          DEFAULT: "#FD4052",
        },
        fuchsia: {
          "20": "#FBD9FF",
          "40": "#F7B3FE",
          "60": "#F38CFE",
          "80": "#EF66FD",
          k40: "#8D2698",
          DEFAULT: "#EB40FD",
        },
        blue: {
          "20": "#D9EFFF",
          "40": "#B3E0FE",
          "60": "#8CD0FE",
          "80": "#66C1FD",
          k40: "#266A98",
          DEFAULT: "#40B1FD",
        },
        springGreen: {
          "20": "#D9FFE8",
          "40": "#B3FED1",
          "60": "#8CFEBA",
          "80": "#66FDA3",
          k40: "#269854",
          DEFAULT: "#40FD8C",
        },
        neonGreen: {
          "20": "#DDFFD9",
          "40": "#BAFEB3",
          "60": "#98FE8C",
          "80": "#75FD66",
          k40: "#329826",
          DEFAULT: "#53FD40",
        },
        yellow: {
          "20": "#FFFBD9",
          "40": "#FEF7B3",
          "60": "#FEF38C",
          "80": "#FDEF66",
          k40: "#988D26",
          DEFAULT: "#FDEB40",
        },
        purple: {
          "20": "#E8D9FF",
          "40": "#D1B3FE",
          "60": "#BA8CFE",
          "80": "#A366FD",
          k40: "#542698",
          DEFAULT: "#8C40FD",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        dark: "#19232D",
        grey: "#212021",
        danger: "#f94a24",
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
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
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
      borderRadius: {
        xl: "calc(var(--radius) + 12px)",
        lg: "calc(var(--radius) + 2px)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
