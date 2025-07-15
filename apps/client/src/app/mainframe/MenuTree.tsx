'use client'

import React, { useState } from 'react'
import '../common/common.css'

const menuData = [
	{ title: '업무관리', children: ['test', 'test', 'test', 'test', 'test'] },
	{ title: '프로젝트관리', children: ['test', 'test', 'test', 'test', 'test'] },
	{ title: '업무추진비관리', children: ['test', 'test', 'test'] },
	{
		title: '인사관리',
		children: ['사원관리', '개인정보수정', '프로파일관리'],
	},
	{
		title: '시스템관리',
		children: [
			'프로그램관리',
			'프로그램 그룹관리',
			'메뉴관리',
			'사용자역할관리',
			'프로그램 찾기',
			'메뉴미리보기',
		],
	},
]

const MenuTree: React.FC<{ onLockChange?: (locked: boolean) => void }> = ({
	onLockChange,
}) => {
	const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
		시스템관리: true,
	})
	const [selectedMenu, setSelectedMenu] = useState('프로그램관리')
	const [locked, setLocked] = useState(false) // 자물쇠 상태

	const toggleMenu = (title: string) => {
		setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
	}

	const handleLockClick = () => {
		setLocked((prev) => {
			const next = !prev
			if (onLockChange) onLockChange(next)
			return next
		})
	}

	// 전체 메뉴 최대화
	const expandAll = () => {
		const allOpen: { [key: string]: boolean } = {}
		menuData.forEach((menu) => {
			allOpen[menu.title] = true
		})
		setOpenMenus(allOpen)
	}
	// 전체 메뉴 최소화
	const collapseAll = () => {
		const allClosed: { [key: string]: boolean } = {}
		menuData.forEach((menu) => {
			allClosed[menu.title] = false
		})
		setOpenMenus(allClosed)
	}

	return (
		<div className='w-full h-full bg-white text-sm font-nanum flex flex-col'>
			{/* 상단: 타이틀 */}
			<div className='flex items-center gap-2 px-4 py-2 border-b border-stone-300 bg-gray-50 shrink-0'>
				<button
					type='button'
					className='p-0 m-0 bg-transparent border-none focus:outline-none'
					onClick={handleLockClick}
				>
					<img
						src={locked ? '/icon_lock.svg' : '/icon_unlock.svg'}
						alt={locked ? 'lock' : 'unlock'}
						className='w-4 h-4 select-none'
					/>
				</button>
				<span className='text-stone-700 text-base font-semibold m-1'>
					프로그램
				</span>
			</div>
			{/* 검색 영역 */}
			<div className='flex items-center justify-between px-2 py-1 border-b border-stone-200 bg-white shrink-0'>
				<input
					type='text'
					placeholder='메뉴명을 입력 해 주세요'
					className='w-full px-2 py-1 border border-stone-200 rounded text-sm text-stone-700 bg-white focus:outline-none focus:border-blue-400'
				/>
				<div className='w-auto h-4 flex gap-2 ml-2'>
					<img
						src='/icon_plus.svg'
						alt='plus'
						className='w-4 h-4 cursor-pointer'
						onClick={expandAll}
					/>
					<img
						src='/icon_minus.svg'
						alt='minus'
						className='w-4 h-4 cursor-pointer'
						onClick={collapseAll}
					/>
				</div>
			</div>
			{/* 메뉴 리스트: 스크롤 대상 영역 */}
			<div className='flex-1 overflow-y-auto py-1 space-y-1 scroll-area'>
				{menuData.map((menu) => (
					<div key={menu.title}>
						{/* 1차 메뉴 */}
						<div
							className='flex items-center gap-2 px-2 pt-[4px] pb-[6px] cursor-pointer rounded  border-b border-dashed text-stone-700 hover:text-[#0071DB]'
							onClick={() => toggleMenu(menu.title)}
						>
							<img
								src='/icon_plus.svg'
								alt='expand'
								className='w-4 h-4 pl-1 shrink-0'
							/>
							<span className='leading-none inline-block m-2'>
								{menu.title}
							</span>
						</div>
						{/* 2차 메뉴 */}
						{openMenus[menu.title] && menu.children.length > 0 && (
							<div className=' space-y-1'>
								{menu.children.map((sub) => (
									<div
										key={sub}
										className={`flex items-center gap-2 px-2 py-1 rounded pl-6 cursor-pointer ${
											selectedMenu === sub
												? 'text-[#0071DB] font-bold bg-blue-50'
												: 'text-stone-700 hover:text-[#0071DB]'
										}`}
										onClick={() => setSelectedMenu(sub)}
									>
										<img
											src='/icon_doc.svg'
											alt='menu'
											className='w-4 h-4 shrink-0'
										/>
										<span className='leading-none inline-block m-2'>{sub}</span>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default MenuTree
