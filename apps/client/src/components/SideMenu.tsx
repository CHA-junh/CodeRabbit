'use client'
import React, { useState } from 'react'

export interface ProgramMenuItem {
	programId: string
	title: string
}

export interface MenuGroup {
	title: string
	children: ProgramMenuItem[]
}

type SideMenuProps = {
	menuData: MenuGroup[]
	onMenuClick?: (programId: string, title: string) => void
}

export default function SideMenu({ menuData, onMenuClick }: SideMenuProps) {
	const [menuOpen, setMenuOpen] = useState(false)
	const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
	const [selectedMenu, setSelectedMenu] = useState('')

	const toggleMenu = (title: string) => {
		setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
	}

	const handleLogout = async () => {
		console.log('로그아웃 버튼 클릭됨')
		const res = await fetch('http://localhost:8080/api/auth/logout', {
			method: 'POST',
		})
		const data = await res.json()
		console.log('로그아웃 API 응답:', data)
		window.location.href = '/signin'
	}

	function renderMenuItems(items: any[]) {
		return items.map((item) => {
			if (item.children && item.children.length > 0) {
				// 폴더/그룹 메뉴
				return (
					<div key={item.menuSeq}>
						<div
							className='flex items-center gap-2 px-2 pt-[4px] pb-[6px] cursor-pointer rounded border-b border-dashed text-stone-700 hover:text-[#0071DB]'
							onClick={() => toggleMenu(item.menuDspNm)}
						>
							<span className='leading-none inline-block m-2'>
								{item.menuDspNm}
							</span>
						</div>
						{openMenus[item.menuDspNm] && (
							<div className='pl-4'>{renderMenuItems(item.children)}</div>
						)}
					</div>
				)
			} else if (item.pgmId) {
				// 실제 업무화면 메뉴
				return (
					<div
						key={item.menuSeq}
						className={`flex items-center gap-2 px-2 py-1 rounded pl-6 cursor-pointer ${selectedMenu === item.pgmId ? 'text-[#0071DB] font-bold bg-blue-50' : 'text-stone-700 hover:text-[#0071DB]'}`}
						onClick={() => {
							setSelectedMenu(item.pgmId)
							console.log('SideMenu onMenuClick', item.pgmId, item.menuDspNm)
							onMenuClick && onMenuClick(item.pgmId, item.menuDspNm)
						}}
					>
						<span className='leading-none inline-block m-2'>
							{item.menuDspNm}
						</span>
					</div>
				)
			}
			return null
		})
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
			{/* 슬라이드 메뉴 */}
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
						{renderMenuItems(menuData)}
					</div>
				</div>
			</div>
		</div>
	)
}

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
