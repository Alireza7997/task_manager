/** @type {import('next').NextConfig} */
const nextConfig = {
	// This option makes components to render twice, so I changed it to false
	reactStrictMode: false,
	swcMinify: true,
	images: {
		unoptimized: true,
	},
};

module.exports = nextConfig;
