import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1440,
    width: 2560
  }
});

test.describe('SYS1002M00 메뉴별 프로그램 관리 E2E', () => {
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

  test('메뉴 검색 및 조회', async ({ page }) => {
    await test.step('메뉴 키워드 검색', async () => {
      await page.locator('input[name="MENU_KWD"]').click();
      await page.locator('input[name="MENU_KWD"]').fill('신규수정');
      await page.locator('input[name="MENU_KWD"]').press('Enter');
    });

    await test.step('사용여부 필터링', async () => {
      await page.locator('select[name="USE_YN"]').selectOption('N');
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('사용여부 변경 후 재조회', async () => {
      await page.locator('select[name="USE_YN"]').selectOption('Y');
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });

    await test.step('검색 조건 초기화', async () => {
      await page.locator('select[name="USE_YN"]').selectOption('');
      await page.locator('input[name="MENU_KWD"]').click();
      await page.locator('input[name="MENU_KWD"]').fill('');
      await page.getByRole('button', { name: '조회' }).click();
      await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    });
  });

  test('메뉴 선택 및 수정', async ({ page }) => {
    await test.step('메뉴 선택', async () => {
      // 최하단 메뉴 선택
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('메뉴명 수정', async () => {
      // 메뉴명 셀을 찾아서 수정
      const menuNameCell = page.locator('[role="gridcell"]').filter({ hasText: /^[가-힣]/ }).first();
      await menuNameCell.click();
      await menuNameCell.dblclick();
      await page.keyboard.press('Control+a');
      await page.keyboard.type('신규수정삭제테스트수정');
      await page.keyboard.press('Enter');
    });

    await test.step('저장 실행', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });
      await page.getByRole('button', { name: '저장' }).nth(1).click();
      await page.waitForTimeout(2000);
    });

    await test.step('수정된 메뉴 확인', async () => {
      // 수정된 메뉴가 있는지 확인
      await page.locator('[role="gridcell"]').filter({ hasText: '신규수정삭제테스트수정' }).first().click();
      await page.waitForTimeout(1000);
    });
  });

  test('메뉴 삭제', async ({ page }) => {
    await test.step('메뉴 선택', async () => {
      // 제일 아래쪽에 있는 메뉴 선택 (마지막 행)
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('메뉴 삭제 실행', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {});
      });
      await page.getByRole('button', { name: '메뉴삭제' }).click();
      await page.getByRole('button', { name: '확인' }).click();
      await page.waitForTimeout(2000);
    });
  });

  test('메뉴 신규 등록', async ({ page }) => {
    await test.step('신규 버튼 클릭', async () => {
      await page.getByRole('button', { name: '신규' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('메뉴명 입력', async () => {
      await page.getByRole('row', { name: '*메뉴명 사용여부 사용' }).getByRole('textbox').click();
      await page.getByRole('row', { name: '*메뉴명 사용여부 사용' }).getByRole('textbox').fill('신규수정삭제테스트');
    });

    await test.step('저장 실행', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });
      await page.getByRole('button', { name: '저장' }).nth(1).click();
      await page.waitForTimeout(2000);
    });
  });

  test('메뉴 복사', async ({ page }) => {
    await test.step('복사할 메뉴 선택', async () => {
      // 최하단 메뉴 선택
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('복사 저장 실행', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {});
      });
      await page.getByRole('button', { name: '복사저장' }).click();
      await page.getByRole('button', { name: '확인' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('복사된 메뉴 확인', async () => {
      // 복사된 메뉴가 있는지 확인 (COPY가 포함된 메뉴 찾기)
      await page.locator('[role="gridcell"]').filter({ hasText: 'COPY' }).first().click();
      await page.waitForTimeout(1000);
    });
  });

  test('메뉴 트리 탐색', async ({ page }) => {
    await test.step('메뉴 선택', async () => {
      // 최하단 메뉴 선택
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('트리 노드 클릭', async () => {
      // 트리에서 첫 번째 노드 클릭
      const treeNodes = page.locator('.menu-tree li');
      if (await treeNodes.count() > 0) {
        await treeNodes.first().click();
        await page.waitForTimeout(1000);
      }
    });
  });

  test('메뉴별 프로그램 추가', async ({ page }) => {
    await test.step('메뉴 선택', async () => {
      // 최하단 메뉴 선택
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('트리에서 하위 메뉴 선택', async () => {
      // 트리에서 첫 번째 노드 클릭
      const treeNodes = page.locator('.menu-tree li');
      if (await treeNodes.count() > 0) {
        await treeNodes.first().click();
        await page.waitForTimeout(1000);
      }
    });

    await test.step('프로그램 행 추가', async () => {
      // 프로그램 추가 버튼 찾기 (하단 영역의 추가 버튼)
      const addButtons = page.locator('button').filter({ hasText: '추가' });
      if (await addButtons.count() > 1) {
        await addButtons.nth(1).click();
      } else {
        await addButtons.first().click();
      }
      await page.waitForTimeout(1000);
    });

    await test.step('구분 선택', async () => {
      await page.getByRole('gridcell').filter({ hasText: /^$/ }).first().dblclick();
      await page.waitForTimeout(1000);
    });

    await test.step('표시명 입력', async () => {
      await page.getByRole('gridcell').filter({ hasText: /^$/ }).first().click();
      await page.getByRole('gridcell').filter({ hasText: /^$/ }).first().click();
      await page.getByRole('gridcell').filter({ hasText: /^$/ }).first().click();
      await page.getByRole('gridcell').filter({ hasText: /^$/ }).first().dblclick();
      await page.getByRole('textbox', { name: 'Input Editor' }).fill('메뉴하위트리테스트');
      await page.locator('.ag-body-viewport.ag-row-animation.ag-layout-normal.ag-has-focus > .ag-center-cols-viewport').click();
      await page.getByRole('gridcell').filter({ hasText: /^$/ }).first().click();
    });

    await test.step('저장 실행', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {});
      });
      await page.getByRole('button', { name: '저장' }).nth(2).click();
      await page.getByRole('button', { name: '확인' }).click();
      await page.waitForTimeout(2000);
    });

    await test.step('추가된 프로그램 확인', async () => {
      // 최하단 메뉴 선택
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
      
      // 트리에서 하위 메뉴가 있는지 확인
      const treeNodes = page.locator('.menu-tree li');
      if (await treeNodes.count() > 0) {
        await treeNodes.first().click();
        await page.waitForTimeout(1000);
      }
    });
  });

  test('프로그램 검색 팝업', async ({ page }) => {
    await test.step('메뉴 선택', async () => {
      // 최하단 메뉴 선택
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('트리에서 하위 메뉴 선택', async () => {
      // 제일 하단의 트리 항목 선택
      await page.locator('.menu-tree li').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 추가', async () => {
      // 프로그램 추가 버튼 찾기 (하단 영역의 추가 버튼)
      const addButtons = page.locator('button').filter({ hasText: '추가' });
      if (await addButtons.count() > 1) {
        await addButtons.nth(1).click();
      } else {
        await addButtons.first().click();
      }
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 검색 팝업 열기', async () => {
      const page11Promise = page.waitForEvent('popup');
      await page.getByRole('row', { name: '찾기 1 Y' }).getByRole('button').click();
      const page11 = await page11Promise;
      
      // 팝업이 열렸는지 확인
      expect(page11).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page11.waitForLoadState('networkidle');
      
      // 팝업 페이지가 로드될 때까지 대기
      await page11.waitForSelector('[role="gridcell"]', { timeout: 10000 });
    });

    await test.step('팝업에서 프로그램 선택', async () => {
      const page11 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 그리드가 로드될 때까지 대기
      await page11.waitForSelector('[role="gridcell"]', { timeout: 10000 });
      
      // 첫 번째 프로그램 선택
      await page11.locator('[role="gridcell"]').first().click();
      await page11.waitForTimeout(1000);
    });
  });

  test('프로그램 일괄 추가', async ({ page }) => {
    await test.step('메뉴 선택', async () => {
      // 최하단 메뉴 선택
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('프로그램 검색 팝업 열기', async () => {
      const page12Promise = page.waitForEvent('popup');
      // 프로그램 찾기 버튼 찾기 (하단 영역의 찾기 버튼)
      const searchButtons = page.locator('button').filter({ hasText: '찾기' });
      if (await searchButtons.count() > 1) {
        await searchButtons.nth(1).click();
      } else {
        await searchButtons.first().click();
      }
      const page12 = await page12Promise;
      
      // 팝업이 열렸는지 확인
      expect(page12).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page12.waitForLoadState('networkidle');
      
      // 팝업 페이지가 로드될 때까지 대기
      await page12.waitForSelector('[role="gridcell"]', { timeout: 10000 });
    });

    await test.step('팝업에서 여러 프로그램 선택', async () => {
      const page12 = page.context().pages()[1]; // 팝업 페이지
      
      // 프로그램 그리드가 로드될 때까지 대기
      await page12.waitForSelector('[role="gridcell"]', { timeout: 10000 });
      
      // 여러 프로그램 체크박스 선택
      await page12.locator('#ag-23-input').check();
      await page12.locator('#ag-25-input').check();
      await page12.locator('#ag-27-input').check();
      await page12.waitForTimeout(1000);
    });

    await test.step('선택된 프로그램 추가', async () => {
      const page12 = page.context().pages()[1]; // 팝업 페이지
      await page12.getByRole('button', { name: '추가' }).click();
    });

    await test.step('저장 실행', async () => {
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {});
      });
      await page.getByRole('button', { name: '저장' }).nth(2).click();
      await page.getByRole('button', { name: '확인' }).click();
      await page.waitForTimeout(2000);
    });
  });

  test('프로그램 삭제', async ({ page }) => {
    await test.step('메뉴 선택', async () => {
      // 최하단 메뉴 선택
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('메뉴 선택', async () => {
        // 최하단 메뉴 선택
        await page.locator('[role="gridcell"]').last().click();
        await page.waitForTimeout(1000);
      });
  
      await test.step('프로그램 검색 팝업 열기', async () => {
        const page12Promise = page.waitForEvent('popup');
        // 프로그램 찾기 버튼 찾기 (하단 영역의 찾기 버튼)
        const searchButtons = page.locator('button').filter({ hasText: '찾기' });
        if (await searchButtons.count() > 1) {
          await searchButtons.nth(1).click();
        } else {
          await searchButtons.first().click();
        }
        const page12 = await page12Promise;
        
        // 팝업이 열렸는지 확인
        expect(page12).toBeTruthy();
        
        // 팝업 페이지 로딩 대기
        await page12.waitForLoadState('networkidle');
        
        // 팝업 페이지가 로드될 때까지 대기
        await page12.waitForSelector('[role="gridcell"]', { timeout: 10000 });
      });
  
      await test.step('팝업에서 여러 프로그램 선택', async () => {
        const page12 = page.context().pages()[1]; // 팝업 페이지
        
        // 프로그램 그리드가 로드될 때까지 대기
        await page12.waitForSelector('[role="gridcell"]', { timeout: 10000 });
        
        // 여러 프로그램 체크박스 선택
        await page12.locator('#ag-23-input').check();
        await page12.locator('#ag-25-input').check();
        await page12.locator('#ag-27-input').check();
        await page12.waitForTimeout(1000);
      });
  
      await test.step('선택된 프로그램 추가', async () => {
        const page12 = page.context().pages()[1]; // 팝업 페이지
        await page12.getByRole('button', { name: '추가' }).click();
      });
  
      await test.step('저장 실행', async () => {
        page.on('dialog', dialog => {
          console.log(`Dialog message: ${dialog.message()}`);
          dialog.accept().catch(() => {});
        });
        await page.getByRole('button', { name: '저장' }).nth(2).click();
        await page.getByRole('button', { name: '확인' }).click();
        await page.waitForTimeout(2000);
      });

    await test.step('트리에서 하위 메뉴 선택', async () => {
      // 트리에서 첫 번째 노드 클릭
      const treeNodes = page.locator('.menu-tree li');
      if (await treeNodes.count() > 0) {
        await treeNodes.first().click();
        await page.waitForTimeout(1000);
      }
    });

    await test.step('프로그램 선택 및 삭제', async () => {
      // 메뉴별 프로그램 그리드의 첫 번째 체크박스 선택
      await page.locator('[role="gridcell"] input[type="checkbox"]').first().check();
      await page.waitForTimeout(1000);
      
      page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {});
      });
      await page.getByRole('button', { name: '삭제', exact: true }).click();
      await page.getByRole('button', { name: '확인' }).click();
      await page.waitForTimeout(2000);
    });
  });

  test('메뉴 미리보기', async ({ page }) => {
    await test.step('메뉴 선택', async () => {
      // 최하단 메뉴 선택
      await page.locator('[role="gridcell"]').last().click();
      await page.waitForTimeout(1000);
    });

    await test.step('메뉴 미리보기 팝업 열기', async () => {
      const page13Promise = page.waitForEvent('popup');
      await page.getByRole('button', { name: '메뉴미리보기' }).click();
      const page13 = await page13Promise;
      
      // 팝업이 열렸는지 확인
      expect(page13).toBeTruthy();
      
      // 팝업 페이지 로딩 대기
      await page13.waitForLoadState('networkidle');
      
      // 팝업 페이지가 로드될 때까지 대기
      await page13.waitForSelector('button', { timeout: 10000 });
    });

    await test.step('미리보기에서 메뉴 탐색', async () => {
      const page13 = page.context().pages()[1]; // 팝업 페이지
      
      // 미리보기 팝업에서 첫 번째 메뉴 클릭
      const menuItems = page13.locator('button, a, div').filter({ hasText: /^[가-힣]/ });
      if (await menuItems.count() > 0) {
        await menuItems.first().click();
      }
    });

    await test.step('미리보기 팝업 닫기', async () => {
      const page13 = page.context().pages()[1]; // 팝업 페이지
      await page13.getByRole('button', { name: '×' }).click();
    });
  });

  test('메뉴별 프로그램 관리 페이지 UI 요소 확인', async ({ page }) => {
    await test.step('검색 영역 UI 요소 확인', async () => {
      await expect(page.locator('input[name="MENU_KWD"]')).toBeVisible();
      await expect(page.locator('select[name="USE_YN"]')).toBeVisible();
      await expect(page.locator('button.btn-search')).toBeVisible();
    });

    await test.step('메뉴 상세 영역 UI 요소 확인', async () => {
      await expect(page.locator('input[value=""]').first()).toBeVisible();
      await expect(page.locator('select.combo-base').first()).toBeVisible();
    });

    await test.step('버튼 영역 UI 요소 확인', async () => {
      await expect(page.locator('button.btn-delete').filter({ hasText: '메뉴삭제' })).toBeVisible();
      await expect(page.locator('button.btn-etc').filter({ hasText: '복사저장' })).toBeVisible();
      await expect(page.locator('button.btn-etc').filter({ hasText: '신규' })).toBeVisible();
      // 메뉴 저장 버튼 (첫 번째 저장 버튼)
      await expect(page.getByRole('button', { name: '저장' }).nth(1)).toBeVisible();
    });

    await test.step('메뉴 트리 영역 UI 요소 확인', async () => {
      await expect(page.locator('h3').filter({ hasText: '메뉴 목록' })).toBeVisible();
    });

    await test.step('프로그램 관리 영역 UI 요소 확인', async () => {
      await expect(page.locator('h3').filter({ hasText: '메뉴 별 프로그램' })).toBeVisible();
      await expect(page.locator('button.btn-etc').filter({ hasText: '메뉴미리보기' })).toBeVisible();
      // 프로그램 찾기 버튼 확인
      await expect(page.locator('button').filter({ hasText: '찾기' })).toBeVisible();
      // 프로그램 추가 버튼 확인
      await expect(page.locator('button').filter({ hasText: '추가' })).toBeVisible();
      // 프로그램 삭제 버튼 (두 번째 삭제 버튼)
      await expect(page.getByRole('button', { name: '삭제', exact: true })).toBeVisible();
      // 프로그램 저장 버튼 (두 번째 저장 버튼)
      await expect(page.getByRole('button', { name: '저장' }).nth(2)).toBeVisible();
    });
  });

  test('메뉴 검색 조건 초기화', async ({ page }) => {
    await test.step('검색 조건 입력', async () => {
      await page.locator('input[name="MENU_KWD"]').fill('테스트');
      await page.locator('select[name="USE_YN"]').selectOption('Y');
      
      // 입력값들이 제대로 들어갔는지 확인
      const keywordValue = await page.locator('input[name="MENU_KWD"]').inputValue();
      const useYnValue = await page.locator('select[name="USE_YN"]').inputValue();
      
      expect(keywordValue).toBe('테스트');
      expect(useYnValue).toBe('Y');
    });

    await test.step('검색 조건 초기화', async () => {
      await page.locator('input[name="MENU_KWD"]').fill('');
      await page.locator('select[name="USE_YN"]').selectOption('');
      
      // 입력값들이 제대로 초기화되었는지 확인
      const keywordValue = await page.locator('input[name="MENU_KWD"]').inputValue();
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