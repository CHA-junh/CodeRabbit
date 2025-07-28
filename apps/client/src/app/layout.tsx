'use client'
import './globals.css'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { AuthProvider } from '../modules/auth/hooks/useAuth'
import { ToastProvider } from '../contexts/ToastContext'
import { getPageTitle, getSystemName } from '../utils/environment'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Script from 'next/script'

const queryClient = new QueryClient()

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const isAuthPage =
		pathname?.startsWith('/signin') || pathname?.startsWith('/signup')

	// 페이지별 타이틀 설정
	useEffect(() => {
		if (!pathname) return

		let pageTitle = ''

		if (pathname.startsWith('/signin')) {
			pageTitle = '로그인'
		} else if (pathname.startsWith('/mainframe')) {
			// 메인프레임은 시스템명만 표시
			document.title = getSystemName()
			return
		} else if (pathname === '/') {
			pageTitle = '홈'
		}

		document.title = getPageTitle(pageTitle)
	}, [pathname])

	return (
		<QueryClientProvider client={queryClient}>
			<html lang='ko'>
				<body
					className={isAuthPage ? '' : 'min-h-screen h-screen overflow-hidden'}
				>
					<AuthProvider>
						<ToastProvider>{children}</ToastProvider>
					</AuthProvider>
				</body>
			</html>
		</QueryClientProvider>
	)
}
