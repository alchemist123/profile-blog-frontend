/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
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
				// Blog brand: "Ink & Ember"
				ink: {
					50: "#F4F3F8",
					100: "#E7E5F0",
					200: "#CAC6DC",
					300: "#A29DBD",
					400: "#7C7699",
					500: "#5E5878",
					600: "#45405F",
					700: "#312D4A",
					800: "#211E36",
					900: "#17142A",
					950: "#0F0D1F",
				},
				ember: {
					50: "#FFF4EF",
					100: "#FFE5DA",
					200: "#FFC6B0",
					300: "#FF9C7A",
					400: "#FF7650",
					500: "#FF5C35",
					600: "#E8431C",
					700: "#C23412",
					800: "#9A2B12",
				},
				paper: "#FAF7F2",
				sand: {
					DEFAULT: "#F1EBE1",
					line: "#E4DCCF",
				},
			},
			fontFamily: {
				display: ['"Fraunces"', "Georgia", "serif"],
				reading: ['"Inter"', "system-ui", "sans-serif"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require("tailwindcss-animate")
	],
}
