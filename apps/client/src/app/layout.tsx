'use client'
import './globals.css'
import { usePathname } from 'next/navigation'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const isAuthPage =
		pathname.startsWith('/signin') || pathname.startsWith('/signup')

	return (
		<html lang='ko'>
			<body
				className={isAuthPage ? '' : 'min-h-screen h-screen overflow-hidden'}
			>
				{children}
			</body>
		</html>
	)
}
