'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

type NavShortcutProps = { icon: string; label: string }
function NavShortcut({ icon, label }: NavShortcutProps) {
	return (
		<button className='flex items-center w-full h-12 mb-2 px-3 bg-[#f5faff] hover:bg-blue-100 rounded-lg shadow transition border border-blue-200 text-blue-700'>
			<span className='text-2xl mr-2 flex-shrink-0'>{icon}</span>
			<span className='text-sm font-medium truncate hidden sm:inline'>
				{label}
			</span>
		</button>
	)
}

export default function SideMenu() {
	const [menuOpen, setMenuOpen] = useState(false)
	const router = useRouter()

	const handleLogout = async () => {
		console.log('로그아웃 버튼 클릭됨')
		const res = await fetch('/api/auth/logout', { method: 'POST' })
		const data = await res.json()
		console.log('로그아웃 API 응답:', data)
		window.location.href = '/signin'
	}

	return (
		<div className='h-full flex flex-row relative z-10'>
			{/* 좌측 고정 바로가기 영역 */}
			<aside className='w-28 flex flex-col justify-between items-center py-4 px-0 border-r border-blue-100 h-full transition-all duration-300 bg-[#f5faff] text-blue-500'>
				<div className='w-full flex flex-col items-center'>
					{/* 메뉴 버튼 */}
					<button
						className='flex items-center w-full h-12 mb-6 px-3 bg-[#f5faff] hover:bg-blue-100 rounded-lg shadow transition border border-blue-200 text-blue-700'
						onClick={() => setMenuOpen((v) => !v)}
						aria-label='메뉴 열기'
					>
						<span className='text-2xl mr-2 flex-shrink-0'>☰</span>
						<span className='text-sm font-medium truncate hidden sm:inline'>
							메뉴
						</span>
					</button>
					{/* 바로가기 버튼들 */}
					<NavShortcut icon='📁' label='사업관리' />
					<NavShortcut icon='📊' label='프로젝트' />
					<NavShortcut icon='💸' label='추진비' />
					<NavShortcut icon='👥' label='인사관리' />
					<NavShortcut icon='⚙️' label='시스템' />
				</div>
				{/* 하단 로그아웃 */}
				<div className='w-full flex justify-center mb-2'>
					<button
						className='flex items-center w-full h-12 px-3 bg-[#f5faff] hover:bg-blue-100 rounded-lg shadow transition border border-blue-200 text-blue-700'
						onClick={handleLogout}
					>
						<span className='text-2xl mr-2 flex-shrink-0'>🚪</span>
						<span className='text-sm font-medium truncate hidden sm:inline'>
							로그아웃
						</span>
					</button>
				</div>
			</aside>
			{/* 슬라이드 메뉴 (좌측 바로가기 옆에 등장, flex row의 두 번째 자식) */}
			<div
				className={`h-full transition-all duration-300 ease-in-out ${menuOpen ? 'w-80' : 'w-0'} overflow-hidden bg-white shadow-xl border-r border-blue-200`}
				style={{ minWidth: menuOpen ? 320 : 0 }}
			>
				<div
					className={`flex flex-col h-full p-6 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}
				>
					<div className='flex items-center mb-4'>
						<input
							className='flex-1 px-2 py-1 rounded border border-blue-400 text-gray-800 text-sm'
							placeholder='메뉴명을 입력하세요'
						/>
						<button
							className='ml-2 text-lg text-gray-500 hover:text-blue-700'
							onClick={() => setMenuOpen(false)}
						>
							×
						</button>
					</div>
					<div className='flex-1 overflow-y-auto'>
						<div className='text-blue-900 font-bold mb-2'>프로그램 목록</div>
						{/* 임시 더미 메뉴 트리 */}
						<ul className='space-y-2'>
							<li className='text-gray-700 hover:bg-blue-50 rounded px-2 py-1 cursor-pointer'>
								업무관리
							</li>
							<li className='text-gray-700 hover:bg-blue-50 rounded px-2 py-1 cursor-pointer'>
								프로젝트관리
							</li>
							<li className='text-gray-700 hover:bg-blue-50 rounded px-2 py-1 cursor-pointer'>
								추진비관리
							</li>
							<li className='text-gray-700 hover:bg-blue-50 rounded px-2 py-1 cursor-pointer'>
								인사관리
							</li>
							<li className='text-gray-700 hover:bg-blue-50 rounded px-2 py-1 cursor-pointer'>
								시스템관리
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
