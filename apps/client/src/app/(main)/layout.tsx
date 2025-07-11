import React from 'react'
import SideMenu from '../../components/SideMenu'
import '../globals.css'
import TopBar from './TopBar'
import AuthGuard from '../../modules/auth/components/AuthGuard'

function TabList() {
	return (
		<div className='h-10 bg-white border-b border-blue-200 flex items-center px-4 space-x-2'>
			<div className='px-3 py-1 bg-blue-100 text-blue-900 rounded-t border border-b-0 font-semibold flex items-center'>
				대시보드
				<button className='ml-2 text-blue-400 hover:text-blue-700'>×</button>
			</div>
			{/* 추가 탭은 여기에 */}
		</div>
	)
}

function TabContent() {
	return (
		<div className='flex-1 p-6 bg-gray-50 rounded-b shadow-inner border border-blue-100 border-t-0 overflow-auto'>
			<div className='text-lg font-bold mb-4'>
				대시보드(첫 화면) 컨텐츠 영역
			</div>
			<div className='bg-white rounded shadow p-6 min-h-[300px]'>
				여기에 업무화면이 표시됩니다.
			</div>
		</div>
	)
}

export default function MainLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<AuthGuard>
			<div className='flex flex-col min-h-screen h-screen'>
				<TopBar />
				<div className='flex flex-1 h-full min-h-0'>
					<SideMenu />
					<div className='flex-1 flex flex-col h-full min-h-0'>
						<TabList />
						<TabContent />
					</div>
				</div>
			</div>
		</AuthGuard>
	)
}
