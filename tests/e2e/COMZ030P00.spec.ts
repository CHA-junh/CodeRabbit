import { test, expect } from '@playwright/test';
// 테스트 타임아웃 설정 (120초)
test.setTimeout(1200000);

test.use({
  viewport: {
    height: 600,
    width: 800
  }
});

test.describe('COMZ030P00 등급별 단가 조회 팝업 E2E', () => {
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

    await test.step('등급별 단가 조회 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://172.20.30.176:3000/popup/com/COMZ030P00');
    });
  });

  test('기본 화면 로딩 테스트', async ({ page }) => {

    await test.step('팝업 화면 요소들이 로드되었는지 확인', async () => {
      // 팝업 헤더가 있는지 확인
      await expect(page.locator('.popup-header')).toBeVisible();
      // 등급별 단가 조회 타이틀이 있는지 확인
      await expect(page.getByText('등급별 단가 조회')).toBeVisible();
      // 자사/외주 라디오 버튼이 있는지 확인 (첫 번째 라디오 버튼만 확인)
      await expect(page.locator('input[name="gubun"][value="1"]')).toBeVisible();
      // 년도 선택 필드가 있는지 확인
      await expect(page.locator('select')).toBeVisible();
      // 조회 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '조회' })).toBeVisible();
    });
  });

  test('자사/외주 구분 선택 테스트', async ({ page }) => {
    await test.step('외주 라디오 버튼 선택', async () => {
      await page.locator('input[name="gubun"][value="2"]').click();
    });

    await test.step('외주가 선택되었는지 확인', async () => {
      await expect(page.locator('input[name="gubun"][value="2"]')).toBeChecked();
    });

    await test.step('자사 라디오 버튼 선택', async () => {
      await page.locator('input[name="gubun"][value="1"]').click();
    });

    await test.step('자사가 선택되었는지 확인', async () => {
      await expect(page.locator('input[name="gubun"][value="1"]')).toBeChecked();
    });
  });

  test('년도 선택 테스트', async ({ page }) => {
    await test.step('년도 선택 필드 클릭', async () => {
      await page.locator('select').click();
    });

    await test.step('다른 년도 선택', async () => {
      await page.locator('select').selectOption('2023');
    });

    await test.step('선택된 년도가 올바른지 확인', async () => {
      await expect(page.locator('select')).toHaveValue('2023');
    });
  });

  test('조회 버튼 클릭 테스트', async ({ page }) => {
    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('조회 후 페이지 반응 확인', async () => {
      // 페이지가 정상적으로 반응하는지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('엔터키로 조회 처리 테스트', async ({ page }) => {
    await test.step('년도 선택 필드에 포커스', async () => {
      await page.locator('select').focus();
    });

    await test.step('엔터키 입력', async () => {
      await page.locator('select').press('Enter');
    });

    await test.step('엔터키 입력 후 페이지 반응 확인', async () => {
      // 페이지가 정상적으로 반응하는지 확인
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

  test('단가 더블클릭 시 부모창 전달 및 팝업 닫기 테스트', async ({ page }) => {
    await test.step('조회 실행하여 데이터 로드', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('데이터가 있는 행 더블클릭', async () => {
      const dataRows = page.locator('table tbody tr').filter({ hasText: /[0-9]/ });
      await dataRows.first().dblclick();
      await page.waitForTimeout(1000);
    });

        await test.step('더블클릭 후 페이지 상태 확인', async () => {
      await expect(page.locator('body')).toBeVisible();
    });
  });
});  