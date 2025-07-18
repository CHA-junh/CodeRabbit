/**
 * 환경별 시스템명 반환
 */
export function getSystemName(): string {
	const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
	const port = typeof window !== 'undefined' ? window.location.port : ''

	// 로컬 환경 (localhost:3000)
	if (hostname === 'localhost' || hostname === '127.0.0.1') {
		return 'BIST (Local)'
	}

	// 개발 환경 (dev.example.com 또는 개발 서버)
	if (hostname.includes('dev') || hostname.includes('staging')) {
		return 'BIST (Dev)'
	}

	// 운영 환경 (기본값)
	return 'BIST (Prod)'
}

/**
 * 환경별 브라우저 탭 제목 반환
 */
export function getPageTitle(pageName?: string): string {
	const systemName = getSystemName()
	return pageName ? `${pageName} - ${systemName}` : systemName
}
