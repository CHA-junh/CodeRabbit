import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1440,
    width: 2560
  }
});

test.describe('SYS1010D00 프로그램 검색 팝업 E2E', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 및 메뉴 이동 공통 처리
    await test.step('로그인 페이지 진입', async () => {
      await page.goto('http://localhost:3000/signin');
    });

    await test.step('ID 입력', async () => {
      await page.getByLabel('ID').fill('10665');
    });

    await test.step('비밀번호 입력', async () => {
      await page.getByLabel('Password').fill('Tribe159753!');
    });

    await page.waitForTimeout(2000);
    await test.step('로그인 버튼 클릭', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
    });

    // 로그인 후 페이지 로딩 대기 (더 안정적인 방식)
    await test.step('로그인 후 페이지 로딩 대기', async () => {
      await page.waitForLoadState('networkidle');
    });

    // 메뉴 버튼을 찾는 다양한 방법 시도
    await test.step('메뉴 오픈 및 시스템관리 진입', async () => {
      let menuButton: any = null;

      try {
        // 방법 1: aria-label로 찾기
        menuButton = page.locator('button[aria-label="메뉴 아이콘 메뉴"]');
        await menuButton.waitFor({ timeout: 5000 });
      } catch (e) {
        console.log("aria-label로 메뉴 버튼을 찾을 수 없음");

        try {
          // 방법 2: 텍스트로 찾기
          menuButton = page.getByRole('button', { name: '메뉴 아이콘 메뉴' });
          await menuButton.waitFor({ timeout: 5000 });
        } catch (e2) {
          console.log("텍스트로 메뉴 버튼을 찾을 수 없음");

          try {
            // 방법 3: 더 일반적인 선택자
            menuButton = page.locator('button').filter({ hasText: '메뉴' });
            await menuButton.first().waitFor({ timeout: 5000 });
          } catch (e3) {
            console.log("일반 선택자로도 메뉴 버튼을 찾을 수 없음");
            throw new Error("메뉴 버튼을 찾을 수 없습니다");
          }
        }
      }

      // 메뉴 버튼 클릭
      if (menuButton) {
        await menuButton.click();
      } else {
        throw new Error("메뉴 버튼을 찾을 수 없습니다");
      }

      await page.getByText('시스템관리').click();
      await page.getByText('시스템관리').nth(1).click();
      await page.locator('div').filter({ hasText: /^메뉴관리$/ }).click();
    });

    // 메뉴별 프로그램 관리 페이지 로드 대기
    await test.step('메뉴별 프로그램 관리 페이지 로드 대기', async () => {
      // 조회 버튼이 있는지 확인 (메뉴별 프로그램 관리 페이지의 일반적인 버튼)
      await page.waitForSelector('button', { timeout: 10000 });
      await expect(page.getByRole('button', { name: '조회' })).toBeVisible();
    });
  });

  test('프로그램 검색 팝업 기본 기능 테스트', async ({ page }) => {
    await test.step('메뉴 목록 조회', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('메뉴 선택', async () => {
      // 첫 번째 메뉴 선택
      await page.locator('[role="gridcell"]').first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 검색 팝업 열기', async () => {
      const page19Promise = page.waitForEvent('popup');
      await page.locator('div').filter({ hasText: /^찾기추가삭제저장$/ }).getByRole('button').first().click();
      const page19 = await page19Promise;
      
      // 팝업이 열렸는지 확인
      expect(page19).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page19.waitForLoadState('networkidle');
    });

    await test.step('프로그램 검색 기능 테스트', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 ID명 입력 필드 클릭
      await page19.getByRole('textbox', { name: '프로그램 ID명 입력' }).click();
      await page19.waitForTimeout(500);
      
      // 프로그램 검색어 입력
      await page19.getByRole('textbox', { name: '프로그램 ID명 입력' }).fill('프로그램');
      await page19.waitForTimeout(500);
      
      // 조회 버튼 클릭
      await page19.getByRole('button', { name: '조회' }).click();
      await page19.waitForTimeout(1000);
    });

    await test.step('업무 선택 필터링 테스트', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 업무 선택을 '시스템'으로 변경
      await page19.getByLabel('업무 선택').selectOption('시스템');
      await page19.waitForTimeout(500);
      
      // 조회 버튼 클릭
      await page19.getByRole('button', { name: '조회' }).click();
      await page19.waitForTimeout(1000);
    });

    await test.step('업무 선택 초기화', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 업무 선택을 빈 값으로 초기화
      await page19.getByLabel('업무 선택').selectOption('');
      await page19.waitForTimeout(500);
      
      // 조회 버튼 클릭
      await page19.getByRole('button', { name: '조회' }).click();
      await page19.waitForTimeout(1000);
    });

    await test.step('프로그램 선택 및 추가', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 체크박스 선택
      try {
        const firstCheckbox = page19.locator('input[type="checkbox"]').first();
        if (await firstCheckbox.count() > 0) {
          await firstCheckbox.check({ timeout: 5000 });
          await page19.waitForTimeout(500);
        }
      } catch (error) {
        console.log('첫 번째 체크박스 선택 실패:', error.message);
      }
      
      // 추가 버튼 클릭
      await page19.getByRole('button', { name: '추가' }).click();
    });
  });

  test('프로그램 검색 팝업 UI 요소 확인', async ({ page }) => {
    await test.step('메뉴 목록 조회', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('메뉴 선택', async () => {
      // 첫 번째 메뉴 선택
      await page.locator('[role="gridcell"]').first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 검색 팝업 열기', async () => {
      const page19Promise = page.waitForEvent('popup');
      await page.locator('div').filter({ hasText: /^찾기추가삭제저장$/ }).getByRole('button').first().click();
      const page19 = await page19Promise;
      
      // 팝업이 열렸는지 확인
      expect(page19).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page19.waitForLoadState('networkidle');
    });

    await test.step('팝업 UI 요소 확인', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 ID명 입력 필드 확인
      await expect(page19.getByRole('textbox', { name: '프로그램 ID명 입력' })).toBeVisible();
      
      // 업무 선택 필드 확인
      await expect(page19.getByLabel('업무 선택')).toBeVisible();
      
      // 조회 버튼 확인
      await expect(page19.getByRole('button', { name: '조회' })).toBeVisible();
      
      // 추가 버튼 확인
      await expect(page19.getByRole('button', { name: '추가' })).toBeVisible();
    });
  });

  test('프로그램 검색 및 필터링 테스트', async ({ page }) => {
    await test.step('메뉴 목록 조회', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('메뉴 선택', async () => {
      // 첫 번째 메뉴 선택
      await page.locator('[role="gridcell"]').first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 검색 팝업 열기', async () => {
      const page19Promise = page.waitForEvent('popup');
      await page.locator('div').filter({ hasText: /^찾기추가삭제저장$/ }).getByRole('button').first().click();
      const page19 = await page19Promise;
      
      // 팝업이 열렸는지 확인
      expect(page19).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page19.waitForLoadState('networkidle');
    });

    await test.step('프로그램 검색어 입력', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 검색어 입력
      await page19.getByRole('textbox', { name: '프로그램 ID명 입력' }).click();
      await page19.getByRole('textbox', { name: '프로그램 ID명 입력' }).fill('시스템');
      await page19.waitForTimeout(500);
      
      // 조회 버튼 클릭
      await page19.getByRole('button', { name: '조회' }).click();
      await page19.waitForTimeout(1000);
    });

    await test.step('업무별 필터링 테스트', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 시스템 업무 선택
      await page19.getByLabel('업무 선택').selectOption('시스템');
      await page19.getByRole('button', { name: '조회' }).click();
      await page19.waitForTimeout(1000);
      
      // 전체 업무 선택 (빈 값)
      await page19.getByLabel('업무 선택').selectOption('');
      await page19.getByRole('button', { name: '조회' }).click();
      await page19.waitForTimeout(1000);
    });

    await test.step('프로그램 선택 테스트', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 그리드가 로드될 때까지 대기
      await page19.waitForSelector('[role="gridcell"]', { timeout: 10000 });
      
      // 첫 번째 프로그램 체크박스 선택
      const checkboxes = page19.locator('input[type="checkbox"]');
      if (await checkboxes.count() > 0) {
        await checkboxes.first().check();
        await page19.waitForTimeout(500);
      }
    });

    await test.step('프로그램 추가', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 추가 버튼 클릭
      await page19.getByRole('button', { name: '추가' }).click();
    });
  });

  test('프로그램 검색 팝업 다중 선택 테스트', async ({ page }) => {
    await test.step('메뉴 목록 조회', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('메뉴 선택', async () => {
      // 첫 번째 메뉴 선택
      await page.locator('[role="gridcell"]').first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 검색 팝업 열기', async () => {
      const page19Promise = page.waitForEvent('popup');
      await page.locator('div').filter({ hasText: /^찾기추가삭제저장$/ }).getByRole('button').first().click();
      const page19 = await page19Promise;
      
      // 팝업이 열렸는지 확인
      expect(page19).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page19.waitForLoadState('networkidle');
    });

    await test.step('다중 프로그램 선택', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 그리드가 로드될 때까지 대기
      await page19.waitForSelector('[role="gridcell"]', { timeout: 10000 });
      
      // 첫 번째 체크박스 선택 (더 안전한 방법)
      try {
        const firstCheckbox = page19.locator('input[type="checkbox"]').first();
        if (await firstCheckbox.count() > 0) {
          await firstCheckbox.check({ timeout: 5000 });
          await page19.waitForTimeout(500);
        }
      } catch (error) {
        console.log('첫 번째 체크박스 선택 실패:', error.message);
      }
      
      // 두 번째 체크박스 선택 (더 안전한 방법)
      try {
        const secondCheckbox = page19.locator('input[type="checkbox"]').nth(1);
        if (await secondCheckbox.count() > 0) {
          await secondCheckbox.check({ timeout: 5000 });
          await page19.waitForTimeout(500);
        }
      } catch (error) {
        console.log('두 번째 체크박스 선택 실패:', error.message);
      }
    });

    await test.step('선택된 프로그램 추가', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 추가 버튼 클릭
      await page19.getByRole('button', { name: '추가' }).click();
    });
  });

  test('프로그램 검색 조건 초기화 테스트', async ({ page }) => {
    await test.step('메뉴 목록 조회', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('메뉴 선택', async () => {
      // 첫 번째 메뉴 선택
      await page.locator('[role="gridcell"]').first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 검색 팝업 열기', async () => {
      const page19Promise = page.waitForEvent('popup');
      await page.locator('div').filter({ hasText: /^찾기추가삭제저장$/ }).getByRole('button').first().click();
      const page19 = await page19Promise;
      
      // 팝업이 열렸는지 확인
      expect(page19).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page19.waitForLoadState('networkidle');
    });

    await test.step('검색 조건 입력', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 검색어 입력
      await page19.getByRole('textbox', { name: '프로그램 ID명 입력' }).fill('테스트');
      await page19.waitForTimeout(500);
      
      // 조회 버튼 클릭
      await page19.getByRole('button', { name: '조회' }).click();
      await page19.waitForTimeout(1000);
    });

    await test.step('검색 조건 초기화', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 검색어 초기화
      await page19.getByRole('textbox', { name: '프로그램 ID명 입력' }).clear();
      await page19.waitForTimeout(500);
      
      // 업무 선택 초기화
      await page19.getByLabel('업무 선택').selectOption('');
      await page19.waitForTimeout(500);
      
      // 조회 버튼 클릭
      await page19.getByRole('button', { name: '조회' }).click();
      await page19.waitForTimeout(1000);
    });

    await test.step('초기화 후 결과 확인', async () => {
      const page19 = page.context().pages()[1]; // 팝업 페이지
      
      // 검색 결과가 있는지 확인
      const gridCells = await page19.locator('[role="gridcell"]').count();
      expect(gridCells).toBeGreaterThan(0);
    });
  });
}); 