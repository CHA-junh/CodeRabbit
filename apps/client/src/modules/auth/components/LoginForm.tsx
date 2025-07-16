'use client'

import React, { useRef, useState, useEffect } from 'react'
import styles from './LoginForm.module.css'
import { PasswordChangePopup } from './PasswordChangePopup'
import { useAuth } from '../hooks/useAuth'

export default function LoginForm() {
	console.log('LoginForm 렌더링')
	const [rightPanelActive, setRightPanelActive] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const [signUpId, setSignUpId] = useState('')
	const [signInId, setSignInId] = useState('')
	const [signInPw, setSignInPw] = useState('')
	const [loginError, setLoginError] = useState<string | null>(null)
	const [showPwdChange, setShowPwdChange] = useState(false)
	const [pwdChangeUserId, setPwdChangeUserId] = useState('')
	const [pwdChangeLoading, setPwdChangeLoading] = useState(false)
	const [pwdChangeMsg, setPwdChangeMsg] = useState<string | null>(null)
	const [pendingLogin, setPendingLogin] = useState<{
		empNo: string
		password: string
	} | null>(null)
	const [pendingNeedsPwdChange, setPendingNeedsPwdChange] = useState(false)

	const { login } = useAuth()

	const handleSignUpClick = () => {
		setRightPanelActive(true)
	}
	const handleSignInClick = () => {
		setRightPanelActive(false)
	}

	// 숫자만 입력되도록 처리
	const handleIdInput =
		(setter: (v: string) => void) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value.replace(/[^0-9]/g, '')
			setter(value)
		}

	// 로그인 폼 onSubmit 핸들러
	const handleSignInSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoginError(null)
		try {
			const result = await login({ empNo: signInId, password: signInPw })
			console.log('login result:', result)
			if (result.success) {
				window.location.reload()
			} else if (result.needsPasswordChange) {
				console.log('needsPasswordChange:', result.needsPasswordChange)
				setPwdChangeUserId(signInId)
				setPendingLogin({ empNo: signInId, password: signInPw })
				setPendingNeedsPwdChange(true)
				console.log('setPendingNeedsPwdChange(true) 호출')
				setLoginError(
					result.message ||
						'초기 비밀번호입니다. 비밀번호를 변경해야 로그인할 수 있습니다.'
				)
			} else {
				setLoginError(result.message || '로그인 실패')
			}
		} catch (err) {
			setLoginError('서버 오류')
		}
	}

	useEffect(() => {
		console.log('showPwdChange:', showPwdChange)
		if (pendingNeedsPwdChange && !showPwdChange) {
			setShowPwdChange(true)
			setPendingNeedsPwdChange(false)
		}
	}, [pendingNeedsPwdChange, showPwdChange])

	const handlePwdChangeSubmit = async (newPassword: string) => {
		setPwdChangeLoading(true)
		setPwdChangeMsg(null)
		try {
			const res = await fetch(
				'http://localhost:8080/api/auth/change-password',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: pwdChangeUserId, newPassword }),
				}
			)
			const data = await res.json()
			if (data.success) {
				setPwdChangeMsg(
					'비밀번호가 성공적으로 변경되었습니다. 다시 로그인합니다...'
				)
				setTimeout(async () => {
					setShowPwdChange(false)
					setPwdChangeMsg(null)
					// 비밀번호 변경 성공 시 자동 로그인 재시도
					if (pendingLogin) {
						await handleAutoLogin(pendingLogin.empNo, newPassword)
						setPendingLogin(null)
					}
				}, 1200)
			} else {
				setPwdChangeMsg(data.message || '비밀번호 변경 실패')
			}
		} catch (err) {
			setPwdChangeMsg('서버 오류')
		} finally {
			setPwdChangeLoading(false)
		}
	}

	const handlePwdChangeClose = () => {
		setShowPwdChange(false)
		setPwdChangeMsg(null)
	}

	const handleAutoLogin = async (empNo: string, password: string) => {
		try {
			const response = await fetch('http://localhost:8080/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ empNo, password }),
				credentials: 'include',
			})
			const data = await response.json()
			if (data.success && !data.user?.needsPasswordChange) {
				window.location.reload()
			} else if (data.user?.needsPasswordChange) {
				setLoginError(
					'비밀번호 변경 후에도 초기 비밀번호와 동일합니다. 다시 시도해 주세요.'
				)
			}
		} catch (err) {
			setLoginError('자동 로그인 중 오류가 발생했습니다.')
		}
	}

	return (
		<>
			{showPwdChange && console.log('PasswordChangePopup 렌더링됨')}
			<PasswordChangePopup
				isOpen={showPwdChange}
				onClose={handlePwdChangeClose}
				onSubmit={handlePwdChangeSubmit}
				userId={pwdChangeUserId}
			/>
			{pwdChangeMsg && (
				<div style={{ color: 'green', textAlign: 'center', marginTop: 16 }}>
					{pwdChangeMsg}
				</div>
			)}
			<div className={styles.wrapper}>
				<div
					className={
						rightPanelActive
							? `${styles.container} right-panel-active`
							: styles.container
					}
					ref={containerRef}
				>
					<div className={styles['sign-up-container']}>
						<form className={styles.form}>
							<h1>Create Account</h1>
							{/* 소셜 아이콘 삭제 */}
							{/* <div className={styles['social-links']}>
								<div>
									<a href='#'>
										<FaFacebook />
									</a>
								</div>
								<div>
									<a href='#'>
										<FaTwitter />
									</a>
								</div>
								<div>
									<a href='#'>
										<FaLinkedin />
									</a>
								</div>
							</div> */}
							<span>or use your email for registration</span>
							<input type='text' placeholder='Name' className={styles.input} />
							<input
								type='text'
								placeholder='ID'
								className={styles.input}
								value={signUpId}
								onChange={handleIdInput(setSignUpId)}
								inputMode='numeric'
								pattern='[0-9]*'
								autoComplete='off'
							/>
							<input
								type='password'
								placeholder='Password'
								className={styles.input}
							/>
							{/* SIGN UP 버튼 삭제 */}
							{/* <button className={styles.form_btn}>Sign Up</button> */}
						</form>
					</div>
					<div className={styles['sign-in-container']}>
						<form className={styles.form} onSubmit={handleSignInSubmit}>
							<h1>Sign In</h1>
							{/* 소셜 아이콘 삭제 */}
							{/* <div className={styles['social-links']}>
								<div>
									<a href='#'>
										<FaFacebook />
									</a>
								</div>
								<div>
									<a href='#'>
										<FaTwitter />
									</a>
								</div>
								<div>
									<a href='#'>
										<FaLinkedin />
									</a>
								</div>
							</div> */}
							{/* 'or use your account' 문구 삭제 */}
							<input
								type='text'
								placeholder='ID'
								className={styles.input}
								value={signInId}
								onChange={handleIdInput(setSignInId)}
								inputMode='numeric'
								pattern='[0-9]*'
								autoComplete='off'
							/>
							<input
								type='password'
								placeholder='Password'
								className={styles.input}
								value={signInPw}
								onChange={(e) => setSignInPw(e.target.value)}
							/>
							<button
								className={styles.form_btn}
								type='submit'
								onClick={() => alert('로그인 버튼 클릭됨')}
							>
								Sign In
							</button>
							{loginError && (
								<div style={{ color: 'red', marginTop: 8 }}>{loginError}</div>
							)}
						</form>
					</div>
					<div className={styles['overlay-container']}>
						<div className={styles['overlay-left']}>
							<h1>Welcome Back</h1>
							<p>
								To keep connected with us please login with your personal info
							</p>
							<button
								id='signIn'
								className={styles.overlay_btn}
								onClick={handleSignInClick}
								type='button'
							>
								Sign In
							</button>
						</div>
						<div className={styles['overlay-right']}>
							<img
								src='/logo_bist.png'
								alt='Buttle Information Systems Logo'
								style={{ width: 180, marginBottom: 16 }}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
