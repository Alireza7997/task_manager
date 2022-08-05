/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	// darkMode: 'media', // 'media' or 'class' or false

	content: [
		"./src/**/*.{js,ts,jsx,tsx,html}",
		"./public/**/*.{js,ts,jsx,tsx,html}",
	],

	plugins: [],

	theme: {
		screens: {
			xs: "475px",
			...defaultTheme.screens,
		},
	},
};
