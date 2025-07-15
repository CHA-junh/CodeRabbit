/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:8080/:path*', // /api prefix 제거
			},
		]
	},
	allowedDevOrigins: [
		'http://127.0.0.1:3000',
		'http://localhost:3000',
		'http://127.0.0.1:3001',
		'http://localhost:3001',
		'http://127.0.0.1:5173',
		'http://localhost:5173',
	],
}

module.exports = nextConfig
