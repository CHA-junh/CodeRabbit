'use client'

import React, { useRef, useState } from 'react'
import styles from './LoginForm.module.css'

export default function LoginForm() {
	const [rightPanelActive, setRightPanelActive] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const [signUpId, setSignUpId] = useState('')
	const [signInId, setSignInId] = useState('')
	const [signInPw, setSignInPw] = useState('')
	const [loginError, setLoginError] = useState<string | null>(null)

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
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ empNo: signInId, password: signInPw }),
				credentials: 'include',
			})
			const data = await response.json()
			if (data.success) {
				window.location.reload() // 로그인 성공 시 새로고침(또는 라우터 이동)
			} else {
				setLoginError(data.message || '로그인 실패')
			}
		} catch (err) {
			setLoginError('서버 오류')
		}
	}

	return (
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
						<button className={styles.form_btn}>Sign In</button>
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
						<img src="/logo_bist.png" alt="Buttle Information Systems Logo" style={{ width: 180, marginBottom: 16 }} />
					</div>
				</div>
			</div>
		</div>
	)
}
