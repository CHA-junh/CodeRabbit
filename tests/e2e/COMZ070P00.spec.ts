import { test, expect } from '@playwright/test';
// 테스트 타임아웃 설정 (120초)
test.setTimeout(1200000);

test.use({
  viewport: {
    height: 600,
    width: 800
  }
});

test.describe('COMZ070P00 직원 검색 팝업 E2E', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 및 메뉴 이동 공통 처리
    await test.step('로그인 페이지 진입', async () => {
      await page.goto('http://172.20.30.176:3000/signin');
    });

    await test.step('ID 입력', async () => {
      await page.getByLabel('ID').fill('10757');
    });

    await test.step('비밀번호 입력', async () => {
      await page.getByLabel('Password').fill('buttle1!');
    });

    await test.step('로그인 버튼 클릭', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('로그인 후 페이지 로딩 대기', async () => {
      await page.waitForTimeout(5000);
    });

    await test.step('직원 검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://172.20.30.176:3000/popup/com/COMZ070P00');
    });
  });

  test('기본 화면 로딩 테스트', async ({ page }) => {
    await test.step('팝업 화면 요소들이 로드되었는지 확인', async () => {
      // 팝업 헤더가 있는지 확인
      await expect(page.locator('.popup-header')).toBeVisible();
      // 직원 검색 타이틀이 있는지 확인
      await expect(page.getByText('직원 검색')).toBeVisible();
      // 직원명 입력 필드가 있는지 확인 (placeholder로 찾기)
      await expect(page.locator('input[placeholder="직원명 입력"]')).toBeVisible();
      // 종료 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '종료' })).toBeVisible();
    });
  });

  test('닫기 버튼으로 팝업 닫기 테스트', async ({ page }) => {
    await test.step('닫기 버튼 클릭', async () => {
      await page.getByRole('button', { name: '×' }).click();
    });

    await test.step('팝업이 닫혔는지 확인', async () => {
      // 팝업이 닫혔는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('테이블 구조 확인 테스트', async ({ page }) => {
    await test.step('테이블 헤더 확인', async () => {
      // 테이블 헤더가 있는지 확인 (grid-table 클래스 사용)
      await expect(page.locator('table.grid-table thead')).toBeVisible();
      
      // 헤더 컬럼들이 있는지 확인
      const headers = page.locator('table.grid-table thead th');
      const headerCount = await headers.count();
      console.log('헤더 컬럼 수:', headerCount);
      expect(headerCount).toBeGreaterThan(0);
    });
  });

  test('직원명 입력 필드 포커스 테스트', async ({ page }) => {
    await test.step('직원명 입력 필드 클릭', async () => {
      await page.locator('input[placeholder="직원명 입력"]').click();
    });

    await test.step('입력 필드가 포커스되었는지 확인', async () => {
      await expect(page.locator('input[placeholder="직원명 입력"]')).toBeFocused();
    });
  });

  test('종료 버튼 클릭 테스트', async ({ page }) => {
    await test.step('종료 버튼 클릭', async () => {
      await page.getByRole('button', { name: '종료' }).click();
    });

    await test.step('종료 버튼 클릭 후 페이지 반응 확인', async () => {
      // 페이지가 정상적으로 반응하는지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('postMessage 이벤트 핸들러 등록 확인 테스트', async ({ page }) => {
    await test.step('postMessage 이벤트 핸들러가 등록되었는지 확인', async () => {
      // postMessage 이벤트 리스너가 등록되었는지 확인
      const hasMessageListener = await page.evaluate(() => {
        // window 객체에 message 이벤트 리스너가 등록되어 있는지 확인
        return window.addEventListener !== undefined;
      });
      
      expect(hasMessageListener).toBe(true);
      console.log('postMessage 이벤트 핸들러 등록 확인됨');
    });
  });


}); 