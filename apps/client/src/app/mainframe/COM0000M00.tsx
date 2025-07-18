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
import Toast from '../../components/Toast'

interface TabItem {
	programId: string
	title: string
	menuPath: string
}

export default function COM0000M00() {
	const { user, session, logout, isAuthenticated } = useAuth()
	// 메뉴트리 show/hide 상태 (기본값을 false로 변경)
	const [showMenuTree, setShowMenuTree] = useState(false)
	// 메뉴트리 lock 상태
	const [menuTreeLocked, setMenuTreeLocked] = useState(false)
	// 탭 배열 및 활성 탭 상태 추가
	const [tabs, setTabs] = useState<TabItem[]>([])
	const [activeTab, setActiveTab] = useState<string>('')
	// 토스트 상태
	const [toast, setToast] = useState<{
		message: string
		type: 'info' | 'warning' | 'error'
		isVisible: boolean
	}>({
		message: '',
		type: 'info',
		isVisible: false,
	})

	// 인증되지 않은 경우 아무것도 렌더링하지 않음 (상위 컴포넌트에서 처리)
	if (!isAuthenticated || !user) return null

	const handleMenuClick = (pgmId: string) => {
		console.log('[handleMenuClick] 호출됨, pgmId:', pgmId)
		// 클릭한 메뉴의 pgmId로 programList에서 찾기
		const program = (session.user?.programList || []).find(
			(p: any) => p.PGM_ID === pgmId
		)
		console.log('programList에서 찾은 프로그램:', program)
		// 화면ID 타입 체크 (공통 유틸 사용)
		if (getProgramType(pgmId, session.user?.programList) !== 'main') {
			console.log('[handleMenuClick] getProgramType이 main이 아님, return')
			return
		}
		// 이미 열린 탭이면 포커스만 이동
		if (tabs.some((tab) => tab.programId === pgmId)) {
			console.log('[handleMenuClick] 이미 열린 탭, setActiveTab 후 return')
			setActiveTab(pgmId)
			return
		}

		// 탭 개수 제한 체크 (5개)
		if (tabs.length >= 5) {
			setToast({
				message:
					'최대 5개의 화면만 열 수 있습니다. 다른 화면을 닫고 다시 시도해주세요.',
				type: 'warning',
				isVisible: true,
			})
			return
		}

		if (!program) {
			console.log('[handleMenuClick] program이 없음, return')
			// 경고/alert
			return
		}
		const menuPath = program.LINK_PATH
			? program.LINK_PATH.replace(/\.tsx$/i, '')
			: ''
		const title = program.PGM_NM ? program.PGM_NM : pgmId
		// 로그로 데이터 추적
		console.log('[MenuTree 클릭]', { pgmId, program, menuPath, title })
		console.log('[handleMenuClick] tabs(before):', tabs)
		// 새 탭 추가
		const newTab: TabItem = { programId: pgmId, title, menuPath }
		setTabs((prev) => {
			const next = [...prev, newTab]
			setTimeout(() => {
				console.log('[handleMenuClick] tabs(after, async):', next)
			}, 0)
			return next
		})
		// 자물쇠가 잠겨있지 않으면 메뉴 영역 즉시 닫기
		if (!menuTreeLocked) {
			setShowMenuTree(false)
		}

		setActiveTab(pgmId)

		setTimeout(() => {
			console.log('[handleMenuClick] setActiveTab(async):', pgmId)
		}, 0)
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

	// 로그아웃 핸들러
	const handleLogout = async () => {
		console.log('🚪 로그아웃 시작')
		await logout()
	}

	// lock 상태가 true가 되면 메뉴트리 항상 고정
	if (menuTreeLocked && !showMenuTree) setShowMenuTree(true)

	// 자물쇠 상태 변경 핸들러
	const handleLockChange = (locked: boolean) => {
		setMenuTreeLocked(locked)
	}

	// menuList key mapping (대문자->camelCase)
	const mappedMenuList = (session.user?.menuList || []).map((menu: any) => ({
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
			{/* 토스트 알림 */}
			<Toast
				message={toast.message}
				type={toast.type}
				isVisible={toast.isVisible}
				onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
			/>
			{/* 상단 고정 헤더 */}
			<TopFrame
				userName={user?.name}
				userTeam={user?.department}
				userPosition={user?.position}
				userEmpNo={user?.empNo}
			/>
			{/* 하단 본문 영역 */}
			<div className='flex flex-1 min-h-0 relative'>
				{/* 좌측 아이콘바: 고정 */}
				<div className='z-30'>
					<LeftFrame
						onMenuClick={() => setShowMenuTree((v) => !v)}
						onLogout={handleLogout}
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
							onLockChange={handleLockChange}
						/>
					</div>
					{/* 실제 콘텐츠: 메뉴트리 width만큼 margin-left */}
					<div
						className={`flex-1 flex flex-col transition-all duration-300 ${showMenuTree ? 'ml-[300px]' : 'ml-0'}`}
					>
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
									onClose={() => handleTabClose(activeTab)}
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
