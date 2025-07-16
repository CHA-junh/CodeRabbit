'use client'

import React, { useState } from 'react'
import '../common/common.css'
import TopFrame from './TopFrame'
import LeftFrame from './LeftFrame'
import MenuTree from './MenuTree'
import MainTab from './MainTab'
import PageTitle from './PageTitle'
import { useAuth } from '../../modules/auth/hooks/useAuth'

const ContentFrame = ({ selectedTab }: { selectedTab: string }) => (
	<div className='flex-1 overflow-auto p-4 bg-white'>
		ContentFrame: {selectedTab}
	</div>
)

export default function COM0000M00() {
	const { user, logout, isAuthenticated } = useAuth()
	// 메뉴트리 show/hide 상태
	const [showMenuTree, setShowMenuTree] = useState(true)
	// 메뉴트리 lock 상태
	const [menuTreeLocked, setMenuTreeLocked] = useState(false)
	const [selectedTab, setSelectedTab] = useState({
		title: '개인정보수정',
		programId: 'PSM0010M00',
	})

	// 인증되지 않은 경우 로그인 페이지로 리다이렉트 (SSR 환경 고려 시 별도 처리 필요)
	if (!isAuthenticated) return null

	// 메뉴 버튼 클릭 핸들러: lock 상태면 무시
	const handleMenuClick = () => {
		if (!menuTreeLocked) setShowMenuTree((prev) => !prev)
	}

	// lock 상태가 true가 되면 메뉴트리 항상 고정
	if (menuTreeLocked && !showMenuTree) setShowMenuTree(true)

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
					<LeftFrame onMenuClick={handleMenuClick} onLogout={logout} />
				</div>
				{/* 콘텐츠 라인: relative */}
				<div className='flex-1 flex relative'>
					{/* 메뉴트리: absolute, left-0 (콘텐츠 라인 기준) */}
					<div
						className={`absolute left-0 top-0 h-full w-[300px] bg-[#e5e5e5] overflow-y-auto border-r border-stone-300 transition-transform duration-300 z-20 ${
							showMenuTree ? 'translate-x-0' : '-translate-x-full'
						}`}
					>
						<MenuTree onLockChange={setMenuTreeLocked} />
					</div>
					{/* 실제 콘텐츠: 메뉴트리 width만큼 margin-left */}
					<div
						className={`flex-1 flex flex-col transition-all duration-300 ${showMenuTree ? 'ml-[300px]' : 'ml-0'}`}
					>
						<MainTab />
						<PageTitle
							title={selectedTab.title}
							programId={selectedTab.programId}
						/>
						<ContentFrame selectedTab={selectedTab.title} />
					</div>
				</div>
			</div>
		</div>
	)
}
