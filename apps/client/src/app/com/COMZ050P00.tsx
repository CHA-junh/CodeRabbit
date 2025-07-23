'use client'

import React, { useState, useEffect } from 'react'
import '@/app/common/common.css'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import { useSearchParams } from 'next/navigation'

/**
 * COMZ050P00 - (팝)사업명검색화면
 * 
 * 주요 기능:
 * - 사업명 검색 및 선택
 * - 진행상태별 필터링
 * - 연도별 사업 조회
 * - 부모창 데이터 전달
 * 
 * 연관 테이블:
 * - TBL_BSN_NO_INF (사업번호 정보)
 * - TBL_BSN_SCDC (사업품의서)
 */

// DB 컬럼명 기준 타입 정의
interface BusinessNameSearchResult {
	bsnNo: string
	bsnDiv: string
	bsnDivNm: string
	bsnNm: string
	ordPlc: string
	deptNo: string
	saleDiv: string
	saleDivNm: string
	bsnYr: string
	seqNo: string
	pgrsStDiv: string
	pgrsStDivNm: string
	bsnStrtDt: string
	bsnEndDt: string
	bizRepnm: string
	pmNm: string
	ctrDt: string
	pplsDeptNm: string
	pplsDeptCd: string
	pplsHqCd: string
	execDeptNm: string
	execDeptCd: string
	execHqCd: string
	rmk: string
	regDttm: string
	chngDttm: string
	chngrId: string
	[key: string]: any // 대소문자 혼용 대응
}

// 진행상태 코드 정의
const PGRS_STATES = [
	{ code: '001', label: '계획' },
	{ code: '002', label: '진행' },
	{ code: '003', label: '완료' },
	{ code: '004', label: '중단' },
	{ code: '005', label: '취소' },
]

// API URL 환경변수 기반 설정
const getApiUrl = () => {
	if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
		return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/business-name-search`
	}
	return '/api/business-name-search'
}

const getCurrentYear = () => new Date().getFullYear().toString()

const BusinessNameSearchPopup: React.FC = () => {
	// 쿼리스트링 파라미터 읽기
	const params = useSearchParams()
	const initialBsnNm = params?.get('bsnNm') || ''
	const mode = params?.get('mode') || ''

	// 상태
	const [checkedStates, setCheckedStates] = useState<string[]>(
		PGRS_STATES.map((s) => s.code)
	)
	const [allChecked, setAllChecked] = useState(true)
	const [startYear, setStartYear] = useState('ALL')
	const [yearList, setYearList] = useState<string[]>([])
	const [bsnNm, setBsnNm] = useState(initialBsnNm)
	const [searchKey, setSearchKey] = useState('')
	const [data, setData] = useState<BusinessNameSearchResult[]>([])
	const [loading, setLoading] = useState(false)
	const { session } = useAuth()
	const { showToast } = useToast()

	// 세션에서 로그인ID 가져오기 (우선순위: userId > empNo > name)
	const loginId =
		session.user?.userId || session.user?.empNo || session.user?.name || ''

	// mode별 진행상태 체크박스 제어(레거시 호환)
	useEffect(() => {
		if (!mode) return
		if (mode === 'plan') {
			setCheckedStates(['001', '002'])
			setAllChecked(false)
		} else if (mode === 'rsts') {
			setCheckedStates(['003', '004', '005'])
			setAllChecked(false)
		} else if (mode === 'mans') {
			setCheckedStates(['002', '003', '004', '005'])
			setAllChecked(false)
		} else {
			setCheckedStates(PGRS_STATES.map((s) => s.code))
			setAllChecked(true)
		}
	}, [mode])

	// 연도 콤보박스 데이터 (최근 10년 + ALL)
	useEffect(() => {
		const now = parseInt(getCurrentYear(), 10)
		const years = Array.from({ length: 10 }, (_, i) => (now - i).toString())
		setYearList(['ALL', ...years])
	}, [])

	// 모두선택 체크박스 핸들러
	const handleAllCheck = () => {
		if (allChecked) {
			setCheckedStates([])
			setAllChecked(false)
		} else {
			setCheckedStates(PGRS_STATES.map((s) => s.code))
			setAllChecked(true)
		}
	}

	// 개별 상태 체크박스 핸들러
	const handleStateCheck = (code: string) => {
		let next
		if (checkedStates.includes(code)) {
			next = checkedStates.filter((c) => c !== code)
		} else {
			next = [...checkedStates, code]
		}
		setCheckedStates(next)
		setAllChecked(next.length === PGRS_STATES.length)
	}

	// 연도 콤보박스 핸들러
	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStartYear(e.target.value)
	}

	// 사업명 입력 핸들러
	const handleBsnNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBsnNm(e.target.value)
	}

	// 엔터키 핸들러
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// 조회 버튼 클릭
	const handleSearch = async () => {
		setLoading(true)
		setSearchKey(bsnNm)
		try {
			const body = {
				SP: 'COM_02_0201_S(?, ?, ?, ?, ?)',
				PARAM: [
					bsnNm,
					startYear,
					checkedStates.length === 0 ? 'ALL' : checkedStates.join(','),
					loginId, // 실제 로그인ID
				].join('|'),
			}

			const res = await fetch(getApiUrl(), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			if (!res.ok) throw new Error('API 요청 실패')
			const result = await res.json()
			const data = result.data || []
			setData(data)
			
			// 조회 결과에 따른 토스트 메시지 표시
			if (data.length === 0) {
				showToast('조회 결과가 없습니다.', 'info')
			} else {
				showToast(`${data.length}건의 사업이 검색되었습니다.`, 'info')
			}
		} catch (e: any) {
			console.error(e)
			showToast(e.message || '조회 중 오류가 발생했습니다.', 'error')
			setData([])
		} finally {
			setLoading(false)
		}
	}

	// 종료 버튼 핸들러
	const handleClose = () => {
		window.close() // 팝업 닫기(실제 환경에 맞게 수정)
	}

		// 그리드 더블클릭 시 부모창에 값 반환
	const handleRowDoubleClick = (item: BusinessNameSearchResult) => {
		if (window.opener) {
			window.opener.postMessage(
				{
					type: 'BSN_SELECT',
					payload: {
						bsnNo: item.bsnNo,
						bsnNm: item.bsnNm,
						// 필요시 추가 필드
					},
				},
				'*'
			)
		}
		window.close()
	}

	return (
		<div className='popup-wrapper'>
			{/* 상단 헤더 */}
			<div className='popup-header'>
				<h3 className='popup-title'>사업명 검색</h3>
				<button
					className='popup-close'
					type='button'
					aria-label='팝업 닫기'
					tabIndex={0}
					onClick={handleClose}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleClose()
					}}
				>
					×
				</button>
			</div>

			<div className='popup-body'>
				{/* 검색 조건 */}
				<div className='search-div'>
					<table className='search-table'>
						<tbody>
							<tr className='search-tr'>
								<th className='search-th w-[100px]'>진행상태</th>
								<td className='search-td' colSpan={7}>
									<label className='mr-2'>
										<input
											type='checkbox'
											checked={allChecked}
											onChange={handleAllCheck}
											tabIndex={0}
											aria-label='모두선택'
										/>{' '}
										(모두선택)
									</label>
									{PGRS_STATES.map((st) => (
										<label className='mr-2' key={st.code}>
											<input
												type='checkbox'
												checked={checkedStates.includes(st.code)}
												onChange={() => handleStateCheck(st.code)}
												tabIndex={0}
												aria-label={st.label}
											/>{' '}
											{st.label}
										</label>
									))}
								</td>
							</tr>
							<tr className='search-tr'>
								<th className='search-th'>시작년도</th>
								<td className='search-td w-[120px]'>
									<select
										className='combo-base !w-[120px]'
										value={startYear}
										onChange={handleYearChange}
										tabIndex={0}
										aria-label='시작년도'
									>
										{yearList.map((y) => (
											<option key={y} value={y}>
												{y === 'ALL' ? '전체' : y}
											</option>
										))}
									</select>
								</td>
								<th className='search-th w-[110px]'>사업명</th>
								<td className='search-td  w-[25%]'>
									<input
										type='text'
										className='input-base input-default w-[200px]'
										value={bsnNm}
										onChange={handleBsnNmChange}
										onKeyDown={handleKeyDown}
										tabIndex={0}
										aria-label='사업명'
									/>
								</td>
								<td className='search-td text-right' colSpan={2}>
									<button
										className='btn-base btn-search'
										onClick={handleSearch}
										tabIndex={0}
										aria-label='조회'
									>
										조회
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* 유사사업명칭 */}
				<div className='clearbox-div mt-4'>
					<table className='clear-table'>
						<tbody>
							<tr className='clear-tr'>
								<th className='clear-th w-[150px]'>유사 사업명칭 조회결과 </th>
								<td className='clear-td'>
									<input
										type='text'
										className='input-base input-default w-[300px]'
										value={searchKey}
										readOnly
										placeholder='검색 KEY'
										tabIndex={-1}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* 검색 결과 그리드 */}
				<div className='gridbox-div mt-4' style={{ height: '480px', overflow: 'auto' }}>
					<table className='grid-table w-full'>
						<thead>
							<tr>
								<th className='grid-th' style={{ width: '40px' }}>No</th>
								<th className='grid-th' style={{ width: '120px' }}>사업번호</th>
								<th className='grid-th' style={{ width: '320px' }}>사업명</th>
								<th className='grid-th' style={{ width: '100px' }}>시작일자</th>
								<th className='grid-th' style={{ width: '100px' }}>종료일자</th>
								<th className='grid-th' style={{ width: '120px' }}>사업부서</th>
								<th className='grid-th' style={{ width: '120px' }}>영업대표</th>
								<th className='grid-th' style={{ width: '120px' }}>실행부서</th>
								<th className='grid-th' style={{ width: '80px' }}>PM</th>
								<th className='grid-th' style={{ width: '100px' }}>상태</th>
							</tr>
						</thead>
						<tbody>
							{data.length > 0
								? data.map((item, idx) => (
									<tr
										className='grid-tr cursor-pointer'
										key={item.bsnNo || item.bsnNo || idx}
										onDoubleClick={() => handleRowDoubleClick(item)}
										tabIndex={0}
										aria-label={`사업번호 ${item.bsnNo || item.bsnNo}`}
										style={{ cursor: 'pointer' }}
									>
										<td className='grid-td text-center' style={{ width: '40px' }}>{idx + 1}</td>
										<td className='grid-td' style={{ width: '120px' }} title={item.bsnNo || item.bsnNo}>
											{item.bsnNo || item.bsnNo}
										</td>
										<td className='grid-td' style={{ width: '320px' }} title={item.bsnNm || item.bsnNm}>
											{item.bsnNm || item.bsnNm}
										</td>
										<td className='grid-td' style={{ width: '100px' }} title={item.bsnStrtDt || item.bsnStrtDt}>
											{item.bsnStrtDt || item.bsnStrtDt}
										</td>
										<td className='grid-td' style={{ width: '100px' }} title={item.bsnEndDt || item.bsnEndDt}>
											{item.bsnEndDt || item.bsnEndDt}
										</td>
										<td className='grid-td' style={{ width: '120px' }} title={item.pplsDeptNm || item.pplsDeptNm}>
											{item.pplsDeptNm || item.pplsDeptNm}
										</td>
										<td className='grid-td' style={{ width: '120px' }} title={item.bizRepnm || item.bizRepnm}>
											{item.bizRepnm || item.bizRepnm}
										</td>
										<td className='grid-td' style={{ width: '120px' }} title={item.execDeptNm || item.execDeptNm}>
											{item.execDeptNm || item.execDeptNm}
										</td>
										<td className='grid-td' style={{ width: '80px' }} title={item.pmNm || item.pmNm}>
											{item.pmNm || item.pmNm}
										</td>
										<td className='grid-td' style={{ width: '100px' }} title={item.pgrsStDivNm || item.pgrsStDivNm}>
											{item.pgrsStDivNm || item.pgrsStDivNm}
										</td>
									</tr>
								))
								: (
									<tr className='grid-tr'>
										<td className='grid-td' colSpan={10} style={{ height: '400px', textAlign: 'center', verticalAlign: 'middle', color: '#666', fontSize: '14px' }}>
											조회 결과가 없습니다
										</td>
									</tr>
								)}
						</tbody>
					</table>
				</div>

				{/* 종료 버튼 */}
				<div className='flex justify-end mt-4'>
					<button
						className='btn-base btn-delete'
						onClick={() => window.close()}
						tabIndex={0}
						aria-label='종료'
					>
						종료
					</button>
				</div>
			</div>
		</div>
	)
}

export default BusinessNameSearchPopup
