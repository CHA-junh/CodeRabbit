'use client'

import React, { useState, useEffect } from 'react'
import '@/app/common/common.css'

export default function TestLoginPopup() {
	const [userId, setUserId] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	// API URL 환경변수 기반 설정
	const apiUrl =
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/test-login`
			: '/api/auth/test-login'

	// 숫자만 입력되도록 처리
	const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '')
		setUserId(value)
	}

	// 테스트 로그인 처리
	const handleTestLogin = async () => {
		if (!userId) {
			setError('테스트 사용자ID를 입력해주세요.')
			// 3초 후 에러 메시지 자동 제거
			setTimeout(() => setError(null), 3000)
			return
		}

		setLoading(true)
		setError(null)
		setSuccess(null)

		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ empNo: userId }),
			})

			const data = await response.json()

			if (data.success) {
				// 부모창 리프레시 후 팝업 닫기
				if (window.opener) {
					window.opener.location.reload()
				}
				window.close()
			} else {
				setError(data.message || '테스트 로그인에 실패했습니다.')
				// 3초 후 에러 메시지 자동 제거
				setTimeout(() => setError(null), 3000)
			}
		} catch (err) {
			setError('서버 연결에 실패했습니다.')
			console.error('Test login error:', err)
			// 3초 후 에러 메시지 자동 제거
			setTimeout(() => setError(null), 3000)
		} finally {
			setLoading(false)
		}
	}

	// 엔터키 처리
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleTestLogin()
		}
	}

	// ESC 키로 팝업 닫기
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				window.close()
			}
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [])

	return (
		<div className='popup-wrapper'>
			{/* 상단 헤더 */}
			<div className='popup-header'>
				<h3 className='popup-title'>테스트 로그인 화면</h3>
				<button
					className='popup-close'
					type='button'
					onClick={() => window.close()}
				>
					×
				</button>
			</div>

			{/* 본문 */}
			<div className='popup-body text-left'>
				<table className='clear-table w-full mb-4'>
					<tbody>
						<tr className='clear-tr'>
							<th className='clear-th w-[110px]'>테스트 사용자ID</th>
							<td className='clear-td min-w-64'>
								<div className='flex items-center gap-2'>
									<input
										id='testUserId'
										type='text'
										value={userId}
										onChange={handleUserIdChange}
										onKeyPress={handleKeyPress}
										className='input-base input-default w-[120px] text-center'
										placeholder='사원번호'
										autoFocus
									/>
									<button
										type='button'
										className='btn-base btn-act'
										onClick={handleTestLogin}
										disabled={loading}
									>
										{loading ? '처리중...' : '확인'}
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				{/* 에러 메시지 토스트 */}
				{error && (
					<div className='fixed top-4 right-4 z-50'>
						<div className='bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center max-w-xs'>
							<span className='mr-2 text-sm'>⚠</span>
							<span className='text-sm'>{error}</span>
						</div>
					</div>
				)}

				{/* 성공 메시지 토스트 */}
				{success && (
					<div className='fixed top-4 right-4 z-50'>
						<div className='bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center max-w-xs'>
							<span className='mr-2 text-sm'>✓</span>
							<span className='text-sm'>{success}</span>
						</div>
					</div>
				)}

				{/* 안내 문구 */}
				<div className='px-3'>
					<p className='text-sm text-blue-600 leading-relaxed'>
						테스트를 위한 화면 입니다.
					</p>
					<p className='text-sm text-blue-600 leading-relaxed'>
						테스트 하고자 하는 사용자 ID를 입력하고 확인 버튼을 클릭하세요.
					</p>
				</div>
			</div>
		</div>
	)
}
