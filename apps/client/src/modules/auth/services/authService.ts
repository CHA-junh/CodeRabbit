/**
 * 인증 관련 API 서비스
 */

class AuthService {
	private static readonly API_BASE_URL =
		(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/api/auth'

	/**
	 * 사용자 로그인
	 */
	static async login(empNo: string, password: string): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ empNo, password }),
			})

			// 응답 상태 확인
			if (!response.ok) {
				// HTTP 상태 코드별 사용자 친화적 메시지
				let userMessage = '로그인에 실패했습니다.'
				switch (response.status) {
					case 401:
						userMessage = '사번 또는 비밀번호가 올바르지 않습니다.'
						break
					case 403:
						userMessage = '접근 권한이 없습니다.'
						break
					case 404:
						userMessage = '서버에 연결할 수 없습니다.'
						break
					case 500:
						userMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
						break
					default:
						userMessage = '로그인 중 오류가 발생했습니다.'
				}

				throw new Error(userMessage)
			}

			// Content-Type 확인
			const contentType = response.headers.get('content-type')
			if (!contentType || !contentType.includes('application/json')) {
				throw new Error('서버에서 JSON 응답을 반환하지 않았습니다.')
			}

			const data = await response.json()
			return data
		} catch (error) {
			// 로그 완전 제거 - 보안상 민감한 정보 노출 방지
			throw error
		}
	}

	/**
	 * 세션 확인
	 */
	static async checkSession(): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/session`, {
				method: 'GET',
				credentials: 'include',
			})

			if (response.status === 401) {
				// 인증 실패: 콘솔 에러 없이 실패 응답만 반환
				return { success: false, user: null }
			}

			const data = await response.json()
			return data
		} catch (error) {
			// 네트워크 등 진짜 예외만 콘솔 출력
			console.error('세션 확인 API 예외:', error)
			throw error
		}
	}

	/**
	 * 로그아웃
	 */
	static async logout(): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/logout`, {
				method: 'POST',
				credentials: 'include',
			})

			const data = await response.json()
			return data
		} catch (error) {
			console.error('로그아웃 API 오류:', error)
			throw error
		}
	}

	/**
	 * 비밀번호 변경
	 */
	static async changePassword(
		userId: string,
		newPassword: string
	): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/change-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ userId, newPassword }),
			})

			const data = await response.json()
			return data
		} catch (error) {
			console.error('비밀번호 변경 API 오류:', error)
			throw error
		}
	}
}

export default AuthService
