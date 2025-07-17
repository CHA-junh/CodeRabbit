'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../common/common.css';

/**
 * 직원 검색 팝업 컴포넌트
 * ASIS: COM_02_0400.mxml → TOBE: COMZ070P00.tsx
 * 
 * 주요 기능:
 * 1. 직원 목록 조회 (bsnNoLiseSel)
 * 2. 직원명 검색 (onSearchClick)
 * 3. 직원 선택(더블클릭) (onDoubleClick)
 * 4. 팝업 닫기 (PopUpManager.removePopUp)
 */

/**
 * 직원 정보 인터페이스
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
  BSN_NM: string;           // 사업명
  EXEC_IN_STRT_DT: string;  // 투입시작일
  EXEC_IN_END_DT: string;   // 투입종료일
  RMK: string;              // 비고
  HQ_DIV_CD: string;        // 본부구분코드
  DEPT_DIV_CD: string;      // 부서구분코드
}

/**
 * 컴포넌트 Props 인터페이스
 * ASIS: choiceEmpInit() 함수의 파라미터와 동일한 역할
 */
interface EmployeeSearchPopupProps {
  onSelect?: (empNo: string, ownOutsNm: string, empNm: string) => void  // 선택 콜백 (ASIS: EvtDblClick 이벤트)
  onClose?: () => void                      // 모달 닫기 콜백 (ASIS: PopUpManager.removePopUp())
  initialEmpNm?: string                    // 기본 직원명 (ASIS: txtEmpNm.text 초기값)
  initialEmpList?: EmployeeInfo[]          // 기본 직원 목록 (ASIS: grdEmpList.dataProvider)
  autoSearch?: boolean;                    // 자동 조회 여부
}

/**
 * 컴포넌트 Ref 인터페이스
 * ASIS: public function choiceEmpInit(strEmpNm:String, arrEmpList:ArrayCollection):void
 * ASIS: public function fnBsnNoSearch():void
 */
export interface EmployeeSearchPopupRef {
  choiceEmpInit: (strEmpNm: string, arrEmpList: EmployeeInfo[]) => void;
  fnBsnNoSearch: () => void;
}

/**
 * 샘플 데이터 (개발/테스트용)
 * ASIS: 실제 데이터는 bsnNoLiseSel HTTPService로 조회
 * TOBE: API 연동 후 실제 데이터로 교체 필요
 */
/*
const SAMPLE_EMPLOYEE_DATA: EmployeeInfo[] = [
  {
    LIST_NO: "1",
    OWN_OUTS_NM: "자사",
    EMP_NM: "성지훈",
    EMP_NO: "EMP001",
    DUTY_CD_NM: "사원",
    TCN_GRD_NM: "초급",
    PARTY_NM: "ITO사업본부/DP",
    BSN_NM: "현대해상 채널통합판매시스템 구축",
    EXEC_IN_STRT_DT: "2012/05/16",
    EXEC_IN_END_DT: "2012/06/22",
    RMK: "",
    HQ_DIV_CD: "HQ001",
    DEPT_DIV_CD: "DEPT001"
  },
  {
    LIST_NO: "2",
    OWN_OUTS_NM: "자사",
    EMP_NM: "김철수",
    EMP_NO: "EMP002",
    DUTY_CD_NM: "과장",
    TCN_GRD_NM: "중급",
    PARTY_NM: "서비스사업본부",
    BSN_NM: "KB캐피탈 자동차 TM시스템 구축",
    EXEC_IN_STRT_DT: "2016/11/03",
    EXEC_IN_END_DT: "2017/01/02",
    RMK: "",
    HQ_DIV_CD: "HQ002",
    DEPT_DIV_CD: "DEPT002"
  },
  {
    LIST_NO: "3",
    OWN_OUTS_NM: "외주",
    EMP_NM: "박영희",
    EMP_NO: "EMP003",
    DUTY_CD_NM: "차장",
    TCN_GRD_NM: "특급",
    PARTY_NM: "SI사업본부(25)",
    BSN_NM: "한화생명 AICC 구축",
    EXEC_IN_STRT_DT: "2024/07/01",
    EXEC_IN_END_DT: "2025/03/12",
    RMK: "특별 프로젝트",
    HQ_DIV_CD: "HQ003",
    DEPT_DIV_CD: "DEPT003"
  },
  {
    LIST_NO: "4",
    OWN_OUTS_NM: "자사",
    EMP_NM: "이민수",
    EMP_NO: "EMP004",
    DUTY_CD_NM: "대리",
    TCN_GRD_NM: "중급",
    PARTY_NM: "클라우드사업본부",
    BSN_NM: "삼성전자 클라우드 마이그레이션",
    EXEC_IN_STRT_DT: "2023/09/15",
    EXEC_IN_END_DT: "2024/02/28",
    RMK: "",
    HQ_DIV_CD: "HQ004",
    DEPT_DIV_CD: "DEPT004"
  },
  {
    LIST_NO: "5",
    OWN_OUTS_NM: "외주",
    EMP_NM: "최수진",
    EMP_NO: "EMP005",
    DUTY_CD_NM: "사원",
    TCN_GRD_NM: "초급",
    PARTY_NM: "디지털사업본부",
    BSN_NM: "LG화학 디지털 트랜스포메이션",
    EXEC_IN_STRT_DT: "2024/01/10",
    EXEC_IN_END_DT: "2024/06/30",
    RMK: "신입 사원",
    HQ_DIV_CD: "HQ005",
    DEPT_DIV_CD: "DEPT005"
  }
];
*/

const EmployeeSearchPopup = forwardRef<EmployeeSearchPopupRef, EmployeeSearchPopupProps>(({
  onSelect,
  onClose,
  initialEmpNm = '',
  initialEmpList = [],
  autoSearch = false
}, ref) => {
  /**
   * 직원 목록 상태 관리
   * ASIS: grdEmpList.dataProvider (ArrayCollection)
   * TOBE: useState로 상태 관리
   */
  const [employees, setEmployees] = useState<EmployeeInfo[]>(initialEmpList)
  
  /**
   * 직원명 검색어 상태 관리
   * ASIS: txtEmpNm.text
   * TOBE: useState로 상태 관리
   */
  const [empNm, setEmpNm] = useState(initialEmpNm)

  /**
   * 로딩 상태 관리
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false)

  /**
   * 초기화 및 자동 조회
   * ASIS: initialize="init()"
   */
  useEffect(() => {
    if (autoSearch) {
      handleSearch();
    }
  }, []);

  /**
   * choiceEmpInit
   * ASIS: choiceEmpInit(strEmpNm:String, arrEmpList:ArrayCollection):void 함수와 동일한 로직
   * 직원선택 리스트 화면 호출할 때 초기값 설정
   * @param strEmpNm - 초기 직원명
   * @param arrEmpList - 초기 직원 목록
   */
  const choiceEmpInit = (strEmpNm: string, arrEmpList: EmployeeInfo[]) => {
    // ASIS: txtEmpNm.text = strEmpNm; grdEmpList.dataProvider = arrEmpList
    setEmpNm(strEmpNm);
    setEmployees(arrEmpList);
  };

  /**
   * fnBsnNoSearch
   * ASIS: fnBsnNoSearch():void 함수와 동일한 로직
   * 창 열면서 자동조회
   */
  const fnBsnNoSearch = () => {
    // ASIS: init(); onSearchClick()
    handleSearch();
  };

  // ref를 통해 외부에서 접근 가능한 메서드 노출
  // ASIS: public function choiceEmpInit(), public function fnBsnNoSearch()
  useImperativeHandle(ref, () => ({
    choiceEmpInit,
    fnBsnNoSearch
  }));

  /**
   * 직원 더블클릭 처리 함수
   * ASIS: onDoubleClick() 함수와 동일한 로직
   * 
   * 선택된 직원 정보를 부모 컴포넌트로 전달하고 팝업 닫기
   * ASIS: EvtDblClick 이벤트 발생 후 PopUpManager.removePopUp()
   */
  const handleDoubleClick = (employee: EmployeeInfo) => {
    // ASIS: evtDblClck.txtData = grdEmpList.selectedItem.EMP_NO + "^" + grdEmpList.selectedItem.OWN_OUTS_NM + "^" + grdEmpList.selectedItem.EMP_NM
    if (onSelect) {
      onSelect(employee.EMP_NO, employee.OWN_OUTS_NM, employee.EMP_NM);
    }
    // ASIS: PopUpManager.removePopUp(this)
    if (onClose) {
      onClose();
    }
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
   * 키보드 이벤트 처리 함수
   * ASIS: 키보드 이벤트 처리와 동일
   * Enter: 검색 실행
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 직원 검색 기능 (구현 필요)
   * ASIS: onSearchClick() 함수와 동일한 역할
   * 
   * TODO: API 연동 구현 필요
   * - 엔드포인트: /api/employee/search
   * - 파라미터: 직원명 (empNm)
   * - 응답: 직원 목록 (EmployeeInfo[])
   */
  const handleSearch = async () => {
    // TODO: 실제 API 호출 구현
    console.log('직원 검색:', empNm)
    setLoading(true);
    try {
      // 임시로 샘플 데이터 사용 (실제로는 API 호출)
      // const response = await fetch('/api/employee/search', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ empNm })
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   setEmployees(data.data || []);
      // } else {
      //   alert('검색 중 오류가 발생했습니다.');
      //   setEmployees([]);
      // }
      
      // 임시 구현: 검색어가 있으면 필터링된 결과 반환
      if (empNm.trim()) {
        const filteredEmployees = initialEmpList.filter(emp => 
          emp.EMP_NM.includes(empNm.trim())
        );
        setEmployees(filteredEmployees);
      } else {
        setEmployees(initialEmpList);
      }
    } catch (error) {
      console.error('검색 오류:', error);
      alert('검색 중 오류가 발생했습니다.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="popup-wrapper">
      {/* 팝업 헤더 - ASIS: TitleWindow의 title과 showCloseButton */}
      <div className="popup-header">
        <h3 className="popup-title">직원 검색</h3>
        <button className="popup-close" type="button" onClick={onClose}>×</button>
      </div>

      <div className="popup-body">
        {/* 검색 영역 - ASIS: HBox 내 TextInput과 Button */}
        <div className="search-div mb-4">
          <table className="search-table">
            <tbody>
              <tr>
                {/* 직원명 입력 - ASIS: txtEmpNm (TextInput) */}
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
                {/* 조회 버튼 - ASIS: 조회 버튼 (visible=false"이지만 기능은 존재) */}
                <td className="search-td text-right" colSpan={6}>
                  <button 
                    className="btn-base btn-search"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? '조회중...' : '조회'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결과 그리드 - ASIS: grdEmpList (AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
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
                <th className="grid-th">최종프로젝트</th>
                <th className="grid-th">투입일</th>
                <th className="grid-th">철수일</th>
                <th className="grid-th">비고</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr 
                  key={index}
                  className="grid-tr cursor-pointer hover:bg-blue-50"
                  onDoubleClick={() => handleDoubleClick(employee)}
                >
                  {/* ASIS: labelFunction="setRowNum"과 동일 */}
                  <td className="grid-td text-center">{setRowNumber(index)}</td>
                  <td className="grid-td">{employee.OWN_OUTS_NM}</td>
                  <td className="grid-td">{employee.EMP_NM}</td>
                  <td className="grid-td">{employee.DUTY_CD_NM}</td>
                  <td className="grid-td">{employee.TCN_GRD_NM}</td>
                  <td className="grid-td">{employee.PARTY_NM}</td>
                  <td className="grid-td">{employee.BSN_NM}</td>
                  <td className="grid-td">{employee.EXEC_IN_STRT_DT}</td>
                  <td className="grid-td">{employee.EXEC_IN_END_DT}</td>
                  <td className="grid-td">{employee.RMK}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 검색 결과가 없을 때 표시 */}
        {employees.length === 0 && (
          <p className="text-center text-gray-500 py-4">🔍 검색 결과가 없습니다.</p>
        )}

        {/* 종료 버튼 - ASIS: btnClose (Button) */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete" onClick={onClose}>종료</button>
        </div>
      </div>
    </div>
  );
});

export default EmployeeSearchPopup;
