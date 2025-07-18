'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * 등급별 단가 데이터 인터페이스
 * ASIS: AdvancedDataGrid의 dataField와 대응
 */
interface GradeUnitPriceData {
  TCN_GRD_NM: string; // 등급 (ASIS: dataField="TCN_GRD_NM")
  DUTY_NM: string;     // 직책 (ASIS: dataField=DUTY_NM)
  UPRC: string;        // 단가 (ASIS: dataField="UPRC")
}

/**
 * 팝업 Props 인터페이스
 */
interface GradeUnitPricePopupProps {
  onClose?: () => void;
  onSelect?: (selectedPrice: string) => void;
  initialGubun?: string;    // 자사/외주 구분 (1: 자사, 2: 외주)
  initialYear?: string;      // 초기 년도
  autoSearch?: boolean;      // 자동 조회 여부
}

/**
 * 컴포넌트 Ref 인터페이스
 * ASIS: public function fnSearch():void
 */
export interface GradeUnitPricePopupRef {
  setUntPrcInfo: (param: { ownOutsDiv: string; year: string }) => void;
  fnSearch: () => void;
}

/**
 * 등급별 단가 조회 팝업
 * ASIS: COM_01_0300.mxml → TOBE: COMZ030M00.tsx
 * 
 * 주요 기능:
 * 1. 등급별 단가 조회 (USP_UNTPRC_SEL)
 * 2. 부모창에서 데이터 전달 받기 (setUntPrcInfo)
 * 3. 더블클릭 시 단가 선택 (onDoubleClick)
 * 4. 자동 조회 기능 (fnSearch)
 * 
 * ASIS 대응 관계:
 * - TitleWindow → popup-wrapper
 * - AdvancedDataGrid → table
 * - RadioButtonGroup → radio buttons
 * - FInputNumber → select
 * - CurrencyFormatter → formatCurrency
 */
const GradeUnitPricePopup = forwardRef<GradeUnitPricePopupRef, GradeUnitPricePopupProps>(({
  onClose,
  onSelect,
  initialGubun = '1',
  initialYear,
  autoSearch = false
}, ref) => {
  const { showToast } = useToast();
  /**
   * 자사/외주 구분 상태 관리
   * ASIS: rdIODiv.selectedValue
   */
  const [radioValue, setRadioValue] = useState(initialGubun);
  
  /**
   * 년도 상태 관리
   * ASIS: txtYrNm.text
   */
  const [year, setYear] = useState(initialYear || new Date().getFullYear().toString());
  
  /**
   * 그리드 데이터 상태 관리
   * ASIS: initDG (ArrayCollection)
   */
  const [gridData, setGridData] = useState<GradeUnitPriceData[]>([]);
  
  /**
   * 로딩 상태 관리
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false);
  
  /**
   * 선택된 행 인덱스
   * ASIS: grdUntPrc.selectedIndex
   */
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

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
   * setUntPrcInfo
   * ASIS: setUntPrcInfo(gubun:String, bsnStrtYy:String) 함수와 동일한 로직
   * 자사구분, 프로젝트 시작년도를 param data로 받아서 셋팅할 수 있게 함
   * @param param { ownOutsDiv: string, year: string }
   */
  const setUntPrcInfo = (param: { ownOutsDiv: string; year: string }) => {
    setRadioValue(param.ownOutsDiv);
    setYear(param.year);
  };

  // ref를 통해 외부에서 접근 가능한 메서드 노출
  // ASIS: public function fnSearch():void
  useImperativeHandle(ref, () => ({
    setUntPrcInfo,
    fnSearch: handleSearch
  }));

  /**
   * 단가 검색 함수
   * ASIS: onSearchClick() 함수와 동일한 로직
   * 
   * 프로시저: USP_UNTPRC_SEL(?, ?, ?)
   * 파라미터: 자사/외주구분, 년도
   */
  const handleSearch = async () => {
    // ASIS: validation check
    if (!year.trim()) {
      showToast('안내', '년도를 입력하세요.', 'info');
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
      
      if (res.ok) {
        const result = await res.json();
        setGridData(Array.isArray(result.data) ? result.data : []);
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.message || '등급별 단가 조회 중 오류가 발생했습니다.';
        showToast('경고', errorMessage, 'warning');
        setGridData([]);
      }
    } catch (error) {
      console.error('등급별 단가 조회 오류:', error);
      showToast('오류', '등급별 단가 조회 중 오류가 발생했습니다.', 'error');
      setGridData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 더블클릭 이벤트 처리
   * ASIS: onDoubleClick() 함수와 동일한 로직
   * 
   * 더블클릭 시 선택된 단가를 부모창으로 전달하고 팝업 닫기
   */
  const handleRowDoubleClick = (index: number) => {
    if (gridData && gridData[index]) {
      const selectedItem = gridData[index];
      if (onSelect) {
        onSelect(selectedItem.UPRC);
      }
      if (onClose) {
        onClose();
      }
    }
  };

  /**
   * 행 클릭 시 선택 상태 관리
   * ASIS: grdUntPrc.selectedIndex 관리
   */
  const handleRowClick = (index: number) => {
    setSelectedRow(index);
  };

  /**
   * 팝업 닫기
   * ASIS: PopUpManager.removePopUp(this)
   */
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  /**
   * 키보드 이벤트 처리 함수
   * ASIS: 키보드 이벤트 처리와 동일
   * Enter: 검색 실행
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 숫자 포맷팅 (ASIS의 CurrencyFormatter 대체)
   * ASIS: moneyFormat currencySymbol=""
   */
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
      {/* 팝업 헤더 - ASIS: TitleWindow title */}
      <div className="popup-header">
        <h3 className="popup-title">등급별 단가 조회</h3>
        <button className="popup-close" type="button" onClick={handleClose}>×</button>
      </div>

      <div className="popup-body scroll-area">
        {/* 조회 조건 영역 - ASIS: 상단 검색 조건 영역 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* 자사/외주 구분 - ASIS: rdIODiv (RadioButtonGroup) */}
                <th className="search-th w-[100px]">자사/외주 구분</th>
                <td className="search-td w-[120px]">
                  <div className="flex items-center gap-4 text-sm">
                    <label><input type="radio" name="gubun" value="1" checked={radioValue === '1'} onChange={e => setRadioValue(e.target.value)} /> 자사</label>
                    <label><input type="radio" name="gubun" value="2" checked={radioValue === '2'} onChange={e => setRadioValue(e.target.value)} /> 외주</label>
                  </div>
                </td>
                {/* 년도 입력 - ASIS: txtYrNm (FInputNumber) */}
                <th className="search-th w-[70px]">년도</th>
                <td className="search-td w-[100px]">
                  <select
                    className="combo-base w-full"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    onKeyDown={handleKeyDown}
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
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn headerText="등급" dataField="TCN_GRD_NM" */}
                <th className="grid-th">등급</th>
                {/* ASIS: AdvancedDataGridColumn headerText="직책" dataField="DUTY_NM" */}
                <th className="grid-th">직책</th>
                {/* ASIS: AdvancedDataGridColumn headerText="단가 dataField="UPRC" formatter="{moneyFormat}" */}
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

        {/* 하단 버튼 - ASIS: btnClose */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete" onClick={handleClose}>종료</button>
        </div>
      </div>
    </div>
  );
});

export default GradeUnitPricePopup;
