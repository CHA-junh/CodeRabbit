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

		// GW 인증 성공 - 서버에서 DB 연동 사용자 정보 조회
		const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
		console.log(`🔗 서버 요청 URL: ${serverUrl}/auth/login`)
		console.log(`📤 요청 데이터:`, { empNo, password })

		const requestBody = JSON.stringify({ empNo, password })
		console.log(`📤 요청 본문 (JSON):`, requestBody)

		const dbResponse = await fetch(`${serverUrl}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: requestBody,
		})

		console.log(`📥 서버 응답 상태: ${dbResponse.status}`)
		console.log(
			`📥 서버 응답 헤더:`,
			Object.fromEntries(dbResponse.headers.entries())
		)

		if (!dbResponse.ok) {
			console.error(`❌ 서버 응답 실패: ${dbResponse.status}`)
			const errorText = await dbResponse.text()
			console.error(`❌ 서버 응답 내용:`, errorText)
			return NextResponse.json(
				{ success: false, message: '사용자 정보 조회에 실패했습니다.' },
				{ status: 500 }
			)
		}

		const responseText = await dbResponse.text()
		console.log(`📥 서버 응답 원본 텍스트:`, responseText)

		let dbData
		try {
			dbData = JSON.parse(responseText)
			console.log(`📊 서버 응답 파싱된 데이터:`, dbData)
		} catch (parseError) {
			console.error(`❌ JSON 파싱 실패:`, parseError)
			console.error(`❌ 파싱 실패한 텍스트:`, responseText)
			return NextResponse.json(
				{ success: false, message: '서버 응답 파싱에 실패했습니다.' },
				{ status: 500 }
			)
		}

		if (!dbData.success) {
			console.error(`❌ 서버 응답 실패: ${dbData.message}`)
			return NextResponse.json(
				{ success: false, message: dbData.message },
				{ status: 401 }
			)
		}

		// DB에서 조회한 사용자 정보를 클라이언트 형식으로 변환
		const user = {
			userId: dbData.user.userId,
			empNo: dbData.user.userId,
			name: dbData.user.userName || '사용자',
			email: dbData.user.emailAddr || `${empNo}@buttle.co.kr`,
			department: dbData.user.deptNm || `부서(${dbData.user.deptCd})`,
			position: dbData.user.dutyNm || '직급',
			role: dbData.user.usrRoleId || 'USER',
			permissions: ['read', 'write'],
			lastLoginAt: new Date().toISOString(),
			// 추가 정보
			deptCd: dbData.user.deptCd,
			dutyDivCd: dbData.user.dutyDivCd,
			authCd: dbData.user.authCd,
		}

		// 서버에서 설정한 세션 쿠키를 그대로 사용
		const response = NextResponse.json({
			success: true,
			message: '로그인 성공',
			user,
		})

		// 서버 응답의 Set-Cookie 헤더를 클라이언트로 전달
		const setCookieHeader = dbResponse.headers.get('set-cookie')
		if (setCookieHeader) {
			response.headers.set('set-cookie', setCookieHeader)
		}

		return response
	} catch (error) {
		console.error('로그인 API 오류:', error)
		return NextResponse.json(
			{ success: false, message: '서버 오류가 발생했습니다.' },
			{ status: 500 }
		)
	}
}
