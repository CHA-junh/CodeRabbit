import { useEffect, useState } from 'react';

// 부서구분코드 조회를 위한 타입
export interface DeptDivCode {
  code: string; // 코드값
  name: string; // 코드명
}

/**
 * 부서구분코드 목록을 조회하는 커스텀 훅
 * - 최초 마운트 시 1회 API 호출
 * - 실패 시 빈 배열 반환
 *
 * @returns DeptDivCode[] 코드 목록
 * @example
 *   const codes = useCommonCodes();
 *   // codes: [{ code: '112', name: '부서' }, ...]
 */
export const useDeptDivCodes = () => {
  const [codes, setCodes] = useState<DeptDivCode[]>([]);
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        // 개발/운영 환경에 따라 API 주소 자동 분기
        const url = process.env.NODE_ENV === 'development'
          ? 'http://localhost:8080/api/common/dept-div-codes'
          : '/api/common/dept-div-codes';
        const res = await fetch(url);
        const data = await res.json();
        setCodes(Array.isArray(data) ? data : (data.data ?? []));
      } catch {
        setCodes([]);
      }
    };
    fetchCodes();
  }, []);
  return codes;
}; 
