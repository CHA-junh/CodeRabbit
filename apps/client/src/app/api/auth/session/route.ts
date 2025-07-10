import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		// 세션 쿠키 확인
		const sessionCookie = request.cookies.get('session')

		if (!sessionCookie) {
			return NextResponse.json({ user: null }, { status: 401 })
		}

		// TODO: 실제 세션 검증 로직 구현
		// 현재는 임시로 하드코딩된 사용자 정보 반환
		const user = {
			userId: '1',
			empNo: '123456',
			name: '테스트 사용자',
			email: 'test@example.com',
			department: 'IT팀',
			position: '개발자',
			role: 'USER',
			permissions: ['read', 'write'],
			lastLoginAt: new Date().toISOString(),
		}

		return NextResponse.json({ user })
	} catch (error) {
		console.error('세션 확인 API 오류:', error)
		return NextResponse.json({ user: null }, { status: 500 })
	}
}
