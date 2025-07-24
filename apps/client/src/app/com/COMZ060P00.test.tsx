import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import DeptNumberSearchPopup from './COMZ060P00';

// Mock fetch
global.fetch = jest.fn();

// Mock window.opener and window.close
Object.defineProperty(window, 'opener', {
  value: {
    postMessage: jest.fn()
  },
  writable: true
});
Object.defineProperty(window, 'close', {
  value: jest.fn(),
  writable: true
});

// Mock useDeptDivCodes hook
const mockDeptDivCodes = jest.fn();
jest.mock('@/modules/auth/hooks/useCommonCodes', () => ({
  useDeptDivCodes: () => mockDeptDivCodes()
}));

// Mock useToast hook
const mockShowToast = jest.fn();
jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast
  })
}));

// Mock useSearchParams hook
const mockUseSearchParams = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams()
}));

describe('COMZ060P00 - 부서번호검색화면', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
    (window.opener.postMessage as jest.Mock).mockClear();
    (window.close as jest.Mock).mockClear();
    mockShowToast.mockClear();
    mockDeptDivCodes.mockClear();
    mockUseSearchParams.mockClear();

    // Default mock implementations
    mockDeptDivCodes.mockReturnValue([
      { code: '001', name: '개발부서' },
      { code: '002', name: '영업부서' },
      { code: '003', name: '기획부서' }
    ]);
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    // Mock fetch success response by default
    (global.fetch as jest.Mock).mockImplementation((url: string, options: RequestInit) => {
      if (url.includes('/api/COMZ060P00/search')) {
        const body = JSON.parse(options.body as string);
        const deptNo = body.param[0];
        const year = body.param[1];
        
        if (deptNo === '검색결과없음') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([])
          });
        } else if (deptNo === '에러발생') {
          return Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: 'Network error' })
          });
        }
        
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { 
              deptNo: 'D001', 
              deptNm: '개발부서', 
              strtDt: '2024-01-01', 
              endDt: '2024-12-31', 
              hqDivNm: 'IT본부', 
              deptDivNm: '개발부서' 
            },
            { 
              deptNo: 'D002', 
              deptNm: '영업부서', 
              strtDt: '2024-01-01', 
              endDt: '2024-12-31', 
              hqDivNm: '영업본부', 
              deptDivNm: '영업부서' 
            }
          ])
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });
  });

  test('사용자가 부서번호검색 화면에 접속하면 모든 주요 기능이 표시된다', async () => {
    render(<DeptNumberSearchPopup />);

    // 헤더 확인
    expect(screen.getByText('부서번호 검색')).toBeInTheDocument();

    // 검색 조건 필드 확인
    expect(screen.getByText('년도')).toBeInTheDocument();
    expect(screen.getAllByText('부서번호')[0]).toBeInTheDocument(); // 첫 번째 '부서번호' (테이블 헤더)
    expect(screen.getAllByText('부서구분')[0]).toBeInTheDocument(); // 첫 번째 '부서구분' (테이블 헤더)

    // 입력 필드 확인
    expect(screen.getByLabelText('년도')).toBeInTheDocument();
    expect(screen.getByLabelText('부서번호')).toBeInTheDocument();
    expect(screen.getByLabelText('부서구분')).toBeInTheDocument();

    // 조회 버튼 확인
    expect(screen.getByRole('button', { name: '조회' })).toBeInTheDocument();

    // 종료 버튼 확인
    expect(screen.getByRole('button', { name: '종료' })).toBeInTheDocument();

    // 부서구분 콤보박스 옵션 확인
    expect(screen.getByDisplayValue('전체')).toBeInTheDocument();
    expect(screen.getByText('개발부서')).toBeInTheDocument();
    expect(screen.getByText('영업부서')).toBeInTheDocument();
    expect(screen.getByText('기획부서')).toBeInTheDocument();
  });

  test('사용자가 부서번호를 입력하고 조회 버튼을 클릭하면 검색이 실행된다', async () => {
    render(<DeptNumberSearchPopup />);

    const deptNoInput = screen.getByLabelText('부서번호');
    const searchButton = screen.getByRole('button', { name: '조회' });

    // 부서번호 입력
    await act(async () => {
      fireEvent.change(deptNoInput, { target: { value: 'D001' } });
    });

    // 조회 버튼 클릭
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ060P00/search'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sp: 'COM_02_0301_S',
            param: ['D001', '2025', '']
          })
        })
      );
    });
  });

  test('사용자가 엔터키를 누르면 검색이 실행된다', async () => {
    render(<DeptNumberSearchPopup />);

    const deptNoInput = screen.getByLabelText('부서번호');

    // 부서번호 입력 후 엔터키
    await act(async () => {
      fireEvent.change(deptNoInput, { target: { value: 'D001' } });
      fireEvent.keyDown(deptNoInput, { key: 'Enter', code: 'Enter' });
    });

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ060P00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            sp: 'COM_02_0301_S',
            param: ['D001', '2025', '']
          })
        })
      );
    });
  });

  test('사용자가 부서구분을 선택하고 검색하면 해당 조건으로 검색된다', async () => {
    render(<DeptNumberSearchPopup />);

    const deptDivSelect = screen.getByLabelText('부서구분');
    const searchButton = screen.getByRole('button', { name: '조회' });

    // 부서구분 선택
    await act(async () => {
      fireEvent.change(deptDivSelect, { target: { value: '001' } });
    });

    // 조회 버튼 클릭
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ060P00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            sp: 'COM_02_0301_S',
            param: ['', '2025', '001']
          })
        })
      );
    });
  });

  test('검색 결과가 있을 때 그리드에 데이터가 표시된다', async () => {
    render(<DeptNumberSearchPopup />);

    const searchButton = screen.getByRole('button', { name: '조회' });

    // 조회 실행
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 검색 완료 후 결과 확인 - AG-Grid의 셀 데이터를 확인
    await waitFor(() => {
      // 부서번호 컬럼의 데이터 확인
      const deptNoCells = screen.getAllByText('D001');
      expect(deptNoCells.length).toBeGreaterThan(0);
      
      // 부서명 컬럼의 데이터 확인 (AG-Grid 셀에서)
      const deptNmCells = screen.getAllByText('개발부서');
      expect(deptNmCells.length).toBeGreaterThan(1); // 콤보박스 옵션 + AG-Grid 셀
      
      // 두 번째 부서 데이터 확인
      const deptNo2Cells = screen.getAllByText('D002');
      expect(deptNo2Cells.length).toBeGreaterThan(0);
      
      const deptNm2Cells = screen.getAllByText('영업부서');
      expect(deptNm2Cells.length).toBeGreaterThan(0);
    });
  });

  test('검색 결과가 없을 때 적절한 메시지가 표시된다', async () => {
    // 검색 결과 없음 응답으로 mock 설정
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );

    render(<DeptNumberSearchPopup />);

    const deptNoInput = screen.getByLabelText('부서번호');
    const searchButton = screen.getByRole('button', { name: '조회' });

    // 검색 결과 없음 조건으로 검색
    await act(async () => {
      fireEvent.change(deptNoInput, { target: { value: '검색결과없음' } });
      fireEvent.click(searchButton);
    });

    // 검색 완료 후 결과 없음 메시지 확인
    await waitFor(() => {
      expect(screen.getByText('조회 결과가 없습니다')).toBeInTheDocument();
    });
  });

  test('API 오류 발생 시 에러 메시지가 표시된다', async () => {
    // API 오류 응답으로 mock 설정
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Network error' })
      })
    );

    render(<DeptNumberSearchPopup />);

    const deptNoInput = screen.getByLabelText('부서번호');
    const searchButton = screen.getByRole('button', { name: '조회' });

    // 오류 발생 조건으로 검색
    await act(async () => {
      fireEvent.change(deptNoInput, { target: { value: '에러발생' } });
      fireEvent.click(searchButton);
    });

    // 오류 메시지 확인
    await waitFor(() => {
      expect(screen.getByText('HTTP error! status: 500')).toBeInTheDocument();
      expect(mockShowToast).toHaveBeenCalledWith('HTTP error! status: 500', 'error');
    });
  });

  test('사용자가 종료 버튼을 클릭하면 팝업이 닫힌다', async () => {
    render(<DeptNumberSearchPopup />);

    const closeButton = screen.getByRole('button', { name: '종료' });

    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('쿼리 파라미터로 초기 부서번호가 전달되면 입력 필드에 표시된다', async () => {
    // 쿼리 파라미터 mock 설정
    const mockParams = new URLSearchParams('deptNo=D001');
    mockUseSearchParams.mockReturnValue(mockParams);

    render(<DeptNumberSearchPopup />);

    const deptNoInput = screen.getByLabelText('부서번호');
    expect(deptNoInput).toHaveValue('D001');
  });

  test('사용자가 년도를 변경하고 검색하면 해당 년도로 검색된다', async () => {
    render(<DeptNumberSearchPopup />);

    const yearInput = screen.getByLabelText('년도');
    const searchButton = screen.getByRole('button', { name: '조회' });

    // 년도 변경
    await act(async () => {
      fireEvent.change(yearInput, { target: { value: '2023' } });
    });

    // 조회 버튼 클릭
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ060P00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            sp: 'COM_02_0301_S',
            param: ['', '2023', '']
          })
        })
      );
    });
  });
}); 