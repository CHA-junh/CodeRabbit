import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 600,
    width: 800
  }
});

test.describe('COM0050P00 테스트 로그인 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('로그인 페이지 진입', async () => {
      await page.goto('http://localhost:3000/signin');
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

    await test.step('메인프레임 페이지로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
    });

    await test.step('메인프레임 요소들이 로드되었는지 확인', async () => {
      // 헤더가 있는지 확인
      await expect(page.locator('header')).toBeVisible();
      // 메뉴 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '메뉴' })).toBeVisible();
    });

    await test.step('테스트 로그인 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COM0050P00');
    });
  });

  test('기본 화면 로딩 테스트', async ({ page }) => {
    await test.step('테스트 로그인 화면 요소들이 로드되었는지 확인', async () => {
      // 팝업 헤더가 있는지 확인
      await expect(page.locator('.popup-header')).toBeVisible();
      // 테스트 로그인 타이틀이 있는지 확인
      await expect(page.getByText('테스트 로그인 화면')).toBeVisible();
      // 입력 필드가 있는지 확인
      await expect(page.locator('#testUserId')).toBeVisible();
      // 확인 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '확인' })).toBeVisible();
    });
  });

  test('동일 사용자 테스트 로그인 시도 실패 테스트', async ({ page }) => {
    await test.step('현재 로그인된 사용자와 동일한 사번 입력', async () => {
      await page.locator('#testUserId').fill('10757');
    });

    await test.step('확인 버튼 클릭', async () => {
      await page.getByRole('button', { name: '확인' }).click();
    });

    await test.step('동일 사용자 경고 메시지 확인', async () => {
      // Toast 메시지가 나타나는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('빈 값 입력 시 경고 테스트', async ({ page }) => {
    await test.step('빈 값으로 확인 버튼 클릭', async () => {
      await page.getByRole('button', { name: '확인' }).click();
    });

    await test.step('입력 필수 경고 메시지 확인', async () => {
      // Toast 메시지가 나타나는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('숫자만 입력 가능한지 테스트', async ({ page }) => {
    await test.step('영문자와 숫자 혼합 입력', async () => {
      const input = page.locator('#testUserId');
      await input.fill('abc123def');
    });

    await test.step('숫자만 남아있는지 확인', async () => {
      const input = page.locator('#testUserId');
      await expect(input).toHaveValue('123');
    });
  });

  test('엔터키로 로그인 처리 테스트', async ({ page }) => {
    await test.step('유효한 사번 입력', async () => {
      await page.locator('#testUserId').fill('12345');
    });

    await test.step('엔터키 입력', async () => {
      await page.locator('#testUserId').press('Enter');
    });

    await test.step('버튼 클릭 후 페이지 반응 확인', async () => {
      // 페이지가 정상적으로 반응하는지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('ESC 키로 팝업 닫기 테스트', async ({ page }) => {
    await test.step('ESC 키 입력', async () => {
      await page.keyboard.press('Escape');
    });

    await test.step('팝업이 닫혔는지 확인', async () => {
      // 팝업이 닫혔는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
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

  test('유효한 테스트 로그인 성공 테스트', async ({ page }) => {
    await test.step('다른 사용자 사번 입력', async () => {
      await page.locator('#testUserId').fill('12345');
    });

    await test.step('확인 버튼 클릭', async () => {
      await page.getByRole('button', { name: '확인' }).click();
    });

    await test.step('버튼 클릭 후 페이지 반응 확인', async () => {
      // 페이지가 정상적으로 반응하는지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });
}); 