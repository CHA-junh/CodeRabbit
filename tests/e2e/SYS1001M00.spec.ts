import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1440,
    width: 2560
  }
});

test.describe('SYS1001M00 프로그램 그룹 관리 E2E', () => {
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
      await page.locator('div').filter({ hasText: /^프로그램 그룹관리$/ }).click();
    });

    // 프로그램 그룹 관리 페이지 로드 대기
    await test.step('프로그램 그룹 관리 페이지 로드 대기', async () => {
      await page.waitForSelector('button.btn-search', { timeout: 5000 });
      await expect(page.locator('button.btn-search')).toBeVisible();
    });
  });

  test('프로그램 그룹 관리 기능 테스트', async ({ page }) => {
    await test.step('기본 조회 실행', async () => {
      await page.locator('button.btn-search').click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('프로그램 그룹 선택 및 수정', async () => {
      // 프로그램 그룹 행 선택
      await page.getByRole('row', { name: '13 P250728002 신규추가테스트' }).getByRole('button').click();
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: '확인' }).click();
      await page.waitForTimeout(1000);

      // 그룹명 클릭하여 수정 모드로 전환 (첫 번째 요소 선택)
      await page.getByRole('gridcell', { name: '신규추가테스트_COPYa_COPY_COPY' }).first().click();
      await page.waitForTimeout(500);

      // 프로그램 그룹명 수정 (첫 번째 요소 선택)
      await page.getByRole('row', { name: '*프로그램 그룹명 신규추가테스트' }).getByRole('textbox').first().click();
      await page.getByRole('row', { name: '*프로그램 그룹명 신규추가테스트' }).getByRole('textbox').first().fill('신규추가테스트_COPYa_COPY_COPYa');
      
      // 입력값 확인
      const inputValue = await page.getByRole('row', { name: '*프로그램 그룹명 신규추가테스트' }).getByRole('textbox').first().inputValue();
      expect(inputValue).toBe('신규추가테스트_COPYa_COPY_COPYa');
    });

    await test.step('저장 실행', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });
      await page.getByRole('button', { name: '저장' }).click();
      await page.waitForTimeout(2000); // 저장 완료 대기
    });

    await test.step('다른 프로그램 그룹 선택', async () => {
      await page.getByRole('gridcell', { name: '프로그램 그룹 신규 생성' }).first().click();
      await page.getByRole('gridcell', { name: '인사관리자그룹_COPY_TEST', exact: true }).first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('다른 프로그램 그룹 재선택', async () => {
      await page.getByRole('gridcell', { name: '시스템관리자복사테스트' }).first().click();
      await page.getByRole('gridcell', { name: '인사관리자그룹_COPY_TEST', exact: true }).first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 추가 팝업 열기', async () => {
      const page1Promise = page.waitForEvent('popup');
      await page.locator('button.btn-etc').filter({ hasText: '추가' }).click();
      const page1 = await page1Promise;
      
      // 팝업이 열렸는지 확인
      expect(page1).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page1.waitForLoadState('networkidle');
    });

    await test.step('팝업에서 프로그램 선택', async () => {
      const page1 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 그리드가 로드될 때까지 대기
      await page1.waitForSelector('[role="gridcell"]', { timeout: 10000 });
      
      // 첫 번째 프로그램 셀 클릭
      await page1.locator('[role="gridcell"]').first().click();
      await page1.locator('[role="gridcell"]').first().dblclick();
      
      // 체크박스가 나타날 때까지 대기 후 체크
      await page1.waitForSelector('#ag-23-input', { timeout: 5000 });
      await page1.locator('#ag-57-input').check();
      await page1.waitForTimeout(1000);
    });

    await test.step('프로그램 삭제', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });
      await page.getByRole('button', { name: '삭제' }).click();
      await page.waitForTimeout(2000); // 삭제 완료 대기
    });

    await test.step('프로그램 그룹 재선택', async () => {
      await page.getByRole('gridcell', { name: '프로그램 그룹 신규 생성' }).click();
      await page.getByRole('gridcell', { name: '인사관리자그룹_COPY_TEST', exact: true }).click();
      await page.waitForTimeout(1000);
    });
  });

  test('프로그램 그룹 검색 및 조회', async ({ page }) => {
    await test.step('기본 조회 실행', async () => {
      await page.locator('button.btn-search').click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('그룹명으로 검색', async () => {
      await page.locator('input[name="PGM_GRP_NM"]').fill('신규추가테스트');
      await page.locator('button.btn-search').click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
      
      // 검색 결과가 있는지 확인
      const gridCells = await page.locator('[role="gridcell"]').count();
      expect(gridCells).toBeGreaterThan(0);
    });

    await test.step('사용여부별 검색', async () => {
      await page.locator('select[name="USE_YN"]').selectOption('Y');
      await page.locator('button.btn-search').click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
      
      // 검색 결과가 있는지 확인
      const gridCells = await page.locator('[role="gridcell"]').count();
      expect(gridCells).toBeGreaterThan(0);
    });
  });

  test('프로그램 그룹 신규 등록', async ({ page }) => {
    await test.step('신규 버튼 클릭', async () => {
      await page.locator('button.btn-etc').filter({ hasText: '신규' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 그룹명 입력', async () => {
      await page.locator('input[value=""]').first().fill('신규추가테스트');
      
      // 입력값이 제대로 들어갔는지 확인
      const inputValue = await page.locator('input[value="신규추가테스트"]').first().inputValue();
      expect(inputValue).toBe('신규추가테스트');
    });

    await test.step('사용여부 선택', async () => {
      // 상세 정보 영역의 사용여부 select 선택
      await page.locator('select.combo-base').nth(1).selectOption('Y');
      
      // 선택값이 제대로 들어갔는지 확인
      const selectedValue = await page.locator('select.combo-base').nth(1).inputValue();
      expect(selectedValue).toBe('Y');
    });

    await test.step('저장 실행', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });
      await page.locator('button.btn-act').filter({ hasText: '저장' }).click();
      await page.waitForTimeout(2000); // 저장 완료 대기
    });
  });

  test('프로그램 추가 및 삭제', async ({ page }) => {
    await test.step('기본 조회 실행', async () => {
      await page.locator('button.btn-search').click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('프로그램 그룹 선택', async () => {
      await page.getByRole('gridcell', { name: '프로그램 그룹 신규 생성' }).first().click();
      await page.getByRole('gridcell', { name: '인사관리자그룹_COPY_TEST', exact: true }).first().click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 추가 팝업 열기', async () => {
      const page1Promise = page.waitForEvent('popup');
      await page.locator('button.btn-etc').filter({ hasText: '추가' }).click();
      const page1 = await page1Promise;
      
      // 팝업이 열렸는지 확인
      expect(page1).toBeTruthy();
    });

    await test.step('프로그램 선택 및 추가', async () => {
      const page1 = page.context().pages()[1]; // 팝업 페이지
      
      // 팝업 페이지 로딩 대기
      await page1.waitForLoadState('networkidle');
      
      // 프로그램 그리드가 로드될 때까지 대기
      await page1.waitForSelector('[role="gridcell"]', { timeout: 10000 });
      
      // 첫 번째 프로그램 셀 클릭
      await page1.locator('[role="gridcell"]').first().click();
      await page1.locator('[role="gridcell"]').first().dblclick();
      
      // 체크박스가 나타날 때까지 대기 후 체크
      await page1.waitForSelector('#ag-57-input', { timeout: 5000 });
      await page1.locator('#ag-57-input').check();
      await page1.waitForTimeout(1000);
    });

    await test.step('프로그램 삭제', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });
      await page.locator('button.btn-delete').filter({ hasText: '삭제' }).click();
      await page.waitForTimeout(2000); // 삭제 완료 대기
    });

    await test.step('프로그램 그룹 재선택', async () => {
      await page.getByRole('gridcell', { name: '프로그램 그룹 신규 생성' }).first().click();
      await page.getByRole('gridcell', { name: '인사관리자그룹_COPY_TEST', exact: true }).first().click();
      await page.waitForTimeout(1000);
    });
  });

  test('프로그램 그룹 관리 페이지 UI 요소 확인', async ({ page }) => {
    await test.step('검색 영역 UI 요소 확인', async () => {
      await expect(page.locator('input[name="PGM_GRP_NM"]')).toBeVisible();
      await expect(page.locator('select[name="USE_YN"]')).toBeVisible();
      await expect(page.locator('button.btn-search')).toBeVisible();
    });

    await test.step('버튼 영역 UI 요소 확인', async () => {
      await expect(page.locator('button.btn-etc').filter({ hasText: '신규' })).toBeVisible();
      await expect(page.locator('button.btn-act').filter({ hasText: '저장' })).toBeVisible();
      await expect(page.locator('button.btn-etc').filter({ hasText: '추가' })).toBeVisible();
      await expect(page.locator('button.btn-delete').filter({ hasText: '삭제' })).toBeVisible();
    });

    await test.step('상세 정보 영역 UI 요소 확인', async () => {
      await expect(page.locator('input[value=""]').first()).toBeVisible();
      await expect(page.locator('select.combo-base').nth(1)).toBeVisible();
    });
  });

  test('프로그램 그룹 검색 조건 초기화', async ({ page }) => {
    await test.step('검색 조건 입력', async () => {
      await page.locator('input[name="PGM_GRP_NM"]').fill('테스트');
      await page.locator('select[name="USE_YN"]').selectOption('Y');
      
      // 입력값들이 제대로 들어갔는지 확인
      const keywordValue = await page.locator('input[name="PGM_GRP_NM"]').inputValue();
      const useYnValue = await page.locator('select[name="USE_YN"]').inputValue();
      
      expect(keywordValue).toBe('테스트');
      expect(useYnValue).toBe('Y');
    });

    await test.step('검색 조건 초기화', async () => {
      await page.locator('input[name="PGM_GRP_NM"]').fill('');
      await page.locator('select[name="USE_YN"]').selectOption('');
      
      // 입력값들이 제대로 초기화되었는지 확인
      const keywordValue = await page.locator('input[name="PGM_GRP_NM"]').inputValue();
      const useYnValue = await page.locator('select[name="USE_YN"]').inputValue();
      
      expect(keywordValue).toBe('');
      expect(useYnValue).toBe('');
    });

    await test.step('초기화 후 조회', async () => {
      await page.locator('button.btn-search').click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
      
      // 조회 결과가 있는지 확인
      const gridCells = await page.locator('[role="gridcell"]').count();
      expect(gridCells).toBeGreaterThan(0);
    });
  });
}); 