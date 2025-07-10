import { NextRequest, NextResponse } from 'next/server'

// GW 인증 응답 타입
interface GWAuthResponse {
	jsonMessage: {
		message: string
		result: 'success' | 'fail'
		message_cd: string
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { empNo, password } = body

		// 입력 검증
		if (!empNo || !password) {
			return NextResponse.json(
				{ success: false, message: '사원번호와 비밀번호를 입력해주세요.' },
				{ status: 400 }
			)
		}

		// GW 시스템 인증 요청
		const gwUrl = 'https://gw.buttle.co.kr/sms/emp.common.do?command=ajaxLogin'

		const formData = new URLSearchParams()
		formData.append('command', 'login')
		formData.append('lang', 'kor')
		formData.append('emp_no', empNo)
		formData.append('passwd', password)

		const gwResponse = await fetch(gwUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString(),
		})

		if (!gwResponse.ok) {
			return NextResponse.json(
				{ success: false, message: 'GW 시스템 연결에 실패했습니다.' },
				{ status: 500 }
			)
		}

		const gwData: GWAuthResponse = await gwResponse.json()
		const { result, message } = gwData.jsonMessage

		// GW 인증 실패
		if (result !== 'success') {
			return NextResponse.json(
				{ success: false, message: message || '인증에 실패했습니다.' },
				{ status: 401 }
			)
		}

		// GW 인증 성공 - 사용자 정보 조회 (실제로는 DB에서 조회)
		// TODO: 실제 DB 연동 시 Stored Procedure 호출
		const user = {
			userId: empNo,
			empNo: empNo,
			name: '사용자', // 실제로는 DB에서 조회
			email: `${empNo}@buttle.co.kr`,
			department: '부서', // 실제로는 DB에서 조회
			position: '직급', // 실제로는 DB에서 조회
			role: 'USER',
			permissions: ['read', 'write'],
			lastLoginAt: new Date().toISOString(),
		}

		// 세션 쿠키 설정
		const response = NextResponse.json({
			success: true,
			message: '로그인 성공',
			user,
			token: 'gw-token-' + Date.now(),
		})

		// 쿠키 설정
		response.cookies.set('session', 'gw-session-' + empNo, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7일
		})

		return response
	} catch (error) {
		console.error('로그인 API 오류:', error)
		return NextResponse.json(
			{ success: false, message: '서버 오류가 발생했습니다.' },
			{ status: 500 }
		)
	}
}
