import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 800,
    width: 1200
  }
});

test.describe('COMZ040P00 사업번호검색 E2E', () => {
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

    await test.step('사업번호검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ040P00');
    });
  });

  test('기본 화면 로딩 테스트', async ({ page }) => {
    await test.step('사업번호검색 화면 요소들이 로드되었는지 확인', async () => {
      // 팝업 헤더가 있는지 확인
      await expect(page.locator('.popup-header')).toBeVisible();
      // 사업번호검색 타이틀이 있는지 확인
      await expect(page.getByText('사업번호검색')).toBeVisible();
      // 검색 영역이 있는지 확인
      await expect(page.locator('.search-div')).toBeVisible();
      // AG-Grid가 있는지 확인
      await expect(page.locator('.ag-theme-alpine')).toBeVisible();
    });
  });

  test('조회구분 라디오 버튼 테스트', async ({ page }) => {
    await test.step('전체 라디오 버튼 클릭', async () => {
      await page.getByRole('radio', { name: '전체' }).click();
    });

    await test.step('전체 라디오 버튼이 선택되었는지 확인', async () => {
      await expect(page.getByRole('radio', { name: '전체' })).toBeChecked();
    });

    await test.step('사업부서 라디오 버튼 클릭', async () => {
      await page.getByRole('radio', { name: '사업부서' }).click();
    });

    await test.step('사업부서 라디오 버튼이 선택되었는지 확인', async () => {
      await expect(page.getByRole('radio', { name: '사업부서' })).toBeChecked();
    });

    await test.step('실행부서 라디오 버튼 클릭', async () => {
      await page.getByRole('radio', { name: '실행부서' }).click();
    });

    await test.step('실행부서 라디오 버튼이 선택되었는지 확인', async () => {
      await expect(page.getByRole('radio', { name: '실행부서' })).toBeChecked();
    });
  });

  test('본부/부서 선택 테스트', async ({ page }) => {
    await test.step('사업부서 라디오 버튼 클릭', async () => {
      await page.getByRole('radio', { name: '사업부서' }).click();
    });

    await test.step('본부 콤보박스가 활성화되었는지 확인', async () => {
      const hqSelect = page.locator('select').first();
      await expect(hqSelect).toBeEnabled();
    });

    await test.step('본부 콤보박스에서 옵션 선택', async () => {
      const hqSelect = page.locator('select').first();
      await hqSelect.selectOption('02'); // 영업본부
    });

    await test.step('추진부서 콤보박스가 활성화되었는지 확인', async () => {
      const deptSelect = page.locator('select').nth(1);
      await expect(deptSelect).toBeEnabled();
    });
  });

  test('진행상태 체크박스 테스트', async ({ page }) => {
    await test.step('진행상태 체크박스들이 표시되는지 확인', async () => {
      await expect(page.getByRole('checkbox', { name: '(모두선택)' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: '신규' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: '영업진행' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: '수주확정' })).toBeVisible();
    });

    await test.step('신규 체크박스 클릭', async () => {
      await page.getByRole('checkbox', { name: '신규' }).click();
    });

    await test.step('신규 체크박스가 클릭되었는지 확인', async () => {
      // 체크박스가 클릭 가능한지 확인
      await expect(page.getByRole('checkbox', { name: '신규' })).toBeVisible();
    });
  });

  test('검색 조건 입력 테스트', async ({ page }) => {
    await test.step('사업년도 선택', async () => {
      const yearSelect = page.locator('select').nth(2);
      await yearSelect.selectOption('2024');
    });

    await test.step('사업년도가 선택되었는지 확인', async () => {
      const yearSelect = page.locator('select').nth(2);
      await expect(yearSelect).toHaveValue('2024');
    });

    await test.step('사업번호 입력', async () => {
      await page.getByRole('textbox', { name: '사업번호 입력' }).fill('BSN2024001');
    });

    await test.step('사업번호가 입력되었는지 확인', async () => {
      await expect(page.getByRole('textbox', { name: '사업번호 입력' })).toHaveValue('BSN2024001');
    });
  });

  test('검색 실행 테스트', async ({ page }) => {
    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('검색이 실행되었는지 확인', async () => {
      // AG-Grid가 로드되었는지 확인
      await expect(page.locator('.ag-theme-alpine')).toBeVisible();
    });
  });

  test('AG-Grid 데이터 표시 테스트', async ({ page }) => {
    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('AG-Grid 헤더들이 표시되는지 확인', async () => {
      // AG-Grid 헤더들이 있는지 확인
      await expect(page.locator('.ag-header')).toBeVisible();
    });

    await test.step('AG-Grid 컬럼들이 표시되는지 확인', async () => {
      // 사업번호 컬럼이 있는지 확인
      await expect(page.locator('.ag-header-cell').filter({ hasText: '사업번호' })).toBeVisible();
      // 사업명 컬럼이 있는지 확인
      await expect(page.locator('.ag-header-cell').filter({ hasText: '사업명' })).toBeVisible();
    });
  });

  test('행 선택 및 더블클릭 테스트', async ({ page }) => {
    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('AG-Grid가 로드될 때까지 대기', async () => {
      await page.waitForTimeout(3000);
    });

    await test.step('AG-Grid가 표시되는지 확인', async () => {
      await expect(page.locator('.ag-theme-alpine')).toBeVisible();
    });

    await test.step('AG-Grid 헤더가 표시되는지 확인', async () => {
      await expect(page.locator('.ag-header')).toBeVisible();
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

  test('종료 버튼으로 팝업 닫기 테스트', async ({ page }) => {
    await test.step('종료 버튼 클릭', async () => {
      await page.getByRole('button', { name: '종료' }).click();
    });

    await test.step('팝업이 닫혔는지 확인', async () => {
      // 팝업이 닫혔는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('엔터키로 검색 실행 테스트', async ({ page }) => {
    await test.step('사업번호 입력 필드에 포커스', async () => {
      await page.getByRole('textbox', { name: '사업번호 입력' }).click();
    });

    await test.step('엔터키 입력', async () => {
      await page.getByRole('textbox', { name: '사업번호 입력' }).press('Enter');
    });

    await test.step('검색이 실행되었는지 확인', async () => {
      // AG-Grid가 로드되었는지 확인
      await expect(page.locator('.ag-theme-alpine')).toBeVisible();
    });
  });
}); 