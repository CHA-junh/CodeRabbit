/** @type {import('next').NextConfig} */
const nextConfig = {
	// 폰트 최적화 완전 비활성화 (OTS 파싱 에러 방지)
	optimizeFonts: false,
	experimental: {
		optimizePackageImports: [],
	},

	// API 프록시 설정
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:8080/api/:path*',
			},
		]
	},

	// CORS 설정
	async headers() {
		return [
			{
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET, POST, PUT, DELETE, OPTIONS',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'Content-Type, Authorization',
					},
				],
			},
		]
	},

	// 이미지 도메인 설정
	images: {
		domains: ['localhost'],
	},
}

export default nextConfig
