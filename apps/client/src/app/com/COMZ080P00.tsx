'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../common/common.css';

/**
 * 직원 정보 인터페이스 (ASIS 기반)
 */
interface EmployeeInfo {
  LIST_NO: string          // 목록 번호
  OWN_OUTS_NM: string     // 자사/외주 구분명
  EMP_NM: string          // 직원명
  EMP_NO: string          // 직원번호
  DUTY_CD_NM: string      // 직책 코드명
  TCN_GRD_NM: string      // 기술등급명
  PARTY_NM: string        // 소속명
  ENTR_DT: string         // 입사일
  EXEC_IN_STRT_DT: string // 투입시작일
  EXEC_IN_END_DT: string  // 투입종료일
  WKG_ST_DIV_NM: string   // 상태명
  EXEC_ING_BSN_NM: string // 투입중 프로젝트
  HQ_DIV_CD: string       // 본부구분코드
  DEPT_DIV_CD: string     // 부서구분코드
  CSF_CO_CD: string       // 소속코드
  WKG_ST_DIV: string      // 상태코드
  EXEC_ING_YN: string     // 투입중유무
  OWN_OUTS_DIV: string    // 구분코드
  OUTS_FIX_YN: string     // 외주배정유무
  IN_FIX_DT: string       // 외주배정확정일자
  IN_FIX_PRJT: string     // 외주배정프로젝트
  DUTY_CD: string         // 직책코드
  DUTY_DIV_CD: string     // 투입인력직책
  TCN_GRD: string         // 등급코드
}

/**
 * 컴포넌트 Props 인터페이스
 */
interface Props {
  defaultEmpNm?: string                    // 기본 직원명 (검색창 초기값)
  defaultOwnOutDiv?: string                // 기본 자사/외주 구분
  defaultEmpList?: EmployeeInfo[]          // 기본 직원 목록 (미리 로드된 데이터)
  onSelect: (empData: {                    // 선택 콜백 (상세 정보 포함)
    empNo: string
    ownOutsDiv: string
    empNm: string
    csfCoCd: string
    outsFixYn: string
    inFixDt: string
    inFixPrjt: string
    dutyDivCd: string
    tcnGrd: string
  }) => void
  onClose: () => void                      // 모달 닫기 콜백
}

/**
 * 컴포넌트 Ref 인터페이스
 */
export interface EmployeeSearchModalRef {
  choiceEmpInit: (strEmpNm: string, ownOutDiv: string, empList: EmployeeInfo[]) => void
}

/**
 * 샘플 데이터 (필요시 주석 해제하여 사용)
 */
/*
const SAMPLE_EMPLOYEE_DATA: EmployeeInfo[] = [
  {
    LIST_NO: "1",
    OWN_OUTS_NM: "자사",
    EMP_NM: "성부뜰",
    EMP_NO: "EMP001",
    DUTY_CD_NM: "부장",
    TCN_GRD_NM: "특급",
    PARTY_NM: "SI사업본부",
    ENTR_DT: "2024/07/01",
    EXEC_IN_STRT_DT: "2024/08/01",
    EXEC_IN_END_DT: "2025/01/01",
    WKG_ST_DIV_NM: "재직",
    EXEC_ING_BSN_NM: "AICC 구축",
    HQ_DIV_CD: "HQ001",
    DEPT_DIV_CD: "DEPT001",
    CSF_CO_CD: "CSF001",
    WKG_ST_DIV: "1",
    EXEC_ING_YN: "Y",
    OWN_OUTS_DIV: "1",
    OUTS_FIX_YN: "N",
    IN_FIX_DT: "",
    IN_FIX_PRJT: "",
    DUTY_CD: "DUTY001",
    DUTY_DIV_CD: "DUTY_DIV001",
    TCN_GRD: "TCN001"
  }
];
*/

const EmployeeSearchPopupExtended = forwardRef<EmployeeSearchModalRef, Props>(({ 
  defaultEmpNm = '', 
  defaultOwnOutDiv = '1',
  defaultEmpList = [],
  onSelect, 
  onClose 
}, ref) => {
  // 직원 목록 상태 관리
  const [employees, setEmployees] = useState<EmployeeInfo[]>(defaultEmpList)
  // 로딩 상태 관리
  const [loading, setLoading] = useState(false)
  // 직원명 검색어 상태 관리
  const [empNm, setEmpNm] = useState(defaultEmpNm)
  // 자사/외주 구분 상태 관리
  const [ownOutDiv, setOwnOutDiv] = useState(defaultOwnOutDiv)
  // 퇴사자포함 상태 관리
  const [retirYn, setRetirYn] = useState(true)

  /**
   * 직원 검색 함수 (API 호출)
   */
  const handleSearch = async () => {
    // 필수값 검증
    if (!empNm.trim()) {
      alert('사원명을 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('api/employee/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kb: '2', // 사원명으로 검색
          empNo: '',
          empNm: empNm.trim(),
          ownOutsDiv: ownOutDiv === 'ALL' ? null : ownOutDiv,
          retirYn: retirYn ? 'Y' : 'N'
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        if (errorData.message && Array.isArray(errorData.message)) {
          alert(errorData.message.join('\n'))
        } else {
          alert('검색 중 오류가 발생했습니다.')
        }
        setEmployees([])
        return
      }

      const empData = await res.json()
      setEmployees(empData.data)
      
      // 검색 결과가 없고 검색어가 있는 경우 알림
      if (empData.data.length === 0 && empNm.trim()) {
        alert('해당 직원명은 존재하지 않습니다.')
      }
    } catch (e) {
      console.error('검색 실패:', e)
      alert('검색 중 오류가 발생했습니다.')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * 직원 더블클릭 처리 함수 (ASIS 기반)
   */
  const handleDoubleClick = (employee: EmployeeInfo) => {
    onSelect({
      empNo: employee.EMP_NO,                    // [0]: 사번
      ownOutsDiv: employee.OWN_OUTS_DIV,        // [1]: 자사외주구분
      empNm: employee.EMP_NM,                   // [2]: 사원명
      csfCoCd: employee.CSF_CO_CD,              // [3]: 소속명
      outsFixYn: employee.OUTS_FIX_YN,          // [4]: 외주배정유무
      inFixDt: employee.IN_FIX_DT,              // [5]: 외주배정확정일자
      inFixPrjt: employee.IN_FIX_PRJT,          // [6]: 외주배정프로젝트
      dutyDivCd: employee.DUTY_DIV_CD,          // [7]: 투입인력 직책구분코드
      tcnGrd: employee.TCN_GRD                  // [8]: 현재 최종 기술등급
    })
    onClose()
  }

  /**
   * 테이블 행 번호 생성 함수
   */
  const setRowNumber = (index: number) => {
    return String(index + 1)
  }

  /**
   * 자사/외주 구분 변경 처리
   */
  const handleOwnOutDivChange = (value: string) => {
    setOwnOutDiv(value)
  }

  /**
   * 퇴사자포함 체크박스 변경 처리
   */
  const handleRetirYnChange = (checked: boolean) => {
    setRetirYn(checked)
  }

  /**
   * 행 스타일 함수 (ASIS 기반)
   */
  const getRowStyle = (employee: EmployeeInfo) => {
    if (employee.WKG_ST_DIV === "3") {        // 퇴사
      return "text-red-600"
    } else if (employee.WKG_ST_DIV === "2") { // 휴직
      return "text-blue-600"
    } else if (employee.OWN_OUTS_DIV === "2" && employee.EXEC_ING_YN === "N") { // 철수한 외주인 경우
      return "text-red-600"
    }
    return ""
  }

  /**
   * 키보드 이벤트 처리 함수
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  /**
   * 직원 선택 리스트 초기화 함수
   */
  const choiceEmpInit = (strEmpNm: string, ownOutDiv: string, empList: EmployeeInfo[]) => {
    setEmpNm(strEmpNm)
    setOwnOutDiv(ownOutDiv)
    setEmployees(empList)
  }

  /**
   * 기본값이 변경되면 상태 업데이트
   */
  useEffect(() => {
    if (defaultEmpNm) {
      setEmpNm(defaultEmpNm)
    }
    if (defaultOwnOutDiv) {
      setOwnOutDiv(defaultOwnOutDiv)
    }
  }, [defaultEmpNm, defaultOwnOutDiv])

  /**
   * 외부에서 호출할 수 있는 메서드들을 ref에 노출
   */
  useImperativeHandle(ref, () => ({
    choiceEmpInit
  }))

  return (
    <div className="popup-wrapper">
      {/* 팝업 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">직원 검색</h3>
        <button className="popup-close" type="button" onClick={onClose}>×</button>
      </div>

      {/* 팝업 본문 */}
      <div className="popup-body">
        {/* 검색 영역 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                <th className="search-th w-[80px]">직원명</th>
                <td className="search-td w-[200px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-full" 
                    value={empNm}
                    onChange={(e) => setEmpNm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="직원명 입력"
                  />
                </td>
                <td className="search-td" colSpan={6}>
                  <div className="flex items-center gap-4 text-sm">
                    <label>
                      <input 
                        type="radio" 
                        name="type" 
                        checked={ownOutDiv === '1'}
                        onChange={() => handleOwnOutDivChange('1')}
                      /> 자사
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="type" 
                        checked={ownOutDiv === '2'}
                        onChange={() => handleOwnOutDivChange('2')}
                      /> 외주
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="type" 
                        checked={ownOutDiv === 'ALL'}
                        onChange={() => handleOwnOutDivChange('ALL')}
                      /> 자사+외주
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={retirYn}
                        onChange={(e) => handleRetirYnChange(e.target.checked)}
                      /> 퇴사자포함
                    </label>
                  </div>
                </td>
                <td className="search-td text-right">
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
        <div className="gridbox-div mb-2">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th">구분</th>
                <th className="grid-th">직원명</th>
                <th className="grid-th">직책</th>
                <th className="grid-th">등급</th>
                <th className="grid-th">소속</th>
                <th className="grid-th">입사일</th>
                <th className="grid-th">투입일</th>
                <th className="grid-th">철수일</th>
                <th className="grid-th">상태</th>
                <th className="grid-th">투입중 프로젝트</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr 
                  key={index}
                  className={`grid-tr cursor-pointer hover:bg-blue-50 ${getRowStyle(employee)}`}
                  onDoubleClick={() => handleDoubleClick(employee)}
                >
                  <td className="grid-td text-center">{setRowNumber(index)}</td>
                  <td className="grid-td">{employee.OWN_OUTS_NM}</td>
                  <td className="grid-td">{employee.EMP_NM}</td>
                  <td className="grid-td">{employee.DUTY_CD_NM}</td>
                  <td className="grid-td">{employee.TCN_GRD_NM}</td>
                  <td className="grid-td">{employee.PARTY_NM}</td>
                  <td className="grid-td">{employee.ENTR_DT}</td>
                  <td className="grid-td">{employee.EXEC_IN_STRT_DT}</td>
                  <td className="grid-td">{employee.EXEC_IN_END_DT}</td>
                  <td className="grid-td">{employee.WKG_ST_DIV_NM}</td>
                  <td className="grid-td">{employee.EXEC_ING_BSN_NM}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 검색 결과가 없을 때 표시 */}
        {employees.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">🔍 검색 결과가 없습니다.</p>
        )}

        {/* 하단 안내문구 */}
        <div className="text-xs text-blue-600 leading-snug whitespace-pre-wrap px-1 mb-3">
          ※ 외주 직원의 경우, 입사일은 부뜰 프로젝트 최초 투입일자이고 투입일과 철수일은 최종투입일과 철수일임.{"\n"}
          상태는 자사 직원일 경우 재직/퇴사/휴직으로 표시되고 외주일 경우에는 재직/철수로 표시됨.{"\n"}
          검색하고자 하는 직원이름을 모를 경우에는 마지막 입력에 <b>%</b> 붙여서 검색하면 됨.
        </div>

        {/* 종료 버튼 */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete" onClick={onClose}>종료</button>
        </div>
      </div>
    </div>
  );
})

export default EmployeeSearchPopupExtended;
