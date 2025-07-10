// 로그인 요청 타입
export interface LoginRequest {
	empNo: string
	password: string
}

// GW 인증 응답 타입
export interface GWAuthResponse {
	jsonMessage: {
		message: string
		result: 'success' | 'fail'
		message_cd: string
	}
}

// 사용자 정보 타입
export interface UserInfo {
	userId: string
	empNo: string
	name: string
	email?: string
	department: string
	position: string
	role: string
	permissions: string[]
	lastLoginAt?: string
}

// 로그인 응답 타입
export interface LoginResponse {
	success: boolean
	message: string
	user?: UserInfo
	token?: string
}

// 세션 정보 타입
export interface SessionInfo {
	isAuthenticated: boolean
	user?: UserInfo
	token?: string
	expiresAt?: number
}
