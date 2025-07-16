'use client'

import React, { useState, useEffect } from 'react'
import '../common/common.css'

interface MenuNode {
	menuSeq: string | number
	menuDspNm: string
	pgmId: string | null
	menuShpDvcd: string
	hgrkMenuSeq: string | number
	flag: number
	menuUseYn: string
	menuLvl: number
	mapTitle: string
	menuPath: string
	children?: MenuNode[]
}

// 평면 배열을 트리 구조로 변환하는 함수 추가
function buildMenuTree(flatMenus: MenuNode[]): MenuNode[] {
	const menuMap: { [key: string]: MenuNode } = {}
	const tree: MenuNode[] = []
	// menu 객체를 복사해서 children을 새로 할당
	const menus = flatMenus.map((menu) => ({ ...menu, children: [] }))
	menus.forEach((menu) => {
		menuMap[String(menu.menuSeq)] = menu
	})
	menus.forEach((menu) => {
		const parentKey = String(menu.hgrkMenuSeq)
		if (parentKey !== '0' && menuMap[parentKey]) {
			menuMap[parentKey].children!.push(menu)
		} else {
			tree.push(menu)
		}
	})
	return tree
}

// API 응답을 camelCase로 변환하는 함수 추가
function toCamelCaseMenu(menu: any): MenuNode {
	return {
		menuSeq: menu.MENU_SEQ,
		menuDspNm: menu.MENU_DSP_NM,
		pgmId: menu.PGM_ID,
		menuShpDvcd: menu.MENU_SHP_DVCD,
		hgrkMenuSeq: menu.HGRK_MENU_SEQ,
		flag: menu.FLAG,
		menuUseYn: menu.MENU_USE_YN,
		menuLvl: menu.MENU_LVL,
		mapTitle: menu.MAP_TITLE,
		menuPath: menu.MENU_PATH,
		children: [],
	}
}

// 한글 초성 추출 함수
function getInitials(str: string) {
	const CHO = [
		'ㄱ',
		'ㄲ',
		'ㄴ',
		'ㄷ',
		'ㄸ',
		'ㄹ',
		'ㅁ',
		'ㅂ',
		'ㅃ',
		'ㅅ',
		'ㅆ',
		'ㅇ',
		'ㅈ',
		'ㅉ',
		'ㅊ',
		'ㅋ',
		'ㅌ',
		'ㅍ',
		'ㅎ',
	]
	return Array.from(str)
		.map((char) => {
			const code = char.charCodeAt(0) - 44032
			if (code >= 0 && code <= 11171) {
				return CHO[Math.floor(code / 588)]
			}
			return char
		})
		.join('')
}

const MenuTree: React.FC<{ onLockChange?: (locked: boolean) => void }> = ({
	onLockChange,
}) => {
	const [menuTree, setMenuTree] = useState<MenuNode[]>([])
	const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
	const [selectedMenu, setSelectedMenu] = useState<string>('')
	const [locked, setLocked] = useState(false)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const [searching, setSearching] = useState(false)
	const [allMenus, setAllMenus] = useState<MenuNode[]>([])

	// 최초 메뉴 로딩 시 allMenus도 세팅
	useEffect(() => {
		const fetchMenuTree = async () => {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch('http://localhost:8080/api/menu/tree', {
					credentials: 'include',
				})
				const data = await res.json()
				if (data.success) {
					const menuArr = Array.isArray(data.data) ? data.data : [data.data]
					const camelMenus = menuArr.map(toCamelCaseMenu)
					setAllMenus(camelMenus) // 전체 메뉴 저장
					const isFlat = camelMenus.every(
						(item: any) => !item.children || item.children.length === 0
					)
					const tree = isFlat ? buildMenuTree(camelMenus) : camelMenus
					setMenuTree(tree)
				} else {
					setError(data.message || '메뉴 트리 로딩 실패')
				}
			} catch (e: any) {
				setError(e.message || '메뉴 트리 로딩 오류')
			} finally {
				setLoading(false)
			}
		}
		fetchMenuTree()
	}, [])

	// toggleMenu 함수 수정
	const toggleMenu = (menuSeq: string | number) => {
		setOpenMenus((prev) => ({
			...prev,
			[String(menuSeq)]: !prev[String(menuSeq)],
		}))
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
		const traverse = (nodes: MenuNode[]) => {
			nodes.forEach((node) => {
				allOpen[node.menuSeq] = true
				if (node.children) traverse(node.children)
			})
		}
		traverse(menuTree)
		setOpenMenus(allOpen)
	}
	// 전체 메뉴 최소화
	const collapseAll = () => {
		setOpenMenus({})
	}

	// handleSearchChange: API 호출 없이 allMenus에서 직접 필터링
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearch(value)
		if (value.length >= 2) {
			setSearching(true)
			setLoading(true)
			setError(null)
			const keywordInitials = getInitials(value)
			const filtered = allMenus.filter((menu: any) => {
				const name = menu.menuDspNm || ''
				const initials = getInitials(name)
				return (
					name.includes(value) ||
					initials.includes(keywordInitials) ||
					name.replace(/\s/g, '').includes(value.replace(/\s/g, ''))
				)
			})
			const isFlat = filtered.every(
				(item: any) => !item.children || item.children.length === 0
			)
			const tree = isFlat ? buildMenuTree(filtered) : filtered
			setMenuTree(tree)
			setLoading(false)
		} else if (value.length === 0) {
			// 검색어가 지워지면 전체 트리 복원
			setSearching(false)
			setLoading(true)
			setError(null)
			const isFlat = allMenus.every(
				(item: any) => !item.children || item.children.length === 0
			)
			const tree = isFlat ? buildMenuTree(allMenus) : allMenus
			setMenuTree(tree)
			setLoading(false)
		}
	}

	// 트리 렌더링 함수
	const renderTree = (nodes: MenuNode[]) => {
		console.log('renderTree nodes:', nodes)
		return Array.isArray(nodes)
			? nodes
					.filter((node) => node.menuSeq !== undefined && node.menuSeq !== null)
					.map((node) => (
						<div key={`${node.menuPath || ''}-${node.menuSeq}`}>
							{/* 1차/상위 메뉴 */}
							<div
								className='flex items-center gap-2 px-2 pt-[4px] pb-[6px] cursor-pointer rounded border-b border-dashed text-stone-700 hover:text-[#0071DB]'
								onClick={() => toggleMenu(node.menuSeq)}
							>
								{node.children && node.children.length > 0 && (
									<img
										src='/icon_plus.svg'
										alt='expand'
										className='w-4 h-4 pl-1 shrink-0'
									/>
								)}
								<span className='leading-none inline-block m-2'>
									{node.menuDspNm}
								</span>
							</div>
							{/* 하위 메뉴 */}
							{openMenus[String(node.menuSeq)] &&
								Array.isArray(node.children) &&
								node.children.length > 0 && (
									<div className='space-y-1 pl-4'>
										{renderTree(node.children)}
									</div>
								)}
						</div>
					))
			: null
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
					value={search}
					onChange={handleSearchChange}
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
				{loading ? (
					<div className='text-center text-gray-400 py-8'>메뉴 로딩 중...</div>
				) : error ? (
					<div className='text-center text-red-500 py-8'>{error}</div>
				) : menuTree.length === 0 ? (
					<div className='text-center text-gray-400 py-8'>메뉴가 없습니다.</div>
				) : (
					renderTree(menuTree)
				)}
			</div>
		</div>
	)
}

export default MenuTree
