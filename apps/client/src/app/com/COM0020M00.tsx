'use client'

import React, { useState } from 'react'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import { LoginRequest } from '../../modules/auth/types'

export default function COM0020M00() {
	const { login, loading } = useAuth()
	const [empNo, setEmpNo] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)

	// 숫자만 입력되도록 처리
	const handleEmpNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '')
		setEmpNo(value)
	}

	// 로그인 처리
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!empNo || !password) {
			setError('사원번호와 비밀번호를 입력해주세요.')
			return
		}

		try {
			const loginData: LoginRequest = {
				empNo,
				password,
			}

			const result = await login(loginData)

			if (!result.success) {
				setError(result.message || '로그인에 실패했습니다.')
			}
		} catch (err) {
			setError('로그인 중 오류가 발생했습니다.')
		}
	}

	return (
		<div
			className='min-h-screen w-full flex items-center justify-center bg-gray-100 px-4'
			style={{ backgroundImage: `url('/login_bg.png')` }}
		>
			<div className='w-full max-w-5xl bg-gradient-to-b from-sky-50 to-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row'>
				{/* 이미지 영역 */}
				<div className='relative w-full md:w-1/2 h-[300px] md:h-auto'>
					{/* 배경 이미지 */}
					<img
						src='/login_notebook.png'
						alt='Login'
						className='w-full h-full object-cover md:rounded-l-3xl'
					/>

					{/* 로고 이미지 (좌측 상단 고정) */}
					<img
						src='/logo.svg'
						alt='Logo'
						className='absolute top-4 left-4 max-w-md h-auto'
					/>
				</div>

				{/* 로그인 영역 */}
				<div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white'>
					<h2 className='text-3xl md:text-5xl font-extrabold text-gray-800 mb-10'>
						Sign in
					</h2>

					<form onSubmit={handleLogin}>
						{/* ID 입력 */}
						<div className='mb-6'>
							<label className='block text-gray-800 text-lg font-bold mb-2'>
								ID
							</label>
							<input
								type='text'
								placeholder='Employee number'
								value={empNo}
								onChange={handleEmpNoChange}
								inputMode='numeric'
								pattern='[0-9]*'
								autoComplete='off'
								className='w-full px-6 py-3 rounded-full bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
							/>
						</div>

						{/* Password 입력 */}
						<div className='mb-4'>
							<label className='block text-gray-800 text-lg font-bold mb-2'>
								Password
							</label>
							<input
								type='password'
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='w-full px-6 py-3 rounded-full bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
							/>
						</div>

						{/* 에러 메시지 */}
						{error && (
							<div className='mb-4 text-red-600 text-sm font-medium'>
								{error}
							</div>
						)}

						{/* Forgot password */}
						<div className='text-right mb-6'>
							<a href='#' className='text-sm text-gray-500 hover:underline'>
								Forget password?
							</a>
						</div>

						{/* Login 버튼 */}
						<button
							type='submit'
							disabled={loading}
							className='w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold py-3 rounded-full text-lg transition duration-200'
						>
							{loading ? '로그인 중...' : 'Login'}
						</button>
					</form>

					{/* 안내 문구 */}
					<p className='text-sm text-gray-600 mt-6'>
						ID는 사원번호이며, 비밀번호는 웹메일 비밀번호입니다.
					</p>
				</div>
			</div>

			{/* 하단 안내 */}
			<div className='absolute bottom-4 text-center w-full text-gray-700 text-sm'>
				본 시스템은 부뜰종합전산시스템입니다. 문의사항은 경영지원본부를 이용해
				주십시오.
			</div>
		</div>
	)
}
