'use client'
import React, { useState, useEffect } from 'react'
import { useDeptDivCodes } from '@/modules/auth/hooks/useCommonCodes'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import '@/app/common/common.css'

/**
 * COMZ060P00 - (팝)부서번호검색화면
 * 
 * 주요 기능:
 * - 부서번호 검색 및 선택
 * - 부서구분별 필터링
 * - 연도별 부서 조회
 * - 부모창 데이터 전달
 * 
 * 연관 테이블:
 * - TBL_DEPT (부서 정보)
 * - TBL_DEPT_NO (부서번호)
 */

interface DeptNoSearchResult {
	deptNo: string
	deptNm: string
	strtDt: string
	endDt: string
	deptDivCd: string
	deptDivNm: string
	hqDivCd: string
	hqDivNm: string
	bsnDeptKb: string
}

const apiUrl =
	typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
		? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/search-dept-no`
		: '/api/search-dept-no'

export default function DeptNumberSearchPopup() {
	const params = useSearchParams()
	const initialDeptNo = params?.get('deptNo') || ''
	const { showToast } = useToast()
	const [form, setForm] = useState({
		deptNo: initialDeptNo,
		year: new Date().getFullYear().toString(),
		deptDivCd: '',
	})
	const [results, setResults] = useState<DeptNoSearchResult[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const deptDivCodes = useDeptDivCodes()

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	const handleSearch = async () => {
		setLoading(true)
		setError('')
		setResults([])
		try {
			const searchParams = new URLSearchParams({
				deptNo: form.deptNo,
				year: form.year,
				deptDivCd: form.deptDivCd || '', // 빈 문자열도 명시적으로 전달
			})
			const url = `${apiUrl}?${searchParams.toString()}`
			const res = await fetch(url)
			const data = await res.json()
			const results = Array.isArray(data) ? data : (data.data ?? [])
			setResults(results)
		} catch (err: any) {
			const errorMessage = err.message || '오류 발생'
			setError(errorMessage)
			showToast(errorMessage, 'error')
		} finally {
			setLoading(false)
		}
	}

	// 그리드 행 더블클릭 시 부모창에 값 전달
	const handleRowDoubleClick = (row: DeptNoSearchResult) => {
		if (window.opener) {
			window.opener.postMessage({ type: 'DEPT_SELECT', payload: row }, '*')
		}
		window.close()
	}

	return (
		<div className='popup-wrapper'>
			{/* 상단 헤더 */}
			<div className='popup-header'>
				<h3 className='popup-title'>부서번호 검색</h3>
				{/* 닫기 버튼은 실제 팝업이 아니므로 생략 또는 필요시 구현 */}
			</div>
			<div className='popup-body'>
				{/* 조회영역 */}
				<div className='search-div mb-4'>
					<table className='search-table'>
						<tbody>
							<tr className='search-tr'>
								<th className='search-th w-[70px]'>년도</th>
								<td className='search-td w-[120px]'>
									<input
										type='text'
										name='year'
										className='input-base input-default w-full'
										value={form.year}
										onChange={handleChange}
										aria-label='년도'
										onKeyDown={handleKeyDown}
									/>
								</td>
								<th className='search-th w-[92px]'>부서번호</th>
								<td className='search-td w-[180px]'>
									<input
										type='text'
										name='deptNo'
										className='input-base input-default w-full'
										value={form.deptNo}
										onChange={handleChange}
										aria-label='부서번호'
										onKeyDown={handleKeyDown}
									/>
								</td>
								<th className='search-th w-[92px]'>부서구분</th>
								<td className='search-td w-[180px]'>
									<select
										name='deptDivCd'
										className='combo-base w-full'
										value={form.deptDivCd}
										onChange={handleChange}
										aria-label='부서구분'
										onKeyDown={handleKeyDown}
									>
										<option value=''>전체</option>
										{deptDivCodes.map((item, idx) => {
											// @ts-ignore: DB 응답이 대문자 속성일 수 있음
											const code = item.code || item.CODE
											// @ts-ignore
											const name = item.name || item.NAME
											return (
												<option key={code || idx} value={code}>
													{name}
												</option>
											)
										})}
									</select>
								</td>
								<td className='search-td text-right' colSpan={2}>
									<button
										className='btn-base btn-search mr-2'
										onClick={handleSearch}
										tabIndex={0}
										aria-label='조회'
										onKeyDown={(e) => {
											if (e.key === 'Enter') handleSearch()
										}}
									>
										{loading ? '조회중...' : '조회'}
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				{/* 에러 메시지 */}
				{error && <div className='text-red-600 mb-2'>{error}</div>}
				{/* 그리드 영역 */}
				<div className='gridbox-div mb-4' style={{ height: '480px' }}>
					{/* 고정 헤더 */}
					<div className='grid-header-container'>
						<table className='grid-table w-full'>
							<thead>
								<tr>
									<th className='grid-th' style={{ width: '100px' }}>부서번호</th>
									<th className='grid-th' style={{ width: '180px' }}>부서명</th>
									<th className='grid-th' style={{ width: '100px' }}>시작일자</th>
									<th className='grid-th' style={{ width: '100px' }}>종료일자</th>
									<th className='grid-th' style={{ width: '100px' }}>본부구분</th>
									<th className='grid-th' style={{ width: '100px' }}>부서구분</th>
								</tr>
							</thead>
						</table>
					</div>
					{/* 스크롤 가능한 데이터 영역 */}
					<div className='grid-data-container'>
						<table className='grid-table w-full'>
							<tbody>
								{results.length > 0
									? results.map((item, idx) => (
										<tr
											key={idx}
											className='grid-tr cursor-pointer'
											onDoubleClick={() => handleRowDoubleClick(item)}
											style={{ cursor: 'pointer' }}
										>
											<td className='grid-td' style={{ width: '100px' }} title={item.deptNo}>
												{item.deptNo}
											</td>
											<td className='grid-td' style={{ width: '180px' }} title={item.deptNm}>
												{item.deptNm}
											</td>
											<td className='grid-td' style={{ width: '100px' }} title={item.strtDt}>
												{item.strtDt}
											</td>
											<td className='grid-td' style={{ width: '100px' }} title={item.endDt}>
												{item.endDt}
											</td>
											<td className='grid-td' style={{ width: '100px' }} title={item.hqDivNm}>
												{item.hqDivNm}
											</td>
											<td className='grid-td' style={{ width: '100px' }} title={item.deptDivNm}>
												{item.deptDivNm}
											</td>
										</tr>
									))
									: Array.from({ length: 10 }, (_, idx) => (
										<tr key={`empty-${idx}`} className='grid-tr'>
											<td className='grid-td' colSpan={6}>&nbsp;</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
				{/* 종료 버튼 (우측 정렬) */}
				<div className='flex justify-end'>
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
