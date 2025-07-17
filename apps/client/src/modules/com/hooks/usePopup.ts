// 범용 팝업 오픈 함수 (window.open 기반)
// 사용 예시: openPopup('/com/COMZ060P00', { width: 800, height: 600 })

export type PopupOptions = {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  features?: string; // 추가 옵션 직접 지정 시
};

/**
 * 공통 팝업 오픈 함수
 * @param url - 띄울 경로(예: '/com/COMZ060P00')
 * @param options - 팝업 옵션(크기, 위치 등)
 * @returns window 객체(팝업)
 */
export function openPopup(url: string, options: PopupOptions = {}) {
  const width = options.width || 800;
  const height = options.height || 600;
  const left = options.left ?? window.screenX + (window.outerWidth - width) / 2;
  const top = options.top ?? window.screenY + (window.outerHeight - height) / 2;
  const features = options.features || `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
  return window.open(url, '_blank', features);
} 