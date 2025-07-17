'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import '../common/common.css';

/**
 * 직원 정보 인터페이스 (ASIS 기반)
 */
interface EmpInfo {
  LIST_NO: string          // 목록 번호
  EMP_NO: string          // 사번
  EMP_NM: string          // 성명
  HQ_DIV_NM: string       // 본부명
  DEPT_DIV_NM: string     // 부서명
  DUTY_NM: string         // 직급명
  AUTH_CD_NM: string      // 사용자 권한
  BSN_USE_YN: string      // 사업 사용권한
  WPC_USE_YN: string      // 추진비 사용권한
  PSM_USE_YN: string      // 인사/복리 사용권한
  RMK: string             // 비고
  HQ_DIV_CD: string       // 본부구분코드
  DEPT_DIV_CD: string     // 부서구분코드
  DUTY_CD: string         // 직급코드
  DUTY_DIV_CD: string     // 직책구분코드
  AUTH_CD: string         // 권한코드
  APV_APOF_ID: string     // 승인결재자ID
  EMAIL_ADDR: string      // 이메일주소
}

/**
 * 더블클릭시 반환할 최소 정보 타입
 */
interface EmpSelectInfo {
  empNo: string      // 사번
  empNm: string      // 성명
  authCd: string      // 사용자권한
}

/**
 * 컴포넌트 Props 인터페이스
 */
interface Props {
  defaultEmpNm?: string                    // 기본 직원명 (검색창 초기값)
  defaultEmpList?: EmpInfo[]              // 기본 직원 목록 (미리 로드된 데이터)
  onSelect: (empData: EmpSelectInfo) => void  // 직원 선택 콜백
  onClose: () => void                      // 모달 닫기 콜백
}

/**
 * 컴포넌트 Ref 인터페이스
 */
export interface EmpSearchModalRef {
  choiceEmpInit: (strEmpNm: string, empList: EmpInfo[]) => void
}

/**
 * 샘플 데이터 (필요시 주석 해제하여 사용)
 */
/*
const SAMPLE_EMP_DATA: EmpInfo[] = [
  {
    LIST_NO: "1",
    EMP_NO: "E001",
    EMP_NM: "홍길동",
    HQ_DIV_NM: "경영본부",
    DEPT_DIV_NM: "전략팀",
    DUTY_NM: "과장",
    AUTH_CD_NM: "관리자",
    BSN_USE_YN: 1,
    WPC_USE_YN: 0,
    PSM_USE_YN: 1,
    RMK: "",
    HQ_DIV_CD: "HQ001",
    DEPT_DIV_CD: "DEPT001",
    DUTY_CD: "DUTY001",
    DUTY_DIV_CD: "DUTY_DIV001",
    AUTH_CD: "AUTH001",
    APV_APOF_ID: "APV001",
    EMAIL_ADDR: "hong@company.com"
  }
];
*/

/**
 * 직원 검색 모달 컴포넌트
 * 
 * 주요 기능:
 * - 직원명으로 실시간 검색 (API 연동)
 * - 검색 결과를 테이블 형태로 표시
 * - 더블클릭으로 직원 선택
 * - Enter 키로 검색 실행
 * - Escape 키로 모달 닫기
 * - 포커스 시 전체 선택
 * 
 * 특징:
 * - 직원 권한 정보를 체크박스로 표시
 * - 업무별 사용권한 구분 (사업, 추진비, 인사/복리)
 * - 키보드 단축키 지원
 * - Ref를 통한 외부 제어 가능
 * 
 * 사용법:
 * <EmpSearchModal 
 *   defaultEmpNm="홍길동"
 *   onSelect={(emp) => { 선택 처리 }}
 *   onClose={() => { 모달 닫기 }}
 * />
 */
const EmpSearchModal = forwardRef<EmpSearchModalRef, Props>(({ 
  defaultEmpNm = '', 
  defaultEmpList = [],
  onSelect, 
  onClose 
}, ref) => {
  // 직원 목록 상태 관리
  const [emps, setEmps] = useState<EmpInfo[]>(defaultEmpList)
  // 로딩 상태 관리
  const [loading, setLoading] = useState(false)
  // 직원명 검색어 상태 관리
  const [empNm, setEmpNm] = useState(defaultEmpNm)
  // 입력 필드 참조
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * init_Complete 함수
   * 모달이 처음 로드될 때 초기화 작업을 수행
   */
  const init_Complete = () => {
    setEmpNm(defaultEmpNm || '')
    setEmps(defaultEmpList || [])
    setLoading(false)
    // 검색창에 포커스
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * choiceEmpInit 함수
   * 직원명과 직원리스트를 받아서 입력창과 결과 그리드를 초기화
   * @param strEmpNm 직원명
   * @param empList 직원리스트
   */
  const choiceEmpInit = (strEmpNm: string, empList: EmpInfo[]) => {
    setEmpNm(strEmpNm)
    setEmps(empList)
    setLoading(false)
    // 검색창에 포커스
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * 직원 검색 함수
   * API를 호출하여 직원 정보를 검색하고 결과를 상태에 저장
   */
  const handleSearch = async () => {
    if (!empNm.trim()) return
    setLoading(true)
    try {
      const res = await fetch('api/users/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userNm: empNm.trim()
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        if (errorData.message && Array.isArray(errorData.message)) {
          alert(errorData.message.join('\n'))
        } else {
          alert('검색 중 오류가 발생했습니다.')
        }
        setEmps([])
        return
      }

      const data = await res.json()
      const empList = data.data || data
      setEmps(empList)
      
      // 검색 결과가 없고 검색어가 있는 경우 알림
      if (empList.length === 0 && empNm.trim()) {
        alert('해당 직원명은 존재하지 않습니다.')
      }
    } catch (e) {
      console.error('검색 실패:', e)
      alert('검색 중 오류가 발생했습니다.')
      setEmps([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * 직원 더블클릭 처리 함수
   */
  const handleDoubleClick = (emp: EmpInfo) => {
    const selectInfo: EmpSelectInfo = {
      empNo: emp.EMP_NO,
      empNm: emp.EMP_NM,
      authCd: emp.AUTH_CD,
    }
    onSelect(selectInfo)
    onClose()
  }

  /**
   * 테이블 행 번호 생성 함수
   */
  const setRowNumber = (index: number) => {
    return String(index + 1)
  }

  /**
   * 키보드 이벤트 처리 함수
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  /**
   * 포커스 시 전체 선택
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  /**
   * Escape 키로 닫기
   */
  useEffect(() => {
    init_Complete()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])


  /**
   * 외부에서 호출할 수 있는 메서드들을 ref에 노출
   */
  useImperativeHandle(ref, () => ({
    choiceEmpInit
  }))

  return (
    <div className="popup-wrapper min-w-[840px]">
      {/* 팝업 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">사용자명 검색</h3>
        <button className="popup-close" onClick={onClose}>×</button>
      </div>

      {/* 팝업 본문 */}
      <div className="popup-body scroll-area">
        {/* 검색 조건 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                <th className="search-th w-[100px]">사용자 명</th>
                <td className="search-td w-[200px]">
                  <input
                    ref={inputRef}
                    type="text"
                    className="input-base input-default w-full"
                    value={empNm}
                    onChange={(e) => setEmpNm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="사용자명 입력"
                  />
                </td>
                <td className="search-td text-right" colSpan={6}>
                  <button 
                    className="btn-base btn-search" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? '조회 중...' : '조회'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결과 그리드 */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th w-[60px]">사번</th>
                <th className="grid-th w-[70px]">성명</th>
                <th className="grid-th w-[120px]">본부명</th>
                <th className="grid-th w-[120px]">부서명</th>
                <th className="grid-th w-[60px]">직급명</th>
                <th className="grid-th w-[100px]">사용자 권한</th>
                <th className="grid-th w-[60px]">사업</th>
                <th className="grid-th w-[60px]">추진비</th>
                <th className="grid-th w-[60px]">인사/복리</th>
                <th className="grid-th">비고</th>
              </tr>
            </thead>
            <tbody>
              {emps.map((emp, index) => (
                <tr 
                  className="grid-tr cursor-pointer hover:bg-blue-50" 
                  key={index}
                  onDoubleClick={() => handleDoubleClick(emp)}
                >
                  <td className="grid-td text-center">{setRowNumber(index)}</td>
                  <td className="grid-td text-center">{emp.EMP_NO}</td>
                  <td className="grid-td text-center">{emp.EMP_NM}</td>
                  <td className="grid-td text-center">{emp.HQ_DIV_NM}</td>
                  <td className="grid-td text-center">{emp.DEPT_DIV_NM}</td>
                  <td className="grid-td text-center">{emp.DUTY_NM}</td>
                  <td className="grid-td text-center">{emp.AUTH_CD_NM}</td>
                  <td className="grid-td text-center">
                    <input type="checkbox" checked={emp.BSN_USE_YN === "1"} readOnly />
                  </td>
                  <td className="grid-td text-center">
                    <input type="checkbox" checked={emp.WPC_USE_YN === "1"} readOnly />
                  </td>
                  <td className="grid-td text-center">
                    <input type="checkbox" checked={emp.PSM_USE_YN === "1"} readOnly />
                  </td>
                  <td className="grid-td">{emp.RMK}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 검색 결과가 없을 때 표시 */}
        {emps.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">🔍 검색 결과가 없습니다.</p>
        )}

        {/* 종료 버튼 하단 우측 정렬 */}
        <div className="flex justify-end mt-2">
          <button className="btn-base btn-delete" onClick={onClose}>종료</button>
        </div>
      </div>
    </div>
  );
})

export default EmpSearchModal;

