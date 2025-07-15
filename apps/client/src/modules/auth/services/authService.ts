import { LoginRequest, LoginResponse } from '../types'

// 인증 서비스
export class AuthService {
	private static readonly API_BASE_URL = '/api/auth'

	// 서버 응답을 클라이언트 UserInfo로 변환
	private static mapServerUserToClientUser(serverUser: any): any {
		if (!serverUser) return null
		// Proxy/직렬화 문제 대응: plain object로 변환
		const plainUser = JSON.parse(JSON.stringify(serverUser))
		console.log('🟠 plainUser:', plainUser)
		const userInfo = {
			userId: plainUser.userId ?? '',
			empNo: plainUser.empNo ?? plainUser.userId ?? '',
			name: plainUser.userName ?? plainUser.name ?? '',
			email: plainUser.email ?? plainUser.emailAddr ?? '',
			department: plainUser.deptNm ?? plainUser.department ?? '',
			position: plainUser.dutyNm ?? plainUser.position ?? '', // dutyNm(직급명) → position 순서
			role: plainUser.role ?? (plainUser.authCd === '30' ? 'ADMIN' : 'USER'),
			permissions: plainUser.permissions ?? ['read', 'write'],
			lastLoginAt: plainUser.lastLoginAt ?? new Date().toISOString(),
			// 서버 원본 필드도 모두 보존
			userName: plainUser.userName ?? plainUser.name ?? '',
			deptCd: plainUser.deptCd ?? '',
			deptNm: plainUser.deptNm ?? plainUser.department ?? '',
			dutyCd: plainUser.dutyCd ?? '',
			dutyNm: plainUser.dutyNm ?? plainUser.position ?? '',
			dutyDivCd: plainUser.dutyDivCd ?? '',
			authCd: plainUser.authCd ?? '',
			emailAddr: plainUser.emailAddr ?? '',
			usrRoleId: plainUser.usrRoleId ?? '',
			needsPasswordChange: plainUser.needsPasswordChange ?? false,
		}
		console.log('🟢 변환 후 클라이언트 user:', userInfo)
		return userInfo
	}

	// 로그인
	static async login(
		loginData: LoginRequest
	): Promise<LoginResponse & { needsPasswordChange?: boolean }> {
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
			console.log('서버 응답 data:', data)

			// needsPasswordChange를 최대한 명확하게 판별
			const needsPasswordChange =
				data.needsPasswordChange === true ||
				(data.user && data.user.needsPasswordChange === true) ||
				(typeof data.message === 'string' &&
					data.message.includes('초기 비밀번호'))

			return {
				...data,
				user: data.user ? this.mapServerUserToClientUser(data.user) : undefined,
				needsPasswordChange,
			}
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
			console.log('🔍 세션 확인 시작')
			const response = await fetch(`${this.API_BASE_URL}/session`, {
				credentials: 'include', // 쿠키 포함
			})
			console.log('🔍 세션 확인 응답 상태:', response.status)

			if (response.ok) {
				const data = await response.json()
				console.log('서버 응답 데이터:', data)

				// success 필드가 있으면 그것을 우선 확인, 없으면 user 필드만 확인
				const isValidSession = data.success !== false && data.user
				if (isValidSession) {
					console.log('✅ 서버에서 유효한 세션 확인')
					return this.mapServerUserToClientUser(data.user)
				} else {
					console.log('❌ 서버에서 세션 무효 응답')
					return null
				}
			}
			console.log('🔍 세션 확인 실패 - 응답이 성공이 아님')
			return null
		} catch (error) {
			console.error('🔍 세션 확인 오류:', error)
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
