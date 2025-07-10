import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'BIST_NEW - Business Intelligence System',
	description: '비즈니스 인텔리전스 시스템',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='ko'>
			<body className={inter.className}>{children}</body>
		</html>
	)
}
