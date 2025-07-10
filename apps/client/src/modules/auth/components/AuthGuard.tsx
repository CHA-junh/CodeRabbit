'use client'

import React from 'react'
import { useAuth } from '../hooks/useAuth'

interface AuthGuardProps {
	children: React.ReactNode
	fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
	const { isAuthenticated, loading } = useAuth()

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='flex items-center space-x-2'>
					<svg
						className='animate-spin h-8 w-8 text-blue-600'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
						></circle>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						></path>
					</svg>
					<span className='text-gray-600'>인증 확인 중...</span>
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		if (fallback) {
			return <>{fallback}</>
		}

		// 기본 로그인 페이지로 리다이렉트
		window.location.href = '/login'
		return null
	}

	return <>{children}</>
}
