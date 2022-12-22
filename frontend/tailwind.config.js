/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	// darkMode: 'media', // 'media' or 'class' or false

	content: ["./src/**/*.{js,ts,jsx,tsx,html}"],

	plugins: [],

	theme: {
		extend: {
			// animation: {
			// 	fill: "fill 0.5s ease-in forwards",
			// },
			// keyframes: {
			// 	fill: {
			// 		"0%": { padding: "20px" },
			// 		"100%": { padding: 0 },
			// 	},
			// },
			animation: {
				"fade-in": "fadeIn 500ms ease forwards",
			},

			// that is actual animation
			keyframes: () => ({
				fadeIn: {
					"0%": { backgroundColor: "#00000000" },
					"100%": { backgroundColor: "#000000bd" },
				},
			}),
		},
		screens: {
			xs: "475px",
			xsMax: { max: "475px" },
			smMax: { max: "640px" },
			mdMax: { max: "768px" },
			lgMax: { max: "1024px" },
			xlMax: { max: "1280px" },
			"2xlMax": { max: "1536px" },
			...defaultTheme.screens,
		},
	},
};
