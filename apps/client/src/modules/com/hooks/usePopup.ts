/**
 * 범용 팝업 관리 훅 (window.open 기반)
 * 
 * 이 모듈은 React 컴포넌트에서 팝업 창을 안전하고 효율적으로 관리할 수 있는
 * 완전한 팝업 관리 시스템을 제공합니다.
 * 
 * 주요 기능:
 * - 팝업 열기/닫기/포커스 관리
 * - 다양한 위치와 크기 옵션
 * - 자동 팝업 닫힘 감지
 * - postMessage 통신 지원
 * - 에러 처리 및 메모리 누수 방지
 * 
 * 사용 예시:
 * ```typescript
 * const { openPopup, closePopup, isOpen } = usePopup();
 * 
 * const handleOpenPopup = () => {
 *   openPopup({
 *     url: '/com/COMZ060P00',
 *     position: 'center',
 *     size: 'medium'
 *   });
 * };
 * ```
 */

import React from 'react';

/**
 * 팝업 창의 기본 옵션 설정
 * 
 * @property width - 팝업 창의 너비 (픽셀)
 * @property height - 팝업 창의 높이 (픽셀)
 * @property top - 팝업 창의 Y 좌표 (픽셀)
 * @property left - 팝업 창의 X 좌표 (픽셀)
 * @property features - window.open의 features 문자열 (직접 지정 시)
 * @property name - 팝업 창의 이름 (동일한 이름으로 열면 기존 창 재사용)
 * @property scrollbars - 스크롤바 표시 여부
 * @property resizable - 창 크기 조정 가능 여부
 * @property menubar - 메뉴바 표시 여부
 * @property toolbar - 툴바 표시 여부
 * @property location - 주소창 표시 여부
 * @property status - 상태바 표시 여부
 * @property directories - 디렉토리 버튼 표시 여부
 * @property copyhistory - 히스토리 버튼 표시 여부
 */
export type PopupOptions = {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  features?: string; // 추가 옵션 직접 지정 시
  name?: string; // 팝업 창 이름
  scrollbars?: boolean;
  resizable?: boolean;
  menubar?: boolean;
  toolbar?: boolean;
  location?: boolean;
  status?: boolean;
  directories?: boolean;
  copyhistory?: boolean;
};

/**
 * 팝업 창의 위치 옵션
 * 
 * - 'center': 화면 중앙에 위치
 * - 'top-left': 화면 좌상단에 위치
 * - 'top-right': 화면 우상단에 위치
 * - 'bottom-left': 화면 좌하단에 위치
 * - 'bottom-right': 화면 우하단에 위치
 * - 'custom': 사용자 정의 위치 (top, left 값 사용)
 */
export type PopupPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom';

/**
 * 팝업 창의 크기 옵션
 * 
 * - 'small': 400x300 픽셀
 * - 'medium': 800x600 픽셀 (기본값)
 * - 'large': 1200x800 픽셀
 * - 'fullscreen': 전체 화면 크기
 * - 'custom': 사용자 정의 크기 (width, height 값 사용)
 */
export type PopupSize = 'small' | 'medium' | 'large' | 'fullscreen' | 'custom';

/**
 * 팝업 창 설정을 위한 완전한 설정 객체
 * 
 * @property url - 팝업으로 열 URL 경로
 * @property options - 팝업 창의 기본 옵션
 * @property position - 팝업 창의 위치 (기본값: 'center')
 * @property size - 팝업 창의 크기 (기본값: 'medium')
 * @property onOpen - 팝업이 성공적으로 열렸을 때 호출되는 콜백
 * @property onClose - 팝업이 닫혔을 때 호출되는 콜백
 * @property onError - 팝업 열기 중 에러 발생 시 호출되는 콜백
 * @property onMessage - 팝업으로부터 postMessage 수신 시 호출되는 콜백
 * @property checkClosedInterval - 팝업 닫힘 체크 간격 (밀리초, 기본값: 500)
 */
export interface PopupConfig {
  url: string;
  options?: PopupOptions;
  position?: PopupPosition;
  size?: PopupSize;
  onOpen?: (popup: Window | null) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (event: MessageEvent) => void;
  checkClosedInterval?: number; // 팝업 닫힘 체크 간격 (ms)
}

/**
 * 팝업 창 인스턴스를 관리하는 객체
 * 
 * @property window - 실제 팝업 창의 Window 객체
 * @property isOpen - 팝업 창이 열려있는지 여부
 * @property close - 팝업 창을 닫는 함수
 * @property focus - 팝업 창에 포커스를 주는 함수
 * @property postMessage - 팝업 창으로 메시지를 전송하는 함수
 */
export interface PopupInstance {
  window: Window | null;
  isOpen: boolean;
  close: () => void;
  focus: () => void;
  postMessage: (message: any, targetOrigin?: string) => void;
}

/**
 * 팝업 크기 프리셋 정의
 * 
 * 각 크기 옵션에 대한 실제 픽셀 값을 정의합니다.
 * fullscreen의 경우 현재 화면 크기를 동적으로 가져옵니다.
 */
const POPUP_SIZES: Record<PopupSize, { width: number; height: number }> = {
  small: { width: 400, height: 300 },
  medium: { width: 800, height: 600 },
  large: { width: 1200, height: 800 },
  fullscreen: { width: window.screen.width, height: window.screen.height },
  custom: { width: 800, height: 600 }
};

/**
 * 팝업 창의 위치를 계산하는 함수
 * 
 * 주어진 위치 옵션과 크기에 따라 팝업 창의 정확한 좌표를 계산합니다.
 * 화면 경계를 벗어나지 않도록 조정됩니다.
 * 
 * @param position - 팝업 창의 위치 옵션
 * @param size - 팝업 창의 크기 옵션
 * @param customOptions - 사용자 정의 옵션 (top, left 값 포함)
 * @returns 계산된 좌표 객체 { left, top }
 */
function calculatePopupPosition(
  position: PopupPosition,
  size: PopupSize,
  customOptions?: PopupOptions
): { left: number; top: number } {
  // 선택된 크기에 따른 기본 크기 가져오기
  const { width, height } = POPUP_SIZES[size];
  const finalWidth = customOptions?.width || width;
  const finalHeight = customOptions?.height || height;
  
  // 현재 화면 및 창 정보 가져오기
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const windowLeft = window.screenX;
  const windowTop = window.screenY;
  const windowWidth = window.outerWidth;
  const windowHeight = window.outerHeight;

  // 위치 옵션에 따른 좌표 계산
  switch (position) {
    case 'center':
      // 화면 중앙에 위치
      return {
        left: windowLeft + (windowWidth - finalWidth) / 2,
        top: windowTop + (windowHeight - finalHeight) / 2
      };
    case 'top-left':
      // 화면 좌상단에 위치
      return {
        left: windowLeft,
        top: windowTop
      };
    case 'top-right':
      // 화면 우상단에 위치
      return {
        left: windowLeft + windowWidth - finalWidth,
        top: windowTop
      };
    case 'bottom-left':
      // 화면 좌하단에 위치
      return {
        left: windowLeft,
        top: windowTop + windowHeight - finalHeight
      };
    case 'bottom-right':
      // 화면 우하단에 위치
      return {
        left: windowLeft + windowWidth - finalWidth,
        top: windowTop + windowHeight - finalHeight
      };
    case 'custom':
      // 사용자 정의 위치 (기본값은 중앙)
      return {
        left: customOptions?.left ?? windowLeft + (windowWidth - finalWidth) / 2,
        top: customOptions?.top ?? windowTop + (windowHeight - finalHeight) / 2
      };
    default:
      // 기본값은 중앙
      return {
        left: windowLeft + (windowWidth - finalWidth) / 2,
        top: windowTop + (windowHeight - finalHeight) / 2
      };
  }
}

/**
 * window.open의 features 문자열을 생성하는 함수
 * 
 * 팝업 창의 모든 옵션을 window.open API가 이해할 수 있는
 * 문자열 형태로 변환합니다.
 * 
 * @param size - 팝업 창의 크기 옵션
 * @param position - 팝업 창의 위치 옵션
 * @param options - 추가 팝업 옵션
 * @returns window.open features 문자열
 */
function buildPopupFeatures(
  size: PopupSize,
  position: PopupPosition,
  options: PopupOptions = {}
): string {
  // 최종 크기 결정 (사용자 정의 값 우선)
  const { width, height } = POPUP_SIZES[size];
  const finalWidth = options.width || width;
  const finalHeight = options.height || height;
  
  // 위치 계산
  const { left, top } = calculatePopupPosition(position, size, options);

  // features 배열 구성
  const features = [
    `width=${finalWidth}`,
    `height=${finalHeight}`,
    `left=${Math.round(left)}`,
    `top=${Math.round(top)}`,
    `scrollbars=${options.scrollbars !== false ? 'yes' : 'no'}`,
    `resizable=${options.resizable !== false ? 'yes' : 'no'}`,
    `menubar=${options.menubar ? 'yes' : 'no'}`,
    `toolbar=${options.toolbar ? 'yes' : 'no'}`,
    `location=${options.location ? 'yes' : 'no'}`,
    `status=${options.status !== false ? 'yes' : 'no'}`,
    `directories=${options.directories ? 'yes' : 'no'}`,
    `copyhistory=${options.copyhistory ? 'yes' : 'no'}`
  ];

  // 쉼표로 구분된 문자열로 반환
  return features.join(',');
}

/**
 * 팝업 창을 관리하는 React 훅
 * 
 * 이 훅은 팝업 창의 전체 생명주기를 관리하며, 다음과 같은 기능을 제공합니다:
 * - 팝업 열기/닫기/포커스
 * - 팝업 상태 추적
 * - 자동 닫힘 감지
 * - postMessage 통신
 * - 메모리 누수 방지
 * 
 * @returns 팝업 관리 함수들과 상태 객체
 */
export function usePopup() {
  // 팝업 인스턴스 상태 관리
  const [popupInstance, setPopupInstance] = React.useState<PopupInstance | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  
  // 팝업 닫힘 체크를 위한 인터벌 참조
  const checkClosedIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // postMessage 이벤트 리스너 참조
  const messageListenerRef = React.useRef<((event: MessageEvent) => void) | null>(null);

  /**
   * 팝업 창이 닫혔는지 확인하는 함수
   * 
   * 팝업 창의 closed 속성을 확인하여 닫힘 상태를 감지합니다.
   * 팝업이 다른 도메인으로 이동한 경우도 처리합니다.
   * 
   * @param popup - 확인할 팝업 창 객체
   * @returns 팝업이 닫혔으면 true, 열려있으면 false
   */
  const checkPopupClosed = React.useCallback((popup: Window) => {
    try {
      // 팝업이 닫혔는지 확인
      if (popup.closed) {
        // 상태 업데이트
        setIsOpen(false);
        setPopupInstance(null);
        
        // 인터벌 정리
        if (checkClosedIntervalRef.current) {
          clearInterval(checkClosedIntervalRef.current);
          checkClosedIntervalRef.current = null;
        }
        return true;
      }
      return false;
    } catch (error) {
      // 팝업이 다른 도메인으로 이동했거나 접근할 수 없는 경우
      // (Same-Origin Policy 위반 등)
      setIsOpen(false);
      setPopupInstance(null);
      
      // 인터벌 정리
      if (checkClosedIntervalRef.current) {
        clearInterval(checkClosedIntervalRef.current);
        checkClosedIntervalRef.current = null;
      }
      return true;
    }
  }, []);

  /**
   * 팝업 창을 여는 함수
   * 
   * 주어진 설정에 따라 팝업 창을 열고, 필요한 이벤트 리스너와
   * 상태 관리를 설정합니다.
   * 
   * @param config - 팝업 창 설정 객체
   * @returns 팝업 인스턴스 객체 또는 null (실패 시)
   */
  const openPopup = React.useCallback((config: PopupConfig): PopupInstance | null => {
    try {
      // 설정에서 필요한 값들 추출
      const {
        url,
        options = {},
        position = 'center',
        size = 'medium',
        onOpen,
        onClose,
        onError,
        onMessage,
        checkClosedInterval = 500
      } = config;

      // 기존 팝업이 열려있으면 닫기 (중복 방지)
      if (popupInstance?.window && !popupInstance.window.closed) {
        popupInstance.close();
      }

      // 팝업 features 문자열 생성
      const features = options.features || buildPopupFeatures(size, position, options);
      
      // 고유한 팝업 이름 생성 (기본값: popup_타임스탬프)
      const popupName = options.name || `popup_${Date.now()}`;

      // 팝업 창 열기
      const popup = window.open(url, popupName, features);

      // 팝업 차단 확인
      if (!popup) {
        const error = new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        onError?.(error);
        return null;
      }

      // postMessage 이벤트 리스너 설정
      if (onMessage) {
        messageListenerRef.current = onMessage;
        window.addEventListener('message', onMessage);
      }

      // 팝업 닫힘 체크 인터벌 설정
      checkClosedIntervalRef.current = setInterval(() => {
        if (checkPopupClosed(popup)) {
          // 팝업이 닫혔을 때 콜백 호출
          onClose?.();
          
          // 메시지 리스너 정리
          if (messageListenerRef.current) {
            window.removeEventListener('message', messageListenerRef.current);
            messageListenerRef.current = null;
          }
        }
      }, checkClosedInterval);

      // 팝업 인스턴스 객체 생성
      const instance: PopupInstance = {
        window: popup,
        isOpen: true,
        close: () => {
          try {
            popup.close();
          } catch (error) {
            console.warn('팝업 닫기 실패:', error);
          }
        },
        focus: () => {
          try {
            popup.focus();
          } catch (error) {
            console.warn('팝업 포커스 실패:', error);
          }
        },
        postMessage: (message: any, targetOrigin: string = '*') => {
          try {
            popup.postMessage(message, targetOrigin);
          } catch (error) {
            console.warn('메시지 전송 실패:', error);
          }
        }
      };

      // 상태 업데이트
      setPopupInstance(instance);
      setIsOpen(true);
      
      // 성공 콜백 호출
      onOpen?.(popup);

      return instance;
    } catch (error) {
      // 에러 처리
      const errorObj = error instanceof Error ? error : new Error('팝업 열기 실패');
      config.onError?.(errorObj);
      return null;
    }
  }, [popupInstance, checkPopupClosed]);

  /**
   * 현재 열린 팝업 창을 닫는 함수
   */
  const closePopup = React.useCallback(() => {
    if (popupInstance?.window) {
      popupInstance.close();
    }
  }, [popupInstance]);

  /**
   * 현재 열린 팝업 창에 포커스를 주는 함수
   */
  const focusPopup = React.useCallback(() => {
    if (popupInstance?.window) {
      popupInstance.focus();
    }
  }, [popupInstance]);

  /**
   * 현재 열린 팝업 창으로 메시지를 전송하는 함수
   * 
   * @param message - 전송할 메시지
   * @param targetOrigin - 대상 오리진 (기본값: '*')
   */
  const postMessage = React.useCallback((message: any, targetOrigin: string = '*') => {
    if (popupInstance?.window) {
      popupInstance.postMessage(message, targetOrigin);
    }
  }, [popupInstance]);

  /**
   * 컴포넌트 언마운트 시 정리 작업
   * 
   * 메모리 누수를 방지하기 위해 모든 리소스를 정리합니다.
   */
  React.useEffect(() => {
    return () => {
      // 인터벌 정리
      if (checkClosedIntervalRef.current) {
        clearInterval(checkClosedIntervalRef.current);
      }
      
      // 메시지 리스너 정리
      if (messageListenerRef.current) {
        window.removeEventListener('message', messageListenerRef.current);
      }
      
      // 열린 팝업 닫기
      if (popupInstance?.window && !popupInstance.window.closed) {
        popupInstance.close();
      }
    };
  }, [popupInstance]);

  // 훅에서 제공하는 함수들과 상태 반환
  return {
    openPopup,
    closePopup,
    focusPopup,
    postMessage,
    isOpen,
    popupInstance
  };
}

/**
 * 간단한 팝업 열기 함수 (기존 호환성 유지)
 * 
 * 기존 코드와의 호환성을 위해 제공되는 간단한 함수입니다.
 * 복잡한 설정이 필요 없는 경우에 사용합니다.
 * 
 * @param url - 팝업으로 열 URL
 * @param options - 팝업 옵션
 * @returns 팝업 창 객체 또는 null
 */
export function openPopup(url: string, options: PopupOptions = {}): Window | null {
  const { openPopup: openPopupHook } = usePopup();
  
  return openPopupHook({
    url,
    options,
    position: 'center',
    size: 'medium'
  })?.window || null;
}

/**
 * 팝업 관련 유틸리티 함수들을 모아놓은 객체
 * 
 * 팝업 관리와 관련된 다양한 헬퍼 함수들을 제공합니다.
 */
export const popupUtils = {
  /**
   * 팝업이 브라우저에 의해 차단되었는지 확인하는 함수
   * 
   * 테스트 팝업을 열어서 차단 여부를 확인합니다.
   * 
   * @returns 팝업이 차단되었으면 true, 아니면 false
   */
  isPopupBlocked: (): boolean => {
    try {
      // 1x1 크기의 테스트 팝업 열기
      const testPopup = window.open('', '_blank', 'width=1,height=1');
      if (testPopup) {
        // 성공적으로 열렸으면 즉시 닫기
        testPopup.close();
        return false;
      }
      return true;
    } catch {
      // 에러 발생 시 차단된 것으로 간주
      return true;
    }
  },

  /**
   * 팝업 차단 안내 메시지를 표시하는 함수
   * 
   * 사용자에게 팝업 차단 해제 방법을 안내합니다.
   */
  showBlockedMessage: (): void => {
    alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업 차단을 해제해주세요.');
  },

  /**
   * 열린 팝업 창의 크기를 조정하는 함수
   * 
   * @param popup - 크기를 조정할 팝업 창
   * @param width - 새로운 너비
   * @param height - 새로운 높이
   */
  resizePopup: (popup: Window, width: number, height: number): void => {
    try {
      popup.resizeTo(width, height);
    } catch (error) {
      console.warn('팝업 크기 조정 실패:', error);
    }
  },

  /**
   * 열린 팝업 창의 위치를 이동하는 함수
   * 
   * @param popup - 위치를 이동할 팝업 창
   * @param left - 새로운 X 좌표
   * @param top - 새로운 Y 좌표
   */
  movePopup: (popup: Window, left: number, top: number): void => {
    try {
      popup.moveTo(left, top);
    } catch (error) {
      console.warn('팝업 위치 이동 실패:', error);
    }
  }
}; 