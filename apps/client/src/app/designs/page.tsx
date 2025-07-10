'use client'

import React from 'react'

export default function DesignsPage() {
	return (
		<div className='min-h-screen bg-gray-50 p-8'>
			<div className='max-w-7xl mx-auto'>
				{/* 헤더 */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						🎨 디자인 시안 갤러리
					</h1>
					<p className='text-gray-600'>
						디자이너가 업로드한 시안들을 확인할 수 있습니다.
					</p>
				</div>

				{/* 시안 그리드 */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{/* 시안 카드 예시 */}
					<div className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center'>
							<span className='text-white text-lg font-semibold'>시안 1</span>
						</div>
						<div className='p-4'>
							<h3 className='font-semibold text-gray-900 mb-2'>
								로그인 페이지
							</h3>
							<p className='text-sm text-gray-600 mb-3'>
								새로운 로그인 페이지 디자인 시안입니다.
							</p>
							<div className='flex justify-between items-center'>
								<span className='text-xs text-gray-500'>2024.01.15</span>
								<button className='px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700'>
									상세보기
								</button>
							</div>
						</div>
					</div>

					<div className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center'>
							<span className='text-white text-lg font-semibold'>시안 2</span>
						</div>
						<div className='p-4'>
							<h3 className='font-semibold text-gray-900 mb-2'>대시보드</h3>
							<p className='text-sm text-gray-600 mb-3'>
								메인 대시보드 레이아웃 시안입니다.
							</p>
							<div className='flex justify-between items-center'>
								<span className='text-xs text-gray-500'>2024.01.14</span>
								<button className='px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700'>
									상세보기
								</button>
							</div>
						</div>
					</div>

					<div className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center'>
							<span className='text-white text-lg font-semibold'>시안 3</span>
						</div>
						<div className='p-4'>
							<h3 className='font-semibold text-gray-900 mb-2'>사용자 관리</h3>
							<p className='text-sm text-gray-600 mb-3'>
								사용자 관리 페이지 디자인 시안입니다.
							</p>
							<div className='flex justify-between items-center'>
								<span className='text-xs text-gray-500'>2024.01.13</span>
								<button className='px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700'>
									상세보기
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* 새 시안 업로드 버튼 */}
				<div className='mt-8 text-center'>
					<button className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
						📤 새 시안 업로드
					</button>
				</div>
			</div>
		</div>
	)
}
