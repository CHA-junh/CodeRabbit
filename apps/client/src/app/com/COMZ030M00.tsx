'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../common/common.css';

interface GradeUnitPriceData {
  TCN_GRD_NM: string; // 등급
  DUTY_NM: string;     // 직책
  UPRC: string;        // 단가
}

interface GradeUnitPricePopupProps {
  onClose?: () => void;
  onSelect?: (selectedPrice: string) => void;
  initialGubun?: string;    // 자사/외주 구분 (1: 자사, 2: 외주)
  initialYear?: string;      // 초기 년도
  autoSearch?: boolean;      // 자동 조회 여부
}

/**
 * 컴포넌트 Ref 인터페이스
 */
export interface GradeUnitPricePopupRef {
  setUntPrcInfo: (param: { ownOutsDiv: string; year: string }) => void;
  fnSearch: () => void;
}

const GradeUnitPricePopup = forwardRef<GradeUnitPricePopupRef, GradeUnitPricePopupProps>(({
  onClose,
  onSelect,
  initialGubun = '1',
  initialYear,
  autoSearch = false
}, ref) => {
  const [radioValue, setRadioValue] = useState(initialGubun);
  const [year, setYear] = useState(initialYear || new Date().getFullYear().toString());
  const [gridData, setGridData] = useState<GradeUnitPriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // 초기화 및 자동 조회
  useEffect(() => {
    if (autoSearch) {
      handleSearch();
    }
  }, []);

  /**
   * setUntPrcInfo
   * 자사구분, 프로젝트 시작년도를 param data로 받아서 셋팅할 수 있게 함
   * @param param { ownOutsDiv: string, year: string }
   */
  const setUntPrcInfo = (param: { ownOutsDiv: string; year: string }) => {
    setRadioValue(param.ownOutsDiv);
    setYear(param.year);
  };

  // ref를 통해 외부에서 접근 가능한 메서드 노출
  useImperativeHandle(ref, () => ({
    setUntPrcInfo,
    fnSearch: handleSearch
  }));

  /**
   * 단가 검색 함수
   * API를 호출하여 단가 정보를 검색하고 결과를 상태에 저장
   */
  const handleSearch = async () => {
    if (!year.trim()) {
      alert('년도를 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/unit-price/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ownOutsDiv: radioValue, 
          year,
          bsnNo: null 
        })
      });
      
      if (!res.ok) {
        throw new Error('서버 통신 오류');
      }
      
      const result = await res.json();
      setGridData(result.data || []);
    } catch (error) {
      console.error('등급별 단가 조회 오류:', error);
      alert('등급별 단가 조회 중 오류가 발생했습니다.');
      setGridData([]);
    } finally {
      setLoading(false);
    }
  };



  // 더블클릭 이벤트 처리
  const handleRowDoubleClick = (index: number) => {
    const selectedItem = gridData[index];
    if (selectedItem && onSelect) {
      onSelect(selectedItem.UPRC);
    }
    if (onClose) {
      onClose();
    }
  };

  // 행 클릭 시 선택 상태 관리
  const handleRowClick = (index: number) => {
    setSelectedRow(index);
  };

  // 팝업 닫기
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // 숫자 포맷팅 (ASIS의 CurrencyFormatter 대체)
  const formatCurrency = (value: string) => {
    try {
      // 빈 값이나 null 체크
      if (!value || value === '') return '0';
      
      // 문자열에서 콤마 제거 후 숫자로 변환
      const cleanValue = value.toString().replace(/[^\d.-]/g, '');
      const numValue = parseFloat(cleanValue) || 0;
      
      // 음수 체크
      if (numValue < 0) return '0';
      
      // 천 단위 콤마 포맷팅
      return numValue.toLocaleString('ko-KR');
    } catch (error) {
      console.error('숫자 포맷팅 오류:', error, 'value:', value);
      return '0';
    }
  };

  return (
    <div className="popup-wrapper min-w-[500px]">
      <div className="popup-header">
        <h3 className="popup-title">등급별 단가 조회</h3>
        <button className="popup-close" type="button" onClick={handleClose}>×</button>
      </div>

      <div className="popup-body scroll-area">
        {/* 조회 조건 영역 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                <th className="search-th w-[100px]">자사/외주 구분</th>
                <td className="search-td w-[120px]">
                  <div className="flex items-center gap-4 text-sm">
                    <label><input type="radio" name="gubun" value="1" checked={radioValue === '1'} onChange={e => setRadioValue(e.target.value)} /> 자사</label>
                    <label><input type="radio" name="gubun" value="2" checked={radioValue === '2'} onChange={e => setRadioValue(e.target.value)} /> 외주</label>
                  </div>
                </td>
                <th className="search-th w-[70px]">년도</th>
                <td className="search-td w-[100px]">
                  <select
                    className="combo-base w-full"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                  >
                    {Array.from({ length: 11 }, (_, i) => {
                      const y = new Date().getFullYear() - 5 + i;
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                </td>

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

        {/* 그리드 영역 */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th">등급</th>
                <th className="grid-th">직책</th>
                <th className="grid-th text-right">단가</th>
              </tr>
            </thead>
            <tbody>
              {gridData.length > 0 ? (
                gridData.map((item, idx) => (
                  <tr 
                    className={`grid-tr cursor-pointer ${selectedRow === idx ? 'bg-blue-50' : ''}`}
                    key={idx}
                    onClick={() => handleRowClick(idx)}
                    onDoubleClick={() => handleRowDoubleClick(idx)}
                  >
                    <td className="grid-td text-center">{item.TCN_GRD_NM}</td>
                    <td className="grid-td text-center">{item.DUTY_NM}</td>
                    <td className="grid-td text-right">{formatCurrency(item.UPRC)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="grid-td text-center text-gray-500">
                    {loading ? '조회중...' : '조회된 데이터가 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete" onClick={handleClose}>종료</button>
        </div>
      </div>
    </div>
  );
});

export default GradeUnitPricePopup;
