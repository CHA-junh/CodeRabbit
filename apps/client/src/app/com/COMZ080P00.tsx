'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * 직원 검색 팝업 컴포넌트 (확장 버전)
 * ASIS: COM_02_0410.mxml → TOBE: COMZ080P00.tsx
 * 
 * 주요 기능:
 * 1. 직원 기본정보 조회 (empBscInfSelRequest)
 * 2. 직원명/사원번호 검색 (onSearchClick)
 * 3. 자사/외주/자사+외주 구분 검색 (rdOwnOutDiv)
 * 4. 퇴사자포함 검색 (chkRetirYn)
 * 5. 직원 선택(더블클릭) (onDoubleClick)
 * 6. 팝업 닫기 (PopUpManager.removePopUp)
 * 7. 행 스타일링 (grdEmpListStyleFunc)
 * 8. 키보드 이벤트 처리 (Enter 키 검색)
 */

/**
 * 직원 정보 인터페이스 (ASIS 기반)
 * ASIS: AdvancedDataGrid의 dataField와 동일한 구조
 */
interface EmployeeInfo {
  LIST_NO: string;          // 목록 번호
  OWN_OUTS_NM: string;      // 자사/외주 구분명
  EMP_NM: string;           // 직원명
  EMP_NO: string;           // 직원번호
  DUTY_CD_NM: string;       // 직책 코드명
  TCN_GRD_NM: string;       // 기술등급명
  PARTY_NM: string;         // 소속명
  ENTR_DT: string;          // 입사일
  EXEC_IN_STRT_DT: string;  // 투입시작일
  EXEC_IN_END_DT: string;   // 투입종료일
  WKG_ST_DIV_NM: string;    // 상태명
  EXEC_ING_BSN_NM: string;  // 투입중 프로젝트
  HQ_DIV_CD: string;        // 본부구분코드
  DEPT_DIV_CD: string;      // 부서구분코드
  CSF_CO_CD: string;        // 소속코드
  WKG_ST_DIV: string;       // 상태코드
  EXEC_ING_YN: string;      // 투입중유무
  OWN_OUTS_DIV: string;     // 구분코드
  OUTS_FIX_YN: string;      // 외주배정유무
  IN_FIX_DT: string;        // 외주배정확정일자
  IN_FIX_PRJT: string;      // 외주배정프로젝트
  DUTY_CD: string;          // 직책코드
  DUTY_DIV_CD: string;      // 투입인력직책
  TCN_GRD: string;          // 등급코드
}

/**
 * 컴포넌트 Props 인터페이스
 * ASIS: choiceEmpInit() 함수의 파라미터와 동일한 역할
 */
interface Props {
  defaultEmpNm?: string                    // 기본 직원명 (ASIS: txtEmpNm.text 초기값)
  defaultOwnOutDiv?: string                // 기본 자사/외주 구분 (ASIS: rdOwnOutDiv.selectedValue)
  defaultEmpList?: EmployeeInfo[]          // 기본 직원 목록 (ASIS: grdEmpList.dataProvider)
  onSelect: (empData: {                    // 선택 콜백 (ASIS: EvtDblClick 이벤트의 txtData 구조)
    empNo: string                          // [0]: 사번 (ASIS: grdEmpList.selectedItem.EMP_NO)
    ownOutsDiv: string                     // [1]: 자사외주구분 (ASIS: grdEmpList.selectedItem.OWN_OUTS_DIV)
    empNm: string                          // [2]: 사원명 (ASIS: grdEmpList.selectedItem.EMP_NM)
    csfCoCd: string                        // [3]: 소속명 (ASIS: grdEmpList.selectedItem.CSF_CO_CD)
    outsFixYn: string                      // [4]: 외주배정유무 (ASIS: grdEmpList.selectedItem.OUTS_FIX_YN)
    inFixDt: string                        // [5]: 외주배정확정일자 (ASIS: grdEmpList.selectedItem.IN_FIX_DT)
    inFixPrjt: string                      // [6]: 외주배정프로젝트 (ASIS: grdEmpList.selectedItem.IN_FIX_PRJT)
    dutyDivCd: string                      // [7]: 투입인력 직책구분코드 (ASIS: grdEmpList.selectedItem.DUTY_DIV_CD)
    tcnGrd: string                         // [8]: 현재 최종 기술등급 (ASIS: grdEmpList.selectedItem.TCN_GRD)
  }) => void
  onClose: () => void                      // 모달 닫기 콜백 (ASIS: PopUpManager.removePopUp())
}

/**
 * 컴포넌트 Ref 인터페이스
 * ASIS: public function choiceEmpInit(strEmpNm:String, OwnOutDiv:String, arrEmpList:ArrayCollection):void
 */
export interface EmployeeSearchModalRef {
  choiceEmpInit: (strEmpNm: string, ownOutDiv: string, empList: EmployeeInfo[]) => void
}

/**
 * 샘플 데이터 (개발/테스트용)
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
  /**
   * 직원 목록 상태 관리
   * ASIS: grdEmpList.dataProvider (ArrayCollection)
   * TOBE: useState로 상태 관리
   */
  const [employees, setEmployees] = useState<EmployeeInfo[]>(defaultEmpList)
  
  /**
   * 로딩 상태 관리
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false)
  
  /**
   * 직원명 검색어 상태 관리
   * ASIS: txtEmpNm.text
   * TOBE: useState로 상태 관리
   */
  const [empNm, setEmpNm] = useState(defaultEmpNm)
  
  /**
   * 자사/외주 구분 상태 관리
   * ASIS: rdOwnOutDiv.selectedValue
   * TOBE: useState로 상태 관리
   */
  const [ownOutDiv, setOwnOutDiv] = useState(defaultOwnOutDiv)
  
  /**
   * 퇴사자포함 상태 관리
   * ASIS: chkRetirYn.selected
   * TOBE: useState로 상태 관리
   */
  const [retirYn, setRetirYn] = useState(true)

  const { showToast } = useToast()

  /**
   * 직원 검색 함수 (API 호출)
   * ASIS: onSearchClick() 함수와 동일한 역할
   * 
   * 프로시저: COM_02_0411_S(?, ?, ?, ?, ?, ?)
   * 파라미터: 조회구분, 사원번호, 사원명, 자사외주구분, 퇴사자포함조회유무
   */
  const handleSearch = async () => {
    // ASIS: validation check
    if (!empNm.trim()) {
      showToast('사원명을 입력해주세요.', 'warning')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/COMZ080P00/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kb: '2', // 사원명으로 검색 (ASIS: strSrchKb)
          empNo: '', // 사원번호 (ASIS: 빈값)
          empNm: empNm.trim(), // 사원명 (ASIS: strEmpNm)
          ownOutsDiv: ownOutDiv === 'ALL' ? null : ownOutDiv, // 자사외주구분 (ASIS: OwnOutDiv)
          retirYn: retirYn ? 'Y' : 'N' // 퇴사자포함조회유무 (ASIS: chkRetirYn.selected)
        })
      })

      if (res.ok) {
        const empData = await res.json()
        setEmployees(empData.data)
        
        // ASIS: 검색 결과가 없고 검색어가 있는 경우 알림
        if (empData.data.length === 0 && empNm.trim()) {
          showToast('해당 직원명은 존재하지 않습니다.', 'warning')
        }
      } else {
        const errorData = await res.json()
        const errorMessage = errorData.message || '검색 중 오류가 발생했습니다.'
        showToast(errorMessage, 'error')
        setEmployees([])
      }
    } catch (e) {
      console.error('검색 실패:', e)
      showToast('검색 중 오류가 발생했습니다.', 'error')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * 직원 더블클릭 처리 함수 (ASIS 기반)
   * ASIS: onDoubleClick() 함수와 동일한 로직
   * 
   * 선택된 직원 정보를 부모 컴포넌트로 전달하고 팝업 닫기
   * ASIS: EvtDblClick 이벤트 발생 후 PopUpManager.removePopUp()
   */
  const handleDoubleClick = (employee: EmployeeInfo) => {
    // ASIS: evtDblClck.txtData 구조와 동일
    onSelect({
      empNo: employee.EMP_NO,                    // [0]: 사번 (ASIS: grdEmpList.selectedItem.EMP_NO)
      ownOutsDiv: employee.OWN_OUTS_DIV,        // [1]: 자사외주구분 (ASIS: grdEmpList.selectedItem.OWN_OUTS_DIV)
      empNm: employee.EMP_NM,                   // [2]: 사원명 (ASIS: grdEmpList.selectedItem.EMP_NM)
      csfCoCd: employee.CSF_CO_CD,              // [3]: 소속명 (ASIS: grdEmpList.selectedItem.CSF_CO_CD)
      outsFixYn: employee.OUTS_FIX_YN,          // [4]: 외주배정유무 (ASIS: grdEmpList.selectedItem.OUTS_FIX_YN)
      inFixDt: employee.IN_FIX_DT,              // [5]: 외주배정확정일자 (ASIS: grdEmpList.selectedItem.IN_FIX_DT)
      inFixPrjt: employee.IN_FIX_PRJT,          // [6]: 외주배정프로젝트 (ASIS: grdEmpList.selectedItem.IN_FIX_PRJT)
      dutyDivCd: employee.DUTY_DIV_CD,          // [7]: 투입인력 직책구분코드 (ASIS: grdEmpList.selectedItem.DUTY_DIV_CD)
      tcnGrd: employee.TCN_GRD                  // [8]: 현재 최종 기술등급 (ASIS: grdEmpList.selectedItem.TCN_GRD)
    })
    onClose()
  }

  /**
   * 테이블 행 번호 생성 함수
   * ASIS: setRowNum() 함수와 동일한 로직
   * 
   * @param index - 행 인덱스
   * @returns 행 번호 (1부터 시작)
   */
  const setRowNumber = (index: number) => {
    // ASIS: var index:int = grdEmpList.dataProvider.getItemIndex(cItem) + 1
    return String(index + 1)
  }

  /**
   * 자사/외주 구분 변경 처리
   * ASIS: onChangeOwnOutDiv() 함수와 동일한 역할
   */
  const handleOwnOutDivChange = (value: string) => {
    setOwnOutDiv(value)
  }

  /**
   * 퇴사자포함 체크박스 변경 처리
   * ASIS: chkRetirYn.selected 변경 이벤트
   */
  const handleRetirYnChange = (checked: boolean) => {
    setRetirYn(checked)
  }

  /**
   * 행 스타일 함수 (ASIS 기반)
   * ASIS: grdEmpListStyleFunc() 함수와 동일한 로직
   * 
   * @param employee - 직원 정보
   * @returns CSS 클래스명
   */
  const getRowStyle = (employee: EmployeeInfo) => {
    if (employee.WKG_ST_DIV === "3") {        // 퇴사 (ASIS: data["WKG_ST_DIV"] == "3")
      return "text-red-600"
    } else if (employee.WKG_ST_DIV === "2") { // 휴직 (ASIS: data["WKG_ST_DIV"] == "2")
      return "text-blue-600"
    } else if (employee.OWN_OUTS_DIV === "2" && employee.EXEC_ING_YN === "N") { // 철수한 외주인 경우 (ASIS: data["OWN_OUTS_DIV"] == "2" && data["EXEC_ING_YN"] == "N")
      return "text-red-600"
    }
    return ""
  }

  /**
   * 키보드 이벤트 처리 함수
   * ASIS: Enter 키 이벤트 처리
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  /**
   * 직원 선택 리스트 초기화 함수
   * ASIS: choiceEmpInit() 함수와 동일한 로직
   * 
   * @param strEmpNm - 초기 직원명
   * @param ownOutDiv - 초기 자사/외주 구분
   * @param empList - 초기 직원 목록
   */
  const choiceEmpInit = (strEmpNm: string, ownOutDiv: string, empList: EmployeeInfo[]) => {
    // ASIS: txtEmpNm.text = strEmpNm; rdOwnOutDiv.selectedValue = OwnOutDiv; grdEmpList.dataProvider = arrEmpList
    setEmpNm(strEmpNm)
    setOwnOutDiv(ownOutDiv)
    setEmployees(empList)
  }

  /**
   * 기본값이 변경되면 상태 업데이트
   * ASIS: init_Complete() 함수와 동일한 역할
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
   * ASIS: public function choiceEmpInit()
   */
  useImperativeHandle(ref, () => ({
    choiceEmpInit
  }))

  return (
    <div className="popup-wrapper">
      {/* 팝업 상단 헤더 - ASIS: TitleWindow의 title과 showCloseButton */}
      <div className="popup-header">
        <h3 className="popup-title">직원 검색</h3>
        <button className="popup-close" type="button" onClick={onClose}>×</button>
      </div>

      {/* 팝업 본문 - ASIS: VBox 내부 영역 */}
      <div className="popup-body">
        {/* 검색 영역 - ASIS: HBox 내 검색 조건 영역 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* 직원명 입력 - ASIS: txtEmpNm (FInputHangul) */}
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
                {/* 자사/외주 구분 - ASIS: rdOwnOutDiv (RadioButtonGroup) */}
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
                    {/* 퇴사자포함 체크박스 - ASIS: chkRetirYn (CheckBox) */}
                    <label>
                      <input 
                        type="checkbox" 
                        checked={retirYn}
                        onChange={(e) => handleRetirYnChange(e.target.checked)}
                      /> 퇴사자포함
                    </label>
                  </div>
                </td>
                {/* 조회 버튼 - ASIS: 조회 버튼 */}
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

        {/* 결과 그리드 - ASIS: grdEmpList (AdvancedDataGrid) */}
        <div className="gridbox-div mb-2">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn과 동일한 컬럼 구조 */}
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
                  {/* ASIS: labelFunction="setRowNum"과 동일 */}
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

        {/* 하단 안내문구 - ASIS: Label 컴포넌트들 */}
        <div className="text-xs text-blue-600 leading-snug whitespace-pre-wrap px-1 mb-3">
          ※ 외주 직원의 경우, 입사일은 부뜰 프로젝트 최초 투입일자이고 투입일과 철수일은 최종투입일과 철수일임.{"\n"}
          상태는 자사 직원일 경우 재직/퇴사/휴직으로 표시되고 외주일 경우에는 재직/철수로 표시됨.{"\n"}
          검색하고자 하는 직원이름을 모를 경우에는 마지막 입력에 <b>%</b> 붙여서 검색하면 됨.
        </div>

        {/* 종료 버튼 - ASIS: btnClose (Button) */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete" onClick={onClose}>종료</button>
        </div>
      </div>
    </div>
  );
})

export default EmployeeSearchPopupExtended;
