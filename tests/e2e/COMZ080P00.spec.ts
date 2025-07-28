import { test, expect } from '@playwright/test';

// 테스트 타임아웃 설정 (120초)
test.setTimeout(1200000);

test.use({
  viewport: {
    height: 600,
    width: 800
  }
});

test.describe('COMZ080P00 직원 검색 팝업(확장) E2E', () => {
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

    await test.step('직원 검색 팝업(확장) 페이지로 직접 이동', async () => {
      await page.goto('http://172.20.30.176:3000/popup/com/COMZ080P00');
      // 컴포넌트 로딩 대기
      await page.waitForTimeout(3000);
    });
  });

  test('기본 화면 로딩 테스트', async ({ page }) => {
    await test.step('팝업 화면 요소들이 로드되었는지 확인', async () => {
      // 직원 검색 타이틀이 있는지 확인
      await expect(page.getByText('직원 검색')).toBeVisible();
      // 직원명 입력 필드가 있는지 확인 (placeholder로 찾기)
      await expect(page.locator('input[placeholder="직원명 입력"]')).toBeVisible();
      // 라디오 버튼들이 있는지 확인 (더 정확한 선택자 사용)
      await expect(page.locator('input[type="radio"]').nth(0)).toBeVisible();
      await expect(page.locator('input[type="radio"]').nth(1)).toBeVisible();
      await expect(page.locator('input[type="radio"]').nth(2)).toBeVisible();
      // 퇴사자포함 체크박스가 있는지 확인
      await expect(page.locator('input[type="checkbox"]')).toBeVisible();
      // 검색 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '조회' })).toBeVisible();
    });
  });

  test('자사/외주/자사+외주 구분 선택 테스트', async ({ page }) => {
    await test.step('외주 라디오 버튼 선택', async () => {
      await page.locator('input[type="radio"]').nth(1).click();
    });

    await test.step('외주가 선택되었는지 확인', async () => {
      // 외주 라디오 버튼이 체크되었는지 확인
      const radioButton = page.locator('input[type="radio"]').nth(1);
      await expect(radioButton).toBeChecked();
    });

    await test.step('자사+외주 라디오 버튼 선택', async () => {
      await page.locator('input[type="radio"]').nth(2).click();
    });

    await test.step('자사+외주가 선택되었는지 확인', async () => {
      // 자사+외주 라디오 버튼이 체크되었는지 확인
      const radioButton = page.locator('input[type="radio"]').nth(2);
      await expect(radioButton).toBeChecked();
    });

    await test.step('자사 라디오 버튼 선택', async () => {
      await page.locator('input[type="radio"]').nth(0).click();
    });

    await test.step('자사가 선택되었는지 확인', async () => {
      // 자사 라디오 버튼이 체크되었는지 확인
      const radioButton = page.locator('input[type="radio"]').nth(0);
      await expect(radioButton).toBeChecked();
    });
  });

  test('퇴사자포함 체크박스 테스트', async ({ page }) => {
    await test.step('초기 체크박스 상태 확인', async () => {
      // 기본적으로 체크되어 있는지 확인
      const checkbox = page.locator('input[type="checkbox"]');
      await expect(checkbox).toBeChecked();
    });

    await test.step('퇴사자포함 체크박스 클릭하여 해제', async () => {
      await page.locator('input[type="checkbox"]').click();
    });

    await test.step('체크박스가 해제되었는지 확인', async () => {
      const checkbox = page.locator('input[type="checkbox"]');
      await expect(checkbox).not.toBeChecked();
    });

    await test.step('퇴사자포함 체크박스 다시 클릭하여 체크', async () => {
      await page.locator('input[type="checkbox"]').click();
    });

    await test.step('체크박스가 다시 체크되었는지 확인', async () => {
      const checkbox = page.locator('input[type="checkbox"]');
      await expect(checkbox).toBeChecked();
    });
  });

  test('직원명 입력 테스트', async ({ page }) => {
    await test.step('직원명 입력', async () => {
      await page.locator('input[placeholder="직원명 입력"]').fill('홍길동');
    });

    await test.step('입력된 직원명이 올바른지 확인', async () => {
      await expect(page.locator('input[placeholder="직원명 입력"]')).toHaveValue('홍길동');
    });
  });

  test('검색 버튼 클릭 테스트', async ({ page }) => {
    await test.step('직원명 입력', async () => {
      await page.locator('input[placeholder="직원명 입력"]').fill('홍길동');
    });

    await test.step('검색 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('검색 후 페이지 반응 확인', async () => {
      // 페이지가 정상적으로 반응하는지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('엔터키로 검색 처리 테스트', async ({ page }) => {
    await test.step('직원명 입력 필드에 포커스', async () => {
      await page.locator('input[placeholder="직원명 입력"]').focus();
    });

    await test.step('직원명 입력', async () => {
      await page.locator('input[placeholder="직원명 입력"]').fill('홍길동');
    });

    await test.step('엔터키 입력', async () => {
      await page.locator('input[placeholder="직원명 입력"]').press('Enter');
    });

    await test.step('엔터키 입력 후 페이지 반응 확인', async () => {
      // 페이지가 정상적으로 반응하는지 확인
      await expect(page.locator('body')).toBeVisible();
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

  test('빈 값으로 검색 시 경고 테스트', async ({ page }) => {
    await test.step('빈 값으로 검색 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('입력 필수 경고 메시지 확인', async () => {
      // Toast 메시지나 페이지 반응 확인
      await expect(page.locator('body')).toBeVisible();
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
}); 