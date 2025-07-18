'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import AuthService from '../services/authService'

// 사용자 정보 타입
interface User {
	userId: string
	empNo: string
	name: string
	email: string
	department: string
	position: string
	role: string
	permissions: string[]
	lastLoginAt: string
	menuList: any[]
	programList: any[]
	needsPasswordChange?: boolean
}

// 세션 정보 타입 (레거시 호환성)
interface Session {
	user: User | null
}

// 인증 컨텍스트 타입
interface AuthContextType {
	user: User | null
	session: Session
	loading: boolean
	isAuthenticated: boolean
	login: (empNo: string, password: string) => Promise<any>
	logout: () => Promise<void>
	checkSession: () => Promise<void>
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 인증 프로바이더 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	// 인증 상태 계산
	const isAuthenticated = !!user

	// 세션 객체 (레거시 호환성)
	const session: Session = { user }

	// 세션 확인
	const checkSession = async () => {
		try {
			console.log('🔍 세션 확인 전 쿠키 상태:', document.cookie)
			const data = await AuthService.checkSession()
			console.log('🔍 세션 확인 응답 상태:', data)

			if (data.success && data.user) {
				// 서버 응답을 클라이언트 UserInfo로 변환
				const plainUser = JSON.parse(JSON.stringify(data.user))
				console.log('🟠 plainUser:', plainUser)

				const userInfo: User = {
					userId: plainUser.userId ?? '',
					empNo: plainUser.empNo ?? plainUser.userId ?? '',
					name: plainUser.userName ?? plainUser.name ?? '',
					email: plainUser.email ?? plainUser.emailAddr ?? '',
					department: plainUser.deptNm ?? '',
					position: plainUser.dutyNm ?? '',
					role:
						plainUser.role ?? (plainUser.authCd === '30' ? 'ADMIN' : 'USER'),
					permissions: plainUser.permissions ?? ['read', 'write'],
					lastLoginAt: plainUser.lastLoginAt ?? new Date().toISOString(),
					menuList: plainUser.menuList ?? [],
					programList: plainUser.programList ?? [],
					needsPasswordChange: plainUser.needsPasswordChange ?? false,
				}

				console.log('🟢 변환 후 클라이언트 user:', userInfo)
				console.log('user.menuList:', userInfo.menuList)
				console.log('user.programList:', userInfo.programList)

				setUser(userInfo)
			} else {
				setUser(null)
			}
		} catch (error) {
			console.error('세션 확인 오류:', error)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	// 로그인
	const login = async (empNo: string, password: string) => {
		try {
			const data = await AuthService.login(empNo, password)

			if (data.success && data.user) {
				// 서버 응답을 클라이언트 UserInfo로 변환
				const plainUser = JSON.parse(JSON.stringify(data.user))
				const userInfo: User = {
					userId: plainUser.userId ?? '',
					empNo: plainUser.empNo ?? plainUser.userId ?? '',
					name: plainUser.userName ?? plainUser.name ?? '',
					email: plainUser.email ?? plainUser.emailAddr ?? '',
					department: plainUser.deptNm ?? '',
					position: plainUser.dutyNm ?? '',
					role:
						plainUser.role ?? (plainUser.authCd === '30' ? 'ADMIN' : 'USER'),
					permissions: plainUser.permissions ?? ['read', 'write'],
					lastLoginAt: plainUser.lastLoginAt ?? new Date().toISOString(),
					menuList: plainUser.menuList ?? [],
					programList: plainUser.programList ?? [],
					needsPasswordChange: plainUser.needsPasswordChange ?? false,
				}

				setUser(userInfo)
			}

			return data
		} catch (error) {
			console.error('로그인 오류:', error)
			throw error
		}
	}

	// 로그아웃
	const logout = async () => {
		try {
			console.log('🚪 로그아웃 시작')
			const result = await AuthService.logout()
			console.log('🚪 로그아웃 결과:', result)

			// 클라이언트 상태 초기화
			setUser(null)

			// 로그인 페이지로 리다이렉션
			if (typeof window !== 'undefined') {
				window.location.href = '/signin'
			}
		} catch (error) {
			console.error('로그아웃 오류:', error)
			// 에러가 발생해도 클라이언트 상태는 초기화
			setUser(null)
			if (typeof window !== 'undefined') {
				window.location.href = '/signin'
			}
		}
	}

	// 초기 세션 확인
	useEffect(() => {
		checkSession()
	}, [])

	const value = {
		user,
		session,
		loading,
		isAuthenticated,
		login,
		logout,
		checkSession,
	}

	return React.createElement(AuthContext.Provider, { value }, children)
}

// 인증 훅
export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
