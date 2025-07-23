/** @type {import('next').NextConfig} */
const nextConfig = {
	// 폰트 최적화 완전 비활성화 (OTS 파싱 에러 방지)
	optimizeFonts: false,
	experimental: {
		optimizePackageImports: [],
	},

	// designs 폴더 빌드 제외 설정
	webpack: (config, { isServer }) => {
		// designs 폴더의 모든 파일을 빌드에서 제외
		config.resolve.alias = {
			...config.resolve.alias,
			'@/app/designs': false,
		}

		// designs 폴더의 모든 파일을 무시
		config.module.rules.push({
			test: /[\\/]designs[\\/].*\.(tsx|ts|jsx|js)$/,
			use: 'ignore-loader',
		})

		return config
	},

	// API 프록시 설정 및 designs 폴더 제외
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:8080/api/:path*',
			},
		]
	},

	// 🔒 보안 강화된 CORS 설정
	async headers() {
		return [
			{
				source: '/api/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value:
							process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || 'http://localhost:3000',
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET, POST, PUT, DELETE, OPTIONS',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'Content-Type, Authorization, X-Requested-With',
					},
					{
						key: 'Access-Control-Allow-Credentials',
						value: 'true',
					},
					// 🔒 보안 헤더 추가
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
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
