'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * 직원 정보 인터페이스 (ASIS 기반)
 * ASIS: COM_02_0600.mxml의 AdvancedDataGrid 컬럼 구조와 동일
 */
interface EmpInfo {
  LIST_NO: string;        // 목록 번호
  EMP_NO: string;         // 사번
  EMP_NM: string;         // 성명
  HQ_DIV_NM: string;      // 본부명
  DEPT_DIV_NM: string;    // 부서명
  DUTY_NM: string;        // 직급명
  AUTH_CD_NM: string;     // 사용자 권한
  BSN_USE_YN: string;     // 사업 사용권한
  WPC_USE_YN: string;     // 추진비 사용권한
  PSM_USE_YN: string;     // 인사/복리 사용권한
  RMK: string;            // 비고
  HQ_DIV_CD: string;      // 본부구분코드
  DEPT_DIV_CD: string;    // 부서구분코드
  DUTY_CD: string;        // 직급코드
  DUTY_DIV_CD: string;    // 직책구분코드
  AUTH_CD: string;        // 권한코드
  APV_APOF_ID: string;    // 승인결재자ID
  EMAIL_ADDR: string;     // 이메일주소
}

/**
 * 더블클릭시 반환할 최소 정보 타입
 * ASIS: EvtDblClick 이벤트의 txtData 구조와 동일
 * 형식: "사용자ID^사용자명^사용자등급"
 */
interface EmpSelectInfo {
  empNo: string;      // 사번 (ASIS: EMP_NO)
  empNm: string;      // 성명 (ASIS: EMP_NM)
  authCd: string;      // 사용자권한 (ASIS: AUTH_CD)
}

/**
 * 컴포넌트 Props 인터페이스
 * ASIS: pubEmpNm, pubOwnOutDiv 변수와 동일한 역할
 */
interface Props {
  defaultEmpNm?: string;                    // 기본 직원명 (ASIS: pubEmpNm)
  defaultEmpList?: EmpInfo[];              // 기본 직원 목록 (ASIS: arrEmpListDG)
  onSelect: (empData: EmpSelectInfo) => void;  // 직원 선택 콜백 (ASIS: EvtDblClick 이벤트)
  onClose: () => void;                      // 모달 닫기 콜백 (ASIS: PopUpManager.removePopUp)
}

/**
 * 컴포넌트 Ref 인터페이스
 * ASIS: choiceEmpInit() 함수와 동일한 역할
 */
export interface EmpSearchModalRef {
  choiceEmpInit: (strEmpNm: string, empList: EmpInfo[]) => void
}

/**
 * 샘플 데이터 (필요시 주석 해제하여 사용)
 * ASIS: 테스트용 데이터 구조와 동일
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
    BSN_USE_YN: "1",
    WPC_USE_YN: "0",
    PSM_USE_YN: "1",
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
 * ASIS: COM_02_0600.mxml → TOBE: COMZ100P00.tsx
 * 
 * 주요 기능:
 * 1. 직원명으로 실시간 검색 (USR_01_0201_S)
 * 2. 검색 결과를 테이블 형태로 표시
 * 3. 더블클릭으로 직원 선택
 * 4. Enter 키로 검색 실행
 * 5. Escape 키로 모달 닫기
 * 6. 포커스 시 전체 선택
 * 7. Ref를 통한 외부 제어 가능
 */
const EmpSearchModal = forwardRef<EmpSearchModalRef, Props>(({ 
  defaultEmpNm = '', 
  defaultEmpList = [],
  onSelect, 
  onClose 
}, ref) => {
  // 직원 목록 상태 관리 (ASIS: grdEmpList.dataProvider)
  const [emps, setEmps] = useState<EmpInfo[]>(defaultEmpList)
  // 로딩 상태 관리 (ASIS: showBusyCursor="true")
  const [loading, setLoading] = useState(false)
  // 직원명 검색어 상태 관리 (ASIS: txtEmpNm.text)
  const [empNm, setEmpNm] = useState(defaultEmpNm)
  // 입력 필드 참조 (ASIS: txtEmpNm)
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  /**
   * init_Complete 함수
   * ASIS: init_Complete() 함수와 동일한 역할
   * 모달이 처음 로드될 때 초기화 작업을 수행
   */
  const init_Complete = () => {
    setEmpNm(defaultEmpNm || '')
    setEmps(defaultEmpList || [])
    setLoading(false)
    // 검색창에 포커스 (ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * choiceEmpInit 함수
   * ASIS: choiceEmpInit(strEmpNm:String, arrEmpList:ArrayCollection) 함수와 동일
   * 직원명과 직원리스트를 받아서 입력창과 결과 그리드를 초기화
   * @param strEmpNm 직원명 (ASIS: strEmpNm)
   * @param empList 직원리스트 (ASIS: arrEmpList)
   */
  const choiceEmpInit = (strEmpNm: string, empList: EmpInfo[]) => {
    setEmpNm(strEmpNm)
    setEmps(empList)
    setLoading(false)
    // 검색창에 포커스 (ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * 직원 검색 함수
   * ASIS: onSearchClick() 함수와 동일한 로직
   * 프로시저: USR_01_0201_S(?, ?, ?, ?)
   * 파라미터: 본부구분코드, 부서구분코드, 사용자명
   * API를 호출하여 직원 정보를 검색하고 결과를 상태에 저장
   */
  const handleSearch = async () => {
    if (!empNm.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/COMZ100P00/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userNm: empNm.trim()
        })
      })

      if (res.ok) {
        const data = await res.json()
        const empList = data.data || data
        setEmps(empList)
        
        // 검색 결과가 없고 검색어가 있는 경우 알림 (ASIS: Alert.show("해당 사용자명은 존재하지 않습니다."))
        if (empList.length === 0 && empNm.trim()) {
          showToast('해당 직원명은 존재하지 않습니다.', 'warning')
        }
      } else {
        const errorData = await res.json()
        const errorMessage = errorData.message || '검색 중 오류가 발생했습니다.'
        showToast(errorMessage, 'error')
        setEmps([])
      }
    } catch (e) {
      console.error('검색 실패:', e)
      showToast('검색 중 오류가 발생했습니다.', 'error')
      setEmps([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * 직원 더블클릭 처리 함수
   * ASIS: onDoubleClick(idx:int) 함수와 동일한 로직
   * 더블클릭 시 선택된 직원 정보를 부모 컴포넌트로 전달
   */
  const handleDoubleClick = (emp: EmpInfo) => {
    const selectInfo: EmpSelectInfo = {
      empNo: emp.EMP_NO,      // ASIS: grdEmpList.selectedItem.EMP_NO
      empNm: emp.EMP_NM,      // ASIS: grdEmpList.selectedItem.EMP_NM
      authCd: emp.AUTH_CD,    // ASIS: grdEmpList.selectedItem.AUTH_CD
    }
    onSelect(selectInfo)      // ASIS: dispatchEvent(evtDblClck)
    onClose()                 // ASIS: PopUpManager.removePopUp(this)
  }

  /**
   * 테이블 행 번호 생성 함수
   * ASIS: setRowNum(cItem:Object,i_column:AdvancedDataGridColumn):String 함수와 동일
   * @param index 행 인덱스
   * @returns 행 번호 문자열
   */
  const setRowNumber = (index: number) => {
    return String(index + 1)
  }

  /**
   * 키보드 이벤트 처리 함수
   * ASIS: 키보드 이벤트 처리와 동일
   * Enter: 검색 실행
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  /**
   * 포커스 시 전체 선택
   * ASIS: FInputHangul 컴포넌트의 포커스 시 전체 선택 기능과 동일
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  /**
   * 컴포넌트 초기화
   * ASIS: 키보드 이벤트 처리와 동일
   */
  useEffect(() => {
    init_Complete()
  }, [])


  /**
   * 외부에서 호출할 수 있는 메서드들을 ref에 노출
   * ASIS: choiceEmpInit 함수를 외부에서 호출할 수 있도록 노출
   */
  useImperativeHandle(ref, () => ({
    choiceEmpInit
  }))

  return (
    <div className="popup-wrapper min-w-[840px]">
      {/* 팝업 헤더 (ASIS: TitleWindow 헤더) */}
      <div className="popup-header">
        <h3 className="popup-title">사용자명 검색</h3>
        <button className="popup-close" onClick={onClose}>×</button>
      </div>

      {/* 팝업 본문 (ASIS: VBox 영역) */}
      <div className="popup-body scroll-area">
        {/* 검색 조건 (ASIS: HBox 검색 영역) */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* 사용자명 입력 (ASIS: txtEmpNm) */}
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
                {/* 조회 버튼 (ASIS: 조회 버튼) */}
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

        {/* 결과 그리드 (ASIS: grdEmpList AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn 구조와 동일 */}
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th w-[60px]">사번</th>
                <th className="grid-th w-[70px]">성명</th>
                <th className="grid-th w-[120px]">본부명</th>
                <th className="grid-th w-[120px]">부서명</th>
                <th className="grid-th w-[60px]">직급명</th>
                <th className="grid-th w-[100px]">사용자 권한</th>
                {/* ASIS: AdvancedDataGridColumnGroup "업무별 사용권한" */}
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
                  {/* ASIS: CheckBox itemRenderer와 동일한 기능 */}
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

        {/* 검색 결과가 없을 때 표시 (ASIS: 빈 그리드 표시) */}
        {emps.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">🔍 검색 결과가 없습니다.</p>
        )}

        {/* 종료 버튼 하단 우측 정렬 (ASIS: btnClose) */}
        <div className="flex justify-end mt-2">
          <button className="btn-base btn-delete" onClick={onClose}>종료</button>
        </div>
      </div>
    </div>
  );
})

export default EmpSearchModal;

