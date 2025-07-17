'use client'

import React, { useState } from 'react'
import '../common/common.css'
import TopFrame from './TopFrame'
import LeftFrame from './LeftFrame'
import MenuTree from './MenuTree'
import Maintab from './Maintab'
import PageTitle from './PageTitle'
import ContentFrame from './ContentFrame'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import { getProgramType } from '../../utils/programType'

interface TabItem {
	programId: string
	title: string
	menuPath: string
}

export default function COM0000M00() {
	const { user, logout, isAuthenticated, session } = useAuth()
	// 메뉴트리 show/hide 상태
	const [showMenuTree, setShowMenuTree] = useState(true)
	// 메뉴트리 lock 상태
	const [menuTreeLocked, setMenuTreeLocked] = useState(false)
	// 탭 배열 및 활성 탭 상태 추가
	const [tabs, setTabs] = useState<TabItem[]>([])
	const [activeTab, setActiveTab] = useState<string>('')

	// 인증되지 않은 경우 로그인 페이지로 리다이렉트 (SSR 환경 고려 시 별도 처리 필요)
	if (!isAuthenticated) return null

	const handleMenuClick = (pgmId: string) => {
		// 클릭한 메뉴의 pgmId로 programList에서 찾기
		const program = (session.programList || []).find(
			(p: any) => p.PGM_ID === pgmId
		)
		console.log('programList에서 찾은 프로그램:', program)
		// 화면ID 타입 체크 (공통 유틸 사용)
		if (getProgramType(pgmId) !== 'main') return
		// 이미 열린 탭이면 포커스만 이동
		if (tabs.some((tab) => tab.programId === pgmId)) {
			setActiveTab(pgmId)
			return
		}
		if (!program) {
			console.warn(
				`[MenuTree 클릭] programList에 해당 PGM_ID(${pgmId})가 없습니다.`
			)
			alert('프로그램 정보가 존재하지 않습니다. 관리자에게 문의하세요.')
			return
		}
		const menuPath = program.LINK_PATH
			? program.LINK_PATH.replace(/\.tsx$/i, '')
			: ''
		const title = program.PGM_NM ? `${program.PGM_NM} [${pgmId}]` : pgmId
		// 로그로 데이터 추적
		console.log('[MenuTree 클릭]', { pgmId, program, menuPath, title })
		// 새 탭 추가
		const newTab: TabItem = { programId: pgmId, title, menuPath }
		setTabs((prev) => [...prev, newTab])
		setActiveTab(pgmId)
	}

	const handleTabClick = (programId: string) => setActiveTab(programId)
	const handleTabClose = (programId: string) => {
		setTabs((prev) => prev.filter((tab) => tab.programId !== programId))
		setActiveTab((prev) => {
			if (prev !== programId) return prev
			// 닫힌 탭이 활성 탭이면 마지막 탭으로 포커스
			const remain = tabs.filter((tab) => tab.programId !== programId)
			return remain.length > 0 ? remain[remain.length - 1].programId : ''
		})
	}

	// lock 상태가 true가 되면 메뉴트리 항상 고정
	if (menuTreeLocked && !showMenuTree) setShowMenuTree(true)

	// menuList key mapping (대문자->camelCase)
	const mappedMenuList = (session.menuList || []).map((menu) => ({
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
	}))
	console.log('mappedMenuList:', mappedMenuList)

	return (
		<div className='w-screen h-screen flex flex-col overflow-hidden'>
			{/* 상단 고정 헤더 */}
			<TopFrame
				userName={user?.userName || user?.name}
				userTeam={user?.deptNm || user?.department}
				userPosition={user?.dutyNm || user?.position}
			/>
			{/* 하단 본문 영역 */}
			<div className='flex flex-1 min-h-0 relative'>
				{/* 좌측 아이콘바: 고정 */}
				<div className='z-30'>
					<LeftFrame
						onMenuClick={() => setShowMenuTree((v) => !v)}
						onLogout={logout}
					/>
				</div>
				{/* 콘텐츠 라인: relative */}
				<div className='flex-1 flex relative'>
					{/* 메뉴트리: absolute, left-0 (콘텐츠 라인 기준) */}
					<div
						className={`absolute left-0 top-0 h-full w-[300px] bg-[#e5e5e5] overflow-y-auto border-r border-stone-300 transition-transform duration-300 z-20 ${
							showMenuTree ? 'translate-x-0' : '-translate-x-full'
						}`}
					>
						<MenuTree
							menuList={mappedMenuList}
							onMenuClick={(pgmId: string) => handleMenuClick(pgmId)}
							onLockChange={setMenuTreeLocked}
						/>
					</div>
					{/* 실제 콘텐츠: 메뉴트리 width만큼 margin-left */}
					<div
						className={`flex-1 flex flex-col transition-all duration-300 ${showMenuTree ? 'ml-[300px]' : 'ml-0'}`}
					>
						{tabs.length > 0 &&
							activeTab &&
							(() => {
								const currentTab = tabs.find(
									(tab) => tab.programId === activeTab
								)
								console.log('[COM0000M00] ContentFrame props:', {
									activeTab,
									tabs,
									menuPath: currentTab?.menuPath,
									title: currentTab?.title,
								})
								return null
							})()}
						{tabs.length > 0 && activeTab && (
							<>
								<Maintab
									tabs={tabs.map((tab) => ({
										id: tab.programId,
										title: tab.title,
									}))}
									activeTab={activeTab}
									onTabClick={handleTabClick}
									onTabClose={handleTabClose}
								/>
								<PageTitle
									title={
										tabs.find((tab) => tab.programId === activeTab)?.title || ''
									}
									programId={activeTab}
								/>
								<ContentFrame
									programId={activeTab}
									title={
										tabs.find((tab) => tab.programId === activeTab)?.title || ''
									}
									menuPath={
										tabs.find((tab) => tab.programId === activeTab)?.menuPath
									}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
