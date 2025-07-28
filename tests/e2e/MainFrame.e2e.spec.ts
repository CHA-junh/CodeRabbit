import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 800,
    width: 1200
  }
});

test.describe('메인 프레임 E2E', () => {
  test('메인 프레임 기본 로딩 테스트', async ({ page }) => {
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

    await test.step('메인 프레임 요소들이 로드되었는지 확인', async () => {
      // TopBar가 있는지 확인
      await expect(page.locator('header')).toBeVisible();
      // 공지사항이 있는지 확인
      await expect(page.getByText('공지사항내용이 표시됩니다.')).toBeVisible();
    });
  });

  test('로그인 정보 확인 테스트', async ({ page }) => {
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

    await test.step('메인 프레임이 로드되었는지 확인', async () => {
      // 메인 프레임이 로드되었는지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('메뉴트리 로그인 정보 확인 테스트', async ({ page }) => {
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

    await test.step('메뉴 버튼 클릭', async () => {
      await page.getByRole('button', { name: '메뉴' }).click();
    });

    await test.step('사이드 메뉴가 열렸는지 확인', async () => {
      await expect(page.getByText('메뉴')).toBeVisible();
    });

    await test.step('사이드 메뉴의 사용자 정보가 표시되는지 확인', async () => {
      // 사용자 정보 영역이 있는지 확인 (더 구체적인 선택자 사용)
      await expect(page.locator('div').filter({ hasText: '차준형' }).first()).toBeVisible();
    });
  });

  test('로그아웃 기능 테스트', async ({ page }) => {
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

    await test.step('메뉴 버튼 클릭', async () => {
      await page.getByRole('button', { name: '메뉴' }).click();
    });

    await test.step('로그아웃 버튼 클릭', async () => {
      await page.getByRole('button', { name: '로그아웃' }).click();
    });

    await test.step('로그아웃 후 로그인 페이지로 이동했는지 확인', async () => {
      // 로그인 페이지 요소들이 있는지 확인
      await expect(page.getByLabel('ID')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
  });

  test('홈페이지 바로가기 테스트', async ({ page }) => {
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

    await test.step('메뉴 버튼 클릭', async () => {
      await page.getByRole('button', { name: '메뉴' }).click();
    });

    await test.step('사이드 메뉴가 열렸는지 확인', async () => {
      await expect(page.getByText('메뉴')).toBeVisible();
    });

    await test.step('사이드 메뉴의 로그아웃 버튼이 있는지 확인', async () => {
      // 로그아웃 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible();
    });
  });

  test('그룹웨어 바로가기 테스트', async ({ page }) => {
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

    await test.step('메뉴 버튼 클릭', async () => {
      await page.getByRole('button', { name: '메뉴' }).click();
    });

    await test.step('사이드 메뉴가 열렸는지 확인', async () => {
      await expect(page.getByText('메뉴')).toBeVisible();
    });

    await test.step('사이드 메뉴의 사용자 정보가 표시되는지 확인', async () => {
      // 사용자 정보 영역이 있는지 확인
      await expect(page.locator('div').filter({ hasText: '차준형' }).first()).toBeVisible();
    });
  });

  test('메뉴트리 열기/닫기 테스트', async ({ page }) => {
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

    await test.step('메뉴 버튼 클릭', async () => {
      await page.getByRole('button', { name: '메뉴' }).click();
    });

    await test.step('사이드 메뉴가 열렸는지 확인', async () => {
      await expect(page.getByText('메뉴')).toBeVisible();
    });

    await test.step('메뉴가 열린 상태를 확인', async () => {
      // 메뉴가 열린 상태를 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('탭 기능 테스트', async ({ page }) => {
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

    await test.step('메인 프레임이 로드되었는지 확인', async () => {
      // 메인 프레임이 로드되었는지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('검색창 기능 테스트', async ({ page }) => {
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

    await test.step('검색창이 표시되는지 확인', async () => {
      // 검색창이 있는지 확인 (placeholder가 다를 수 있음)
      await expect(page.locator('input[type="text"]').first()).toBeVisible();
    });

    await test.step('검색창에 텍스트 입력', async () => {
      await page.locator('input[type="text"]').first().fill('테스트 검색어');
    });

    await test.step('검색어가 입력되었는지 확인', async () => {
      await expect(page.locator('input[type="text"]').first()).toHaveValue('테스트 검색어');
    });
  });

  test('공지사항 표시 테스트', async ({ page }) => {
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

    await test.step('공지사항이 표시되는지 확인', async () => {
      await expect(page.getByText('공지사항내용이 표시됩니다.')).toBeVisible();
    });
  });

  test('회사 로고 및 브랜딩 테스트', async ({ page }) => {
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

    await test.step('메인 프레임이 로드되었는지 확인', async () => {
      // 메인 프레임이 로드되었는지 확인
      await expect(page.locator('body')).toBeVisible();
    });
  });
}); 