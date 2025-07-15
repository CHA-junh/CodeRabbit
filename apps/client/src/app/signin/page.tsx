'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import COM0020M00 from '../com/COM0020M00'

export default function SigninPage() {
	const { isAuthenticated, loading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		// 로딩이 완료되고 이미 인증된 경우 대시보드로 리다이렉트
		if (!loading && isAuthenticated) {
			router.push('/mainframe')
		}
	}, [loading, isAuthenticated, router])

	// 로딩 중이거나 이미 인증된 경우 로딩 화면 표시
	if (loading || isAuthenticated) {
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
					<span className='text-gray-600'>로딩 중...</span>
				</div>
			</div>
		)
	}

	return <COM0020M00 />
}
