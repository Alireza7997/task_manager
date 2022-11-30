/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	// darkMode: 'media', // 'media' or 'class' or false

	content: ["./src/**/*.{js,ts,jsx,tsx,html}"],

	plugins: [],

	theme: {
		extend: {
			animation: {
				fill: "fill 0.5s ease-in forwards",
				fill_reverse: "fill_reverse 0.5s ease-in forwards",
				radius_loose: "radius_loose 0.5s ease-in forwards",
				radius_loose_reverse: "radius_loose_reverse 0.5s ease-in forwards",
				fade_side: "fade_side 0.5s ease-in forwards",
				fade_side_reverse: "fade_side_reverse 0.5s ease-in forwards",
			},
			keyframes: {
				fill: {
					"0%": { padding: "20px" },
					"100%": { padding: 0 },
				},
				fill_reverse: {
					"0%": { padding: 0 },
					"100%": { padding: "20px" },
				},
				radius_loose: {
					"0%": { "border-radius": "1.5rem" },
					"100%": { "border-radius": 0 },
				},
				radius_loose_reverse: {
					"0%": { "border-radius": 0 },
					"100%": { "border-radius": "1.5rem" },
				},
				fade_side: {
					"0%": { "min-width": "335px" },
					"100%": { "min-width": "0" },
				},
				fade_side_reverse: {
					"0%": { "min-width": "0" },
					"100%": { "min-width": "335px" },
				},
			},
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
