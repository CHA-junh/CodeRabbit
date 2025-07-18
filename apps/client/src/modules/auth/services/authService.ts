/**
 * 인증 관련 API 서비스
 */

class AuthService {
	private static readonly API_BASE_URL =
		process.env.NEXT_PUBLIC_API_URL + '/api/auth'

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

			const data = await response.json()
			return data
		} catch (error) {
			console.error('로그인 API 오류:', error)
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

			const data = await response.json()
			return data
		} catch (error) {
			console.error('세션 확인 API 오류:', error)
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
