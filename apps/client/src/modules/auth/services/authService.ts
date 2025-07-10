import { LoginRequest, LoginResponse } from '../types'

// 인증 서비스
export class AuthService {
	private static readonly API_BASE_URL = '/api/auth'

	// 로그인
	static async login(loginData: LoginRequest): Promise<LoginResponse> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginData),
				credentials: 'include', // 쿠키 포함
			})
			const data = await response.json()
			return data as LoginResponse
		} catch (error) {
			return {
				success: false,
				message: '로그인 중 오류가 발생했습니다.',
			}
		}
	}

	// 세션 확인
	static async checkSession(): Promise<any | null> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/session`, {
				credentials: 'include', // 쿠키 포함
			})
			if (response.ok) {
				const data = await response.json()
				return data.user || null
			}
			return null
		} catch (error) {
			return null
		}
	}

	// 로그아웃
	static async logout(): Promise<void> {
		try {
			await fetch(`${this.API_BASE_URL}/logout`, {
				method: 'POST',
				credentials: 'include', // 쿠키 포함
			})
		} catch (error) {
			// 무시
		}
	}

	// 토큰 갱신
	static async refreshToken(): Promise<string | null> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/refresh`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (response.ok) {
				const data = await response.json()
				return data.token || null
			}
			return null
		} catch (error) {
			console.error('토큰 갱신 오류:', error)
			return null
		}
	}
}
