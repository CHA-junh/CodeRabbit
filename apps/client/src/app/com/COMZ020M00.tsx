'use client';

import React, { useState, useEffect } from 'react';
import '../common/common.css';

/**
 * 단가 데이터 인터페이스
 * ASIS COM_01_0200.mxml의 데이터 구조를 기반으로 정의
 */
interface UnitPriceData {
  OWN_OUTS_DIV: string;      // 자사/외주 구분 (1: 자사, 2: 외주)
  OWN_OUTS_DIV_NM: string;   // 구분명 (자사/외주)
  YR: string;                // 년도
  TCN_GRD: string;           // 기술등급 코드
  TCN_GRD_NM: string;        // 기술등급명 (초급/중급/고급)
  DUTY_CD: string;           // 직책 코드
  DUTY_NM: string;           // 직책명 (사원/대리/과장 등)
  UPRC: string;              // 단가 (원)
}

/**
 * 등급별 단가 등록 화면
 * ASIS: COM_01_0200.mxml → TOBE: COMZ020M00.tsx
 * 
 * 주요 기능:
 * 1. 등급별 단가 조회 (COM_01_0201_S)
 * 2. 등급별 단가 등록/수정 (COM_01_0202_T)
 * 3. 등급별 단가 삭제 (COM_01_0203_D)
 */
export default function MainPage() {
  /**
   * 년도 범위 설정
   * 현재 년도부터 이전 N년까지의 범위를 설정
   */
  const YEAR_RANGE = 10; // 이전 10년까지

  /**
   * 조회 조건 상태 관리
   * 단가 조회 시 사용하는 조건들
   */
  const [searchCondition, setSearchCondition] = useState({
    type: '1', // 1: 자사, 2: 외주 (ASIS: rdIODiv.selectedValue)
    year: new Date().getFullYear().toString(), // 현재 년도 (ASIS: txtYrNm.text)
  });

  /**
   * 폼 데이터 상태 관리
   * 단가 저장/삭제 시 사용하는 데이터들
   */
  const [formData, setFormData] = useState({
    type: '1', // 1: 자사, 2: 외주
    year: new Date().getFullYear().toString(), // 년도
    grade: '', // 기술등급 코드 (ASIS: cbTcnGrd.value)
    position: '', // 직책 코드 (ASIS: cbDutyCd.value)
    price: '', // 단가 (ASIS: txtUnitPrice.getValue())
  });

  /**
   * 그리드 데이터 상태 관리
   * ASIS: initDG (ArrayCollection)
   */
  const [rows, setRows] = useState<UnitPriceData[]>([]);
  
  /**
   * 로딩 상태 관리
   * API 호출 중 사용자에게 피드백 제공
   */
  const [loading, setLoading] = useState(false);
  
  /**
   * 선택된 행 인덱스
   * ASIS: grdUntPrc.selectedIndex
   */
  const [selectedRow, setSelectedRow] = useState<number>(-1);

  /**
   * 코드 데이터 상태 관리
   * ASIS: cbTcnGrd.setLargeCode('104', ''), cbDutyCd.setLargeCode('105', '')
   */
  const [gradeOptions, setGradeOptions] = useState<Array<{data: string, label: string}>>([]);
  const [positionOptions, setPositionOptions] = useState<Array<{data: string, label: string}>>([]);

  /**
   * 컴포넌트 초기화
   * ASIS: init() 함수와 동일한 역할
   */
  useEffect(() => {
    // 페이지 로드 시 코드 데이터만 로드 (단가 데이터는 수동 조회)
    loadCodeData();
  }, []);

  /**
   * 코드 조회 함수
   * @param largeCategoryCode - 대분류 코드
   * @returns 코드 데이터 배열
   */
  const fetchCodeData = async (largeCategoryCode: string): Promise<Array<{data: string, label: string}>> => {
    try {
      const response = await fetch('/api/code/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          largeCategoryCode: largeCategoryCode
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error(`코드 조회 오류 (${largeCategoryCode}):`, error);
      return [];
    }
  };

  /**
   * 코드 데이터 로드
   * ASIS: cbTcnGrd.setLargeCode('104', ''), cbDutyCd.setLargeCode('105', '')
   */
  const loadCodeData = async () => {
    try {
      // 등급 코드와 직책 코드를 병렬로 조회
      const [gradeData, positionData] = await Promise.all([
        fetchCodeData('104'), // 등급 코드 조회
        fetchCodeData('105')  // 직책 코드 조회
      ]);

      setGradeOptions(gradeData);
      setPositionOptions(positionData);
    } catch (error) {
      console.error('코드 데이터 로드 오류:', error);
    }
  };

  /**
   * 조회 조건 변경 핸들러
   * 자사/외주 구분, 년도 변경 시 사용
   */
  const handleSearchConditionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchCondition(prev => ({ ...prev, [name]: value }));
  };

  /**
   * 폼 입력값 변경 핸들러
   * ASIS: 각 입력 필드의 change 이벤트와 동일
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * 등급별 단가 조회 기능
   * ASIS: onSearchClick() 함수와 동일한 로직
   * 
   * 프로시저: COM_01_0201_S(?, ?, ?)
   * 파라미터: 자사/외주구분, 년도
   */
  const handleSearch = async () => {
    // ASIS: validation check
    if (!searchCondition.year) {
      alert('년도를 입력하세요.');
      return;
    }

    // ASIS: 폼 초기화
    setFormData(prev => ({
      ...prev,
      grade: '',
      position: '',
      price: '',
    }));
    setSelectedRow(-1);

    setLoading(true);
    try {
      const response = await fetch('/api/unit-price/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownOutsDiv: searchCondition.type, // 자사/외주 구분 (조회조건 사용)
          year: searchCondition.year, // 년도 (조회조건 사용)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRows(data.data || []);
        
        // ASIS: 조회 후 첫번째 행 클릭한 효과 주기
        if (data.data && data.data.length > 0) {
          setSelectedRow(0);
          handleRowClick(0);
        }
      } else {
        alert('조회 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('검색 오류:', error);
      alert('조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 그리드 행 클릭 이벤트
   * ASIS: onClickGrid(idx:int) 함수와 동일한 로직
   * 
   * 선택된 행의 데이터를 폼에 자동 입력
   */
  const handleRowClick = (index: number) => {
    setSelectedRow(index);
    console.log(rows[index]);
    if (rows[index]) {
      const row = rows[index];
      // ASIS: 폼에 선택된 행 데이터 설정 (검색 조건은 유지)
      setFormData(prev => ({
        ...prev, // 기존 검색 조건 유지 (type, year)
        type: row.OWN_OUTS_DIV, // 자사/외주 구분 (히든값에서 가져옴)
        year: row.YR, // 년도 (히든값에서 가져옴)
        grade: row.TCN_GRD, // 기술등급 코드
        position: row.DUTY_CD, // 직책 코드
        price: String(row.UPRC), // 단가 (문자열로 변환)
      }));
    }
  };

  /**
   * 단가 저장 기능
   * ASIS: onSaveClick() 함수와 동일한 로직
   * 
   * 프로시저: COM_01_0202_T(?, ?, ?, ?, ?, ?)
   * 파라미터: 자사/외주구분, 년도, 기술등급, 직책, 단가
   */
  const handleSave = async () => {
    // ASIS: validation check
    if (!validateForm()) {
      return;
    }

    if (!formData.price) {
      alert('단가를 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/unit-price/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownOutsDiv: formData.type, // 자사/외주 구분
          year: formData.year, // 년도
          tcnGrd: formData.grade, // 기술등급
          dutyCd: formData.position, // 직책
          unitPrice: formData.price, // 단가
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.rtn === 'SUCCESS' || data.rtn === '1') {
          // ASIS: 저장 성공 후 메시지 표시
          alert('저장되었습니다.');
          handleSearch(); // ASIS: 다시 조회
          clearForm(); // ASIS: 폼 초기화
        } else {
          // 실패 시 Oracle 에러 메시지 표시
          const errorMessage = data.rtn || '저장 중 오류가 발생했습니다.';
          alert(`저장 실패: ${errorMessage}`);
        }
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 단가 삭제 기능
   * ASIS: onDelClick() 함수와 동일한 로직
   * 
   * 프로시저: COM_01_0203_D(?, ?, ?, ?, ?)
   * 파라미터: 자사/외주구분, 년도, 기술등급, 직책
   */
  const handleDelete = async () => {
    // ASIS: validation check
    if (!validateForm()) {
      return;
    }

    // ASIS: 사용자 확인
    if (!confirm('선택한 항목을 삭제하시겠습니까?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/unit-price/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownOutsDiv: formData.type, // 자사/외주 구분
          year: formData.year, // 년도
          tcnGrd: formData.grade, // 기술등급
          dutyCd: formData.position, // 직책
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.rtn === 'SUCCESS' || data.rtn === '1') {
          // ASIS: 삭제 성공 후 메시지 표시
          alert('삭제되었습니다.');
          handleSearch(); // ASIS: 다시 조회
          clearForm(); // ASIS: 폼 초기화
        } else {
          // 실패 시 Oracle 에러 메시지 표시
          const errorMessage = data.rtn || '삭제 중 오류가 발생했습니다.';
          alert(`삭제 실패: ${errorMessage}`);
        }
      } else {
        alert('삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 폼 검증 함수
   * ASIS: chkValidation():Boolean 함수와 동일한 로직
   * 
   * @returns {boolean} 검증 통과 여부
   */
  const validateForm = (): boolean => {
    // ASIS: 년도 필수 입력 체크
    if (!formData.year) {
      alert('년도를 입력하세요.');
      return false;
    }

    // ASIS: 기술등급 필수 입력 체크
    if (!formData.grade) {
      alert('기술등급을 입력하세요.');
      return false;
    }

    // ASIS: 자사인 경우 직책 필수 입력 체크
    if (formData.type === '1' && !formData.position) {
      alert('직책을 입력하세요.');
      return false;
    }

    return true;
  };

  /**
   * 폼 초기화 함수
   * ASIS: 저장/삭제 성공 후 폼 초기화와 동일
   */
  const clearForm = () => {
    setFormData(prev => ({
      ...prev,
      grade: '',
      position: '',
      price: '',
    }));
    setSelectedRow(-1);
  };

  /**
   * 종료 기능
   * ASIS: PopUpManager.removePopUp(this)와 동일
   */
  const handleClose = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  };

  return (
    <div className="mdi">
      {/* 검색 영역 - ASIS: 상단 검색 조건 영역 */}
      <div className="search-div mb-4">
        <table className="search-table table-fixed">
          <tbody>
            <tr className="search-tr">
              {/* 자사/외주 구분 - ASIS: rdIODiv (RadioButtonGroup) */}
              <th className="search-th w-[130px]">자사/외주 구분</th>
              <td className="search-td w-[120px]">
                <label className="mr-3">
                  <input
                    type="radio"
                    name="type"
                    value="1"
                    checked={searchCondition.type === '1'}
                    onChange={handleSearchConditionChange}
                    className="mr-1"
                  />
                  자사
                </label>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="2"
                    checked={searchCondition.type === '2'}
                    onChange={handleSearchConditionChange}
                    className="mr-1"
                  />
                  외주
                </label>
              </td>
              {/* 년도 입력 - ASIS: txtYrNm (FInputNumber) */}
              <th className="search-th w-[80px]">년도</th>
              <td className="search-td w-[150px]">
                <select
                  name="year"
                  value={searchCondition.year}
                  onChange={handleSearchConditionChange}
                  className="input-base input-default w-[80px] mr-2"
                >
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    for (let i = 0; i <= YEAR_RANGE; i++) {
                      const year = currentYear - i;
                      years.push(
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      );
                    }
                    return years;
                  })()}
                </select>
              </td>
              {/* 조회 버튼 - ASIS: 조회 버튼 */}
              <td className="search-td text-right">
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

      {/* 그리드 영역 - ASIS: grdUntPrc (AdvancedDataGrid) */}
      <div className="gridbox-div mb-4">
        <div className="grid-scroll">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th w-[120px]">등급</th>
                <th className="grid-th w-[120px]">직책</th>
                <th className="grid-th w-[150px]">단가</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr 
                  key={index} 
                  className={`grid-tr cursor-pointer ${selectedRow === index ? 'bg-blue-50' : ''}`}
                  onClick={() => handleRowClick(index)}
                  data-own-outs-div={row.OWN_OUTS_DIV}
                  data-year={row.YR}
                >
                  <td className="grid-td">{row.TCN_GRD_NM}</td>
                  <td className="grid-td">{row.DUTY_NM}</td>
                  {/* ASIS: moneyFormat 적용 */}
                  <td className="grid-td text-right pr-4">
                    {parseInt(row.UPRC).toLocaleString()}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="grid-td text-center text-gray-500">
                    {loading ? '조회 중...' : '조회 버튼을 클릭하여 데이터를 조회하세요.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 등록 영역 - ASIS: 하단 입력 폼 영역 */}
      <div className="mb-3">
        <table className="form-table mb-4">
          <tbody>
            <tr className="form-tr">
              {/* 기술등급 선택 - ASIS: cbTcnGrd (COM_03_0100) */}
              <th className="form-th w-[80px]">등급</th>
              <td className="form-td w-[180px]">
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="input-base input-default w-full"
                >
                  <option value="">선택</option>
                  {gradeOptions.map((option) => (
                    <option key={option.data} value={option.data}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>

              {/* 직책 선택 - ASIS: cbDutyCd (COM_03_0100) */}
              <th className="form-th w-[80px]">직책</th>
              <td className="form-td w-[180px]">
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="input-base input-default w-full"
                >
                  <option value="">선택</option>
                  {positionOptions.map((option) => (
                    <option key={option.data} value={option.data}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>

              {/* 단가 입력 - ASIS: txtUnitPrice (FInputCurrency) */}
              <th className="form-th w-[80px]">단가</th>
              <td className="form-td w-[180px]">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-base input-default w-full"
                    placeholder="0"
                  />
                  <span className="m-1">원</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 버튼 영역 - ASIS: 하단 버튼 영역 */}
      <div className="flex justify-end gap-2">
        {/* 삭제 버튼 - ASIS: 삭제 버튼 */}
        <button 
          className="btn-base btn-delete"
          onClick={handleDelete}
          disabled={loading}
        >
          삭제
        </button>
        {/* 저장 버튼 - ASIS: 저장 버튼 */}
        <button 
          className="btn-base btn-act"
          onClick={handleSave}
          disabled={loading}
        >
          저장
        </button>
        {/* 종료 버튼 - ASIS: 종료 버튼 */}
        <button 
          className="btn-base btn-delete"
          onClick={handleClose}
          disabled={loading}
        >
          종료
        </button>
      </div>
    </div>
  );
}
