'use client';

import React, { useState } from 'react';
import '../common/common.css';

/**
 * 직원 정보 인터페이스
 */
interface EmployeeInfo {
  LIST_NO: string          // 목록 번호
  OWN_OUTS_NM: string     // 자사/외주 구분명
  EMP_NM: string          // 직원명
  EMP_NO: string          // 직원번호
  DUTY_CD_NM: string      // 직책 코드명
  TCN_GRD_NM: string      // 기술등급명
  PARTY_NM: string        // 소속명
  BSN_NM: string          // 사업명
  EXEC_IN_STRT_DT: string // 투입시작일
  EXEC_IN_END_DT: string  // 투입종료일
  RMK: string             // 비고
  HQ_DIV_CD: string       // 본부구분코드
  DEPT_DIV_CD: string     // 부서구분코드
}

/**
 * 컴포넌트 Props 인터페이스
 */
interface Props {
  defaultEmpNm?: string                    // 기본 직원명 (검색창 초기값)
  defaultEmpList?: EmployeeInfo[]          // 기본 직원 목록 (미리 로드된 데이터)
  onSelect: (empNo: string, ownOutsNm: string, empNm: string) => void  // 선택 콜백
  onClose: () => void                      // 모달 닫기 콜백
}

/**
 * 샘플 데이터 (필요시 주석 해제하여 사용)
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

export default function EmployeeSearchPopup({ 
  defaultEmpNm = '', 
  defaultEmpList = [],
  onSelect, 
  onClose 
}: Props) {
  // 직원 목록 상태 관리
  const [employees, setEmployees] = useState<EmployeeInfo[]>(defaultEmpList)
  // 직원명 검색어 상태 관리
  const [empNm, setEmpNm] = useState(defaultEmpNm)

  /**
   * 직원 더블클릭 처리 함수
   */
  const handleDoubleClick = (employee: EmployeeInfo) => {
    onSelect(employee.EMP_NO, employee.OWN_OUTS_NM, employee.EMP_NM)
    onClose()
  }

  /**
   * 테이블 행 번호 생성 함수
   */
  const setRowNumber = (index: number) => {
    return String(index + 1)
  }

  return (
    <div className="popup-wrapper">
      {/* 팝업 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">직원 검색</h3>
        <button className="popup-close" type="button" onClick={onClose}>×</button>
      </div>

      <div className="popup-body">
        {/* 검색 영역 */}
        <div className="search-div mb-4">
          <table className="search-table">
            <tbody>
              <tr>
                <th className="search-th w-[80px]">직원명</th>
                <td className="search-td w-[200px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-full" 
                    value={empNm}
                    onChange={(e) => setEmpNm(e.target.value)}
                    placeholder="직원명 입력"
                  />
                </td>
                <td className="search-td text-right" colSpan={6}>
                  <button className="btn-base btn-search">조회</button>
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

        {/* 종료 버튼 */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete" onClick={onClose}>종료</button>
        </div>
      </div>
    </div>
  );
}
