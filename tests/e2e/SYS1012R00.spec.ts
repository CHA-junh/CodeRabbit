import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1440,
    width: 2560
  }
});

test.describe('SYS1012R00 메뉴 미리보기 E2E', () => {
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
        await page.waitForSelector('button.btn-search', { timeout: 5000 });
        await expect(page.locator('button.btn-search')).toBeVisible();
      });
  });

  test('메뉴 미리보기 기본 기능 테스트', async ({ page }) => {
    await test.step('메뉴 목록 조회', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('메뉴 선택', async () => {
      // 첫 번째 메뉴 선택
      await page.locator('[role="gridcell"]').first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('메뉴 미리보기 팝업 열기', async () => {
      const page18Promise = page.waitForEvent('popup');
      await page.getByRole('button', { name: '메뉴미리보기' }).click();
      const page18 = await page18Promise;
      
      // 팝업이 열렸는지 확인
      expect(page18).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page18.waitForLoadState('networkidle');
    });

    await test.step('미리보기에서 메뉴 탐색', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // 시스템관리 메뉴 클릭
      await page18.getByText('시스템관리').click();
      await page18.waitForTimeout(1000);
      
      // 인사관리 메뉴 클릭
      await page18.getByText('인사관리').click();
      await page18.waitForTimeout(1000);
      
      // 두 번째 시스템관리 메뉴 클릭
      await page18.getByText('시스템관리').nth(1).click();
      await page18.waitForTimeout(1000);
    });

    await test.step('메뉴명 입력 필드 테스트', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // 메뉴명 입력 필드 클릭
      await page18.locator('div').filter({ hasText: /^메뉴명을 입력 해 주세요$/ }).locator('div').click();
      await page18.waitForTimeout(500);
      
      await page18.locator('div').filter({ hasText: /^메뉴명을 입력 해 주세요$/ }).click();
      await page18.waitForTimeout(500);
      
      await page18.locator('div').filter({ hasText: /^메뉴명을 입력 해 주세요$/ }).locator('div').click();
      await page18.waitForTimeout(500);
      
      await page18.locator('div').filter({ hasText: /^메뉴명을 입력 해 주세요$/ }).click();
      await page18.waitForTimeout(500);
    });

    await test.step('expand all 버튼 테스트', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // expand all 버튼 클릭
      await page18.getByRole('button', { name: 'expand all' }).click();
      await page18.waitForTimeout(1000);
    });

    await test.step('collapse all 버튼 테스트', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // collapse all 버튼 클릭
      await page18.getByRole('button', { name: 'collapse all' }).click();
      await page18.waitForTimeout(1000);
    });

    await test.step('expand all 버튼 재클릭', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // expand all 버튼 다시 클릭
      await page18.getByRole('button', { name: 'expand all' }).click();
      await page18.waitForTimeout(1000);
    });

    await test.step('collapse all 버튼 재클릭', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // collapse all 버튼 다시 클릭
      await page18.getByRole('button', { name: 'collapse all' }).click();
      await page18.waitForTimeout(1000);
    });

    await test.step('팝업 닫기', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // 팝업 닫기 버튼 클릭
      await page18.getByRole('button', { name: '×' }).click();
    });
  });

  test('메뉴 미리보기 팝업 UI 요소 확인', async ({ page }) => {
    await test.step('메뉴 목록 조회', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('메뉴 선택', async () => {
      // 첫 번째 메뉴 선택
      await page.locator('[role="gridcell"]').first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('메뉴 미리보기 팝업 열기', async () => {
      const page18Promise = page.waitForEvent('popup');
      await page.getByRole('button', { name: '메뉴미리보기' }).click();
      const page18 = await page18Promise;
      
      // 팝업이 열렸는지 확인
      expect(page18).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page18.waitForLoadState('networkidle');
    });

    await test.step('팝업 UI 요소 확인', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // 메뉴 트리 영역 확인
      await expect(page18.locator('div').filter({ hasText: /^메뉴명을 입력 해 주세요$/ })).toBeVisible();
      
      // expand all 버튼 확인
      await expect(page18.getByRole('button', { name: 'expand all' })).toBeVisible();
      
      // collapse all 버튼 확인
      await expect(page18.getByRole('button', { name: 'collapse all' })).toBeVisible();
      
      // 닫기 버튼 확인
      await expect(page18.getByRole('button', { name: '×' })).toBeVisible();
    });

    await test.step('팝업 닫기', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      await page18.getByRole('button', { name: '×' }).click();
    });
  });

  test('메뉴 미리보기 메뉴 탐색 테스트', async ({ page }) => {
    await test.step('메뉴 목록 조회', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('메뉴 선택', async () => {
      // 첫 번째 메뉴 선택
      await page.locator('[role="gridcell"]').first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('메뉴 미리보기 팝업 열기', async () => {
      const page18Promise = page.waitForEvent('popup');
      await page.getByRole('button', { name: '메뉴미리보기' }).click();
      const page18 = await page18Promise;
      
      // 팝업이 열렸는지 확인
      expect(page18).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page18.waitForLoadState('networkidle');
    });

    await test.step('다양한 메뉴 탐색', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // 시스템관리 메뉴 클릭
      await page18.getByText('시스템관리').click();
      await page18.waitForTimeout(1000);
      
      // 인사관리 메뉴 클릭
      await page18.getByText('인사관리').click();
      await page18.waitForTimeout(1000);
      
      // 다른 메뉴들도 클릭해보기
      const menuItems = page18.locator('button, a, div').filter({ hasText: /^[가-힣]/ });
      if (await menuItems.count() > 0) {
        await menuItems.first().click();
        await page18.waitForTimeout(1000);
      }
    });

    await test.step('expand/collapse 기능 테스트', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // expand all 클릭
      await page18.getByRole('button', { name: 'expand all' }).click();
      await page18.waitForTimeout(1000);
      
      // collapse all 클릭
      await page18.getByRole('button', { name: 'collapse all' }).click();
      await page18.waitForTimeout(1000);
      
      // 다시 expand all 클릭
      await page18.getByRole('button', { name: 'expand all' }).click();
      await page18.waitForTimeout(1000);
    });

    await test.step('팝업 닫기', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      await page18.getByRole('button', { name: '×' }).click();
    });
  });

  test('메뉴 미리보기 팝업 닫기 테스트', async ({ page }) => {
    await test.step('메뉴 목록 조회', async () => {
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('메뉴 선택', async () => {
      // 첫 번째 메뉴 선택
      await page.locator('[role="gridcell"]').first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('메뉴 미리보기 팝업 열기', async () => {
      const page18Promise = page.waitForEvent('popup');
      await page.getByRole('button', { name: '메뉴미리보기' }).click();
      const page18 = await page18Promise;
      
      // 팝업이 열렸는지 확인
      expect(page18).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page18.waitForLoadState('networkidle');
    });

    await test.step('팝업 닫기 확인', async () => {
      const page18 = page.context().pages()[1]; // 팝업 페이지
      
      // 팝업 닫기 버튼 클릭
      await page18.getByRole('button', { name: '×' }).click();
      
      // 팝업이 닫혔는지 확인 (페이지 수가 줄어들었는지)
      const pageCount = page.context().pages().length;
      expect(pageCount).toBe(1); // 팝업이 닫혀서 메인 페이지만 남아있어야 함
    });
  });
}); 