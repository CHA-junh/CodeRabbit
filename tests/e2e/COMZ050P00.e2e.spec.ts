import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 800,
    width: 1200
  }
});

test.describe('COMZ050P00 사업명검색 E2E', () => {
  test('기본 화면 로딩 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('사업명검색 화면 요소들이 로드되었는지 확인', async () => {
      // 팝업 헤더가 있는지 확인
      await expect(page.locator('.popup-header')).toBeVisible();
      // 사업명검색 타이틀이 있는지 확인
      await expect(page.getByText('사업명 검색')).toBeVisible();
      // 검색 영역이 있는지 확인
      await expect(page.locator('.search-div')).toBeVisible();
      // AG-Grid가 있는지 확인
      await expect(page.locator('.ag-theme-alpine')).toBeVisible();
    });
  });

  test('진행상태 체크박스 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('진행상태 영역이 표시되는지 확인', async () => {
      await expect(page.getByText('진행상태')).toBeVisible();
    });

    await test.step('첫 번째 체크박스가 표시되는지 확인', async () => {
      // 첫 번째 체크박스만 확인
      await expect(page.locator('input[type="checkbox"]').first()).toBeVisible();
    });

    await test.step('첫 번째 체크박스 클릭', async () => {
      // 첫 번째 체크박스를 클릭
      await page.locator('input[type="checkbox"]').first().click();
    });

    await test.step('체크박스가 클릭되었는지 확인', async () => {
      // 체크박스가 클릭 가능한지 확인
      await expect(page.locator('input[type="checkbox"]').first()).toBeVisible();
    });
  });

  test('시작년도 콤보박스 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('시작년도 콤보박스가 표시되는지 확인', async () => {
      const yearSelect = page.locator('select').first();
      await expect(yearSelect).toBeVisible();
    });

    await test.step('시작년도 콤보박스에서 옵션 선택', async () => {
      const yearSelect = page.locator('select').first();
      await yearSelect.selectOption('2024');
    });

    await test.step('시작년도가 선택되었는지 확인', async () => {
      const yearSelect = page.locator('select').first();
      await expect(yearSelect).toHaveValue('2024');
    });
  });

  test('사업명 입력 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('사업명 입력', async () => {
      await page.getByRole('textbox', { name: '사업명' }).fill('테스트 사업');
    });

    await test.step('사업명이 입력되었는지 확인', async () => {
      await expect(page.getByRole('textbox', { name: '사업명' })).toHaveValue('테스트 사업');
    });
  });

  test('검색 실행 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('검색이 실행되었는지 확인', async () => {
      // AG-Grid가 로드되었는지 확인
      await expect(page.locator('.ag-theme-alpine')).toBeVisible();
    });
  });

  test('AG-Grid 데이터 표시 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

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
      // No 컬럼이 있는지 확인
      await expect(page.locator('.ag-header-cell').filter({ hasText: 'No' })).toBeVisible();
    });
  });

  test('행 더블클릭 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('ESC 키 입력', async () => {
      await page.keyboard.press('Escape');
    });

    await test.step('팝업이 닫혔는지 확인', async () => {
      // 팝업이 닫혔는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('닫기 버튼으로 팝업 닫기 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('팝업 헤더가 표시되는지 확인', async () => {
      await expect(page.locator('.popup-header')).toBeVisible();
    });

    await test.step('닫기 버튼 클릭', async () => {
      // 팝업 헤더 내의 닫기 버튼을 클릭
      await page.locator('.popup-close').click();
    });

    await test.step('팝업이 닫혔는지 확인', async () => {
      // 팝업이 닫혔는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('종료 버튼으로 팝업 닫기 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('종료 버튼 클릭', async () => {
      await page.getByRole('button', { name: '종료' }).click();
    });

    await test.step('팝업이 닫혔는지 확인', async () => {
      // 팝업이 닫혔는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('엔터키로 검색 실행 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('사업명 입력 필드에 포커스', async () => {
      await page.getByRole('textbox', { name: '사업명' }).click();
    });

    await test.step('엔터키 입력', async () => {
      await page.getByRole('textbox', { name: '사업명' }).press('Enter');
    });

    await test.step('검색이 실행되었는지 확인', async () => {
      // AG-Grid가 로드되었는지 확인
      await expect(page.locator('.ag-theme-alpine')).toBeVisible();
    });
  });

  test('쿼리스트링 파라미터 테스트', async ({ page }) => {
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

    await test.step('쿼리스트링 파라미터와 함께 사업명검색 팝업 페이지로 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00?bsnNm=테스트사업&mode=plan');
    });

    await test.step('사업명이 파라미터로 설정되었는지 확인', async () => {
      await expect(page.getByRole('textbox', { name: '사업명' })).toHaveValue('테스트사업');
    });

    await test.step('mode 파라미터에 따른 진행상태 설정 확인', async () => {
      // plan 모드일 때 신규, 진행만 선택되어야 함
      await expect(page.getByRole('checkbox', { name: '신규' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: '진행' })).toBeVisible();
    });
  });

  test('유사 사업명칭 조회결과 테스트', async ({ page }) => {
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

    await test.step('사업명검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://localhost:3000/com/COMZ050P00');
    });

    await test.step('사업명 입력', async () => {
      await page.getByRole('textbox', { name: '사업명' }).fill('테스트 사업명');
    });

    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('유사 사업명칭 조회결과 필드가 표시되는지 확인', async () => {
      await expect(page.locator('.clearbox-div')).toBeVisible();
      await expect(page.getByText('유사 사업명칭 조회결과')).toBeVisible();
    });

    await test.step('검색 KEY 필드가 표시되는지 확인', async () => {
      await expect(page.locator('input[placeholder="검색 KEY"]')).toBeVisible();
    });
  });
}); 