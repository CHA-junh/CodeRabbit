'use client'

import React from 'react'
import AuthGuard from '@/modules/auth/components/AuthGuard'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export default function DASH0001M00() {
	const { user, logout } = useAuth()

	return (
		<AuthGuard>
			<div className='min-h-screen bg-gray-50'>
				{/* 헤더 */}
				<header className='bg-white shadow'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='flex justify-between items-center py-6'>
							<div>
								<h1 className='text-3xl font-bold text-gray-900'>
									BIST_NEW 대시보드
								</h1>
								<p className='text-gray-600'>비즈니스 인텔리전스 시스템</p>
							</div>

							<div className='flex items-center space-x-4'>
								<div className='text-right'>
									<p className='text-sm font-medium text-gray-900'>
										{user?.name}
									</p>
									<p className='text-sm text-gray-500'>
										{user?.department} - {user?.position}
									</p>
								</div>
								<button
									onClick={logout}
									className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
								>
									로그아웃
								</button>
							</div>
						</div>
					</div>
				</header>

				{/* 메인 컨텐츠 */}
				<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
					<div className='px-4 py-6 sm:px-0'>{/* ... 이하 동일 ... */}</div>
				</main>
			</div>
		</AuthGuard>
	)
}
// ... 이하 동일 ...
