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

	// 쿠키 삭제 함수
	const clearSessionCookies = useCallback(() => {
		// 현재 쿠키 상태 로그
		console.log('🍪 현재 쿠키:', document.cookie)

		// session 쿠키 삭제
		document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
		document.cookie = 'empNo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
		console.log('🧹 세션 쿠키 삭제 완료')
		console.log('🍪 삭제 후 쿠키:', document.cookie)
	}, [])

	// 세션 확인
	const checkSession = useCallback(async () => {
		try {
			setLoading(true)

			// 현재 쿠키 상태 확인
			console.log('🔍 세션 확인 전 쿠키 상태:', document.cookie)

			const user = await AuthService.checkSession()

			// user가 null이거나 undefined인 경우 세션 무효로 처리
			if (!user) {
				console.log('❌ 세션 확인 실패 - 사용자 정보 없음')
				setSession({
					isAuthenticated: false,
				})
				// 세션이 없으면 쿠키 삭제 후 로그인 페이지로 이동
				clearSessionCookies()
				router.push('/signin')
				return
			}

			// 서버 응답에서 success 필드 확인 (추가 검증)
			const response = await fetch('/api/auth/session', {
				credentials: 'include',
			})
			const data = await response.json()

			// success 필드가 false이면 세션 무효
			if (data.success === false) {
				console.log('❌ 서버에서 세션 무효 응답 - 강제 로그아웃')
				setSession({
					isAuthenticated: false,
				})
				clearSessionCookies()
				router.push('/signin')
				return
			}

			// 사용자 정보가 있으면 인증 성공
			console.log('✅ 세션 확인 성공 - 사용자:', user.name)
			setSession({
				isAuthenticated: true,
				user,
			})
		} catch (error) {
			console.error('❌ 세션 확인 오류:', error)
			setSession({
				isAuthenticated: false,
			})
			// 오류 발생 시 쿠키 삭제 후 로그인 페이지로 이동
			clearSessionCookies()
			router.push('/signin')
		} finally {
			setLoading(false)
		}
	}, [router, clearSessionCookies])

	// 로그인
	const login = useCallback(
		async (loginData: LoginRequest) => {
			try {
				setLoading(true)
				const response = await AuthService.login(loginData)

				// message가 JSON 문자열로 올 경우 파싱해서 진짜 메시지만 추출
				let safeMessage = ''
				if (typeof response.message === 'string') {
					try {
						const parsed = JSON.parse(response.message)
						if (parsed && typeof parsed === 'object' && parsed.message) {
							safeMessage = parsed.message
						} else {
							safeMessage = response.message
						}
					} catch {
						safeMessage = response.message
					}
				} else if (response.message) {
					safeMessage = JSON.stringify(response.message)
				}

				if (response.needsPasswordChange) {
					return {
						success: false,
						needsPasswordChange: true,
						message: safeMessage,
					}
				}

				if (response.success && response.user) {
					setSession({
						isAuthenticated: true,
						user: response.user,
						token: response.token,
					})
					router.push('/dashboard')
					return { success: true }
				} else {
					return { success: false, message: safeMessage }
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

			// 쿠키 삭제 후 로그인 페이지로 이동
			clearSessionCookies()
			router.push('/signin')
		} catch (error) {
			console.error('로그아웃 오류:', error)
		}
	}, [router, clearSessionCookies])

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
