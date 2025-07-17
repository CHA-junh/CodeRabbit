/** @type {import('next').NextConfig} */
export default {
	// experimental: {
	// 	proxy: [
	// 		{
	// 			path: '/api/:path*',
	// 			target: 'http://localhost:8080',
	// 		},
	// 	],
	// },
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:8080/api/:path*", // Keep '/api' in the destination
			},
		];
	},
	env: {
		NEXT_PUBLIC_API_URL: "http://localhost:8080",
	},
	allowedDevOrigins: [
		"http://127.0.0.1:3000",
		"http://localhost:3000",
		"http://127.0.0.1:3001",
		"http://localhost:3001",
		"http://127.0.0.1:5173",
		"http://localhost:5173",
	],
};
