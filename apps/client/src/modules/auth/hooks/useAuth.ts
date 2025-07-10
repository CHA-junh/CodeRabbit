'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../services/authService'
import { LoginRequest, UserInfo, SessionInfo } from '../types'

export const useAuth = () => {
	const [session, setSession] = useState<SessionInfo>({
		isAuthenticated: false,
	})
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	// 세션 확인
	const checkSession = useCallback(async () => {
		try {
			setLoading(true)
			const user = await AuthService.checkSession()

			if (user) {
				setSession({
					isAuthenticated: true,
					user,
				})
			} else {
				setSession({
					isAuthenticated: false,
				})
			}
		} catch (error) {
			console.error('세션 확인 오류:', error)
			setSession({
				isAuthenticated: false,
			})
		} finally {
			setLoading(false)
		}
	}, [])

	// 로그인
	const login = useCallback(
		async (loginData: LoginRequest) => {
			try {
				setLoading(true)
				const response = await AuthService.login(loginData)

				if (response.success && response.user) {
					setSession({
						isAuthenticated: true,
						user: response.user,
						token: response.token,
					})

					// 메인 페이지로 이동
					router.push('/dashboard')
					return { success: true }
				} else {
					return { success: false, message: response.message }
				}
			} catch (error) {
				console.error('로그인 오류:', error)
				return { success: false, message: '로그인 중 오류가 발생했습니다.' }
			} finally {
				setLoading(false)
			}
		},
		[router]
	)

	// 로그아웃
	const logout = useCallback(async () => {
		try {
			await AuthService.logout()
			setSession({
				isAuthenticated: false,
			})

			// 로그인 페이지로 이동
			router.push('/login')
		} catch (error) {
			console.error('로그아웃 오류:', error)
		}
	}, [router])

	// 초기 세션 확인
	useEffect(() => {
		checkSession()
	}, [checkSession])

	return {
		session,
		loading,
		login,
		logout,
		checkSession,
		isAuthenticated: session.isAuthenticated,
		user: session.user,
	}
}
