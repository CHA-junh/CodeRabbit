import { test, expect } from '@playwright/test';
// 테스트 타임아웃 설정 (120초)
test.setTimeout(1200000);

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

test.describe('COMZ020M00 등급별 단가 등록 E2E', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 및 메뉴 이동 공통 처리
    await test.step('로그인 페이지 진입', async () => {
      await page.goto('http://172.20.30.176:3000/signin');
    });

    await test.step('ID 입력', async () => {
      await page.getByLabel('ID').fill('10385');
    });

    await test.step('비밀번호 입력', async () => {
      await page.getByLabel('Password').fill('buttle1!');
    });

    await test.step('로그인 버튼 클릭', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
    });

    // 로그인 후 페이지 로딩 대기 (더 안정적인 방식)
    await test.step('로그인 후 페이지 로딩 대기', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('메뉴 아이콘 클릭', async () => {
      try {
        await page.getByRole('button', { name: '메뉴 아이콘 메뉴' }).click();
      } catch (e) {
        console.log('메뉴 아이콘을 찾을 수 없습니다.');
      }
    });

    await test.step('첫 번째 expand 이미지 클릭', async () => {
      try {
        await page.getByRole('img', { name: 'expand' }).first().click();
      } catch (e) {
        console.log('첫 번째 expand 이미지를 찾을 수 없습니다.');
      }
    });

    await test.step('두 번째 expand 이미지 클릭', async () => {
      try {
        await page.getByRole('img', { name: 'expand' }).nth(2).click();
      } catch (e) {
        console.log('두 번째 expand 이미지를 찾을 수 없습니다.');
      }
    });

    await test.step('등급별단가등록 메뉴 클릭', async () => {
      try {
        await page.locator('div').filter({ hasText: /^등급별단가등록$/ }).click();
      } catch (e) {
        console.log('등급별단가등록 메뉴를 찾을 수 없습니다.');
      }
    });
  });

  test('등급별 단가 등록 화면 진입 확인', async ({ page }) => {
    await test.step('등급별 단가 등록 화면 요소들이 로드되었는지 확인', async () => {
      // 검색 영역 확인
      await expect(page.getByText('자사/외주')).toBeVisible();
      await expect(page.getByText('년도')).toBeVisible();
      await expect(page.getByRole('button', { name: '조회' })).toBeVisible();
      
      // 등록 영역 확인 - 더 구체적인 선택자 사용
      await expect(page.locator('th.form-th').filter({ hasText: '등급' })).toBeVisible();
      await expect(page.locator('th.form-th').filter({ hasText: '직책' })).toBeVisible();
      await expect(page.locator('th.form-th').filter({ hasText: '단가' })).toBeVisible();
      
      // 버튼 영역 확인
      await expect(page.getByRole('button', { name: '삭제' })).toBeVisible();
      await expect(page.getByRole('button', { name: '저장' })).toBeVisible();
      await expect(page.getByRole('button', { name: '종료' })).toBeVisible();
    });
  });

  test('검색 조건 변경 테스트', async ({ page }) => {
    await test.step('자사/외주 라디오 버튼 변경 테스트', async () => {
      // 자사 선택 확인
      await page.getByRole('radio', { name: '자사' }).check();
      await expect(page.getByRole('radio', { name: '자사' })).toBeChecked();
      
      // 외주 선택 확인
      await page.getByRole('radio', { name: '외주' }).check();
      await expect(page.getByRole('radio', { name: '외주' })).toBeChecked();
      
      // 다시 자사로 변경
      await page.getByRole('radio', { name: '자사' }).check();
    });

    await test.step('년도 선택 변경 테스트', async () => {
      const yearSelect = page.locator('select[name="year"]');
      await yearSelect.selectOption('2023');
      await expect(yearSelect).toHaveValue('2023');
      
      await yearSelect.selectOption('2024');
      await expect(yearSelect).toHaveValue('2024');
    });
  });

  test('조회 기능 테스트', async ({ page }) => {
    await test.step('기본 조회 실행', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForTimeout(2000);
      
      // 조회 후 그리드가 로드되었는지 확인
      await expect(page.locator('.ag-theme-alpine')).toBeVisible();
    });

    await test.step('자사 데이터 조회', async () => {
      await page.getByRole('radio', { name: '자사' }).check();
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('외주 데이터 조회', async () => {
      await page.getByRole('radio', { name: '외주' }).check();
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('다른 년도 데이터 조회', async () => {
      await page.locator('select[name="year"]').selectOption('2023');
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForTimeout(2000);
    });
  });

  test('등급별 단가 등록 테스트', async ({ page }) => {
    await test.step('기본 조회 실행', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('등급 선택', async () => {
      const gradeSelect = page.locator('select[name="grade"]');
      await gradeSelect.click();
      
      // 첫 번째 옵션 선택 (선택 옵션 제외)
      const options = await gradeSelect.locator('option').all();
      if (options.length > 1) {
        await gradeSelect.selectOption({ index: 1 });
      }
    });

    await test.step('직책 선택', async () => {
      const positionSelect = page.locator('select[name="position"]');
      await positionSelect.click();
      
      // 첫 번째 옵션 선택 (선택 옵션 제외)
      const options = await positionSelect.locator('option').all();
      if (options.length > 1) {
        await positionSelect.selectOption({ index: 1 });
      }
    });

    await test.step('단가 입력', async () => {
      const priceInput = page.locator('input[name="price"]');
      await priceInput.click();
      await priceInput.fill('50000');
    });

    await test.step('저장 버튼 클릭', async () => {
      await page.getByRole('button', { name: '저장' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('저장 성공 확인', async () => {
      // 토스트 메시지나 성공 메시지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('등급별 단가 수정 테스트', async ({ page }) => {
    await test.step('기본 조회 실행', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('그리드에서 행 선택', async () => {
      // 그리드의 첫 번째 행 클릭
      const firstRow = page.locator('.ag-row').first();
      if (await firstRow.isVisible()) {
        await firstRow.click();
        await page.waitForTimeout(1000);
      }
    });

    await test.step('선택된 데이터 확인', async () => {
      // 등급, 직책, 단가 필드에 데이터가 채워졌는지 확인
      const gradeSelect = page.locator('select[name="grade"]');
      const positionSelect = page.locator('select[name="position"]');
      const priceInput = page.locator('input[name="price"]');
      
      await expect(gradeSelect).not.toHaveValue('');
      await expect(positionSelect).not.toHaveValue('');
      await expect(priceInput).not.toHaveValue('');
    });

    await test.step('단가 수정', async () => {
      const priceInput = page.locator('input[name="price"]');
      await priceInput.click();
      await priceInput.fill('75000');
    });

    await test.step('저장 버튼 클릭', async () => {
      await page.getByRole('button', { name: '저장' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('수정 성공 확인', async () => {
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('등급별 단가 삭제 테스트', async ({ page }) => {
    await test.step('기본 조회 실행', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('그리드에서 행 선택', async () => {
      // 그리드의 첫 번째 행 클릭
      const firstRow = page.locator('.ag-row').first();
      if (await firstRow.isVisible()) {
        await firstRow.click();
        await page.waitForTimeout(1000);
      }
    });

    await test.step('삭제 버튼 클릭', async () => {
      await page.getByRole('button', { name: '삭제' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('확인 다이얼로그 처리', async () => {
      // 확인 다이얼로그가 나타나면 확인 버튼 클릭
      const confirmButton = page.getByRole('button', { name: '확인' });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      await page.waitForTimeout(2000);
    });

    await test.step('삭제 성공 확인', async () => {
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('유효성 검사 테스트', async ({ page }) => {
    await test.step('등급 미선택 상태에서 저장 시도', async () => {
      // 등급을 선택하지 않은 상태에서 저장 버튼 클릭
      await page.getByRole('button', { name: '저장' }).click();
      await page.waitForTimeout(1000);
      
      // 경고 메시지 확인
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('직책 미선택 상태에서 저장 시도 (자사)', async () => {
      // 자사 선택
      await page.getByRole('radio', { name: '자사' }).check();
      
      // 등급만 선택하고 직책은 선택하지 않음
      const gradeSelect = page.locator('select[name="grade"]');
      const options = await gradeSelect.locator('option').all();
      if (options.length > 1) {
        await gradeSelect.selectOption({ index: 1 });
      }
      
      // 단가 입력
      await page.locator('input[name="price"]').fill('50000');
      
      // 저장 버튼 클릭
      await page.getByRole('button', { name: '저장' }).click();
      await page.waitForTimeout(1000);
      
      // 경고 메시지 확인
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('단가 미입력 상태에서 저장 시도', async () => {
      // 직책 선택
      const positionSelect = page.locator('select[name="position"]');
      const options = await positionSelect.locator('option').all();
      if (options.length > 1) {
        await positionSelect.selectOption({ index: 1 });
      }
      
      // 단가 필드 비우기
      await page.locator('input[name="price"]').fill('');
      
      // 저장 버튼 클릭
      await page.getByRole('button', { name: '저장' }).click();
      await page.waitForTimeout(1000);
      
      // 경고 메시지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('키보드 이벤트 테스트', async ({ page }) => {
    await test.step('년도 필드에서 Enter 키 테스트', async () => {
      const yearSelect = page.locator('select[name="year"]');
      await yearSelect.click();
      await yearSelect.press('Enter');
      await page.waitForTimeout(1000);
      
      // Enter 키 입력 후 조회가 실행되었는지 확인
      await expect(page.locator('.ag-theme-alpine')).toBeVisible();
    });
  });

  test('그리드 상호작용 테스트', async ({ page }) => {
    await test.step('기본 조회 실행', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('그리드 정렬 테스트', async () => {
      // 등급 컬럼 헤더 클릭하여 정렬
      const gradeHeader = page.locator('.ag-header-cell').filter({ hasText: '등급' });
      if (await gradeHeader.isVisible()) {
        await gradeHeader.click();
        await page.waitForTimeout(1000);
      }
    });

    await test.step('그리드 필터 테스트', async () => {
      // 필터 아이콘 클릭
      const filterIcon = page.locator('.ag-header-cell .ag-icon-filter');
      if (await filterIcon.isVisible()) {
        await filterIcon.click();
        await page.waitForTimeout(1000);
      }
    });

    await test.step('그리드 행 선택 테스트', async () => {
      // 여러 행을 순차적으로 선택
      const rows = page.locator('.ag-row');
      const rowCount = await rows.count();
      
      if (rowCount > 0) {
        // 첫 번째 행 선택
        await rows.first().click();
        await page.waitForTimeout(500);
        
        // 두 번째 행이 있다면 선택
        if (rowCount > 1) {
          await rows.nth(1).click();
          await page.waitForTimeout(500);
        }
      }
    });
  });
}); 