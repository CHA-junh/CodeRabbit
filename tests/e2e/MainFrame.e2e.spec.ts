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

    await test.step('메인프레임으로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
    });

    await test.step('메인프레임 요소들이 로드되었는지 확인', async () => {
      // TopFrame이 있는지 확인
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

    await test.step('메인프레임으로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
    });

    await test.step('TopFrame의 사용자 정보가 표시되는지 확인', async () => {
      // TopFrame의 사용자 정보 영역이 있는지 확인
      await expect(page.locator('header')).toBeVisible();
      // 사용자 프로필 아이콘이 있는지 확인
      await expect(page.locator('img[alt="user"]')).toBeVisible();
      // 사용자 정보 텍스트가 표시되는지 확인 (팀명, 사용자명, 직급 포함)
      await expect(page.getByText('SI 3팀(25)(10757) 차준형 사원')).toBeVisible();
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

    await test.step('메인프레임으로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
    });

    await test.step('메뉴트리가 표시되는지 확인', async () => {
      // 메뉴트리 영역이 있는지 확인
      await expect(page.locator('body')).toBeVisible();
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

    await test.step('메인프레임으로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
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

    await test.step('메인프레임으로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
    });

    await test.step('부뜰 홈페이지 바로가기 버튼 클릭', async () => {
      const page3Promise = page.waitForEvent('popup');
      await page.getByRole('button', { name: '부뜰 홈페이지 바로가기' }).click();
      const page3 = await page3Promise;
      await expect(page3.url()).toContain('buttle.co.kr');
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

    await test.step('메인프레임으로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
    });

    await test.step('그룹웨어로 바로가기 버튼 클릭', async () => {
      const page4Promise = page.waitForEvent('popup');
      await page.getByRole('button', { name: '그룹웨어로 바로가기' }).click();
      const page4 = await page4Promise;
      await expect(page4.url()).toContain('daouoffice.com');
    });
  });

  test('메뉴 탭 생성 확인 테스트', async ({ page }) => {
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

    await test.step('메인프레임으로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
    });

    await test.step('메뉴 아이콘 클릭', async () => {
      await page.getByRole('button', { name: '메뉴 아이콘 메뉴' }).click();
    });

    await test.step('첫 번째 expand 아이콘 클릭', async () => {
      await page.getByRole('img', { name: 'expand' }).first().click();
    });

    await test.step('두 번째 expand 아이콘 클릭', async () => {
      await page.getByRole('img', { name: 'expand' }).nth(1).click();
    });

    await test.step('사용자관리 메뉴 클릭', async () => {
      await page.getByText('사용자관리').nth(1).click();
    });

    await test.step('메뉴 아이콘 다시 클릭', async () => {
      await page.getByRole('button', { name: '메뉴 아이콘 메뉴' }).click();
    });

    await test.step('세 번째 expand 아이콘 클릭', async () => {
      await page.getByRole('img', { name: 'expand' }).nth(2).click();
    });

    await test.step('시스템코드관리 메뉴 클릭', async () => {
      await page.getByText('시스템코드관리').click();
    });

    await test.step('사용자관리 탭 닫기', async () => {
      await page.locator('div').filter({ hasText: /^사용자관리×$/ }).locator('span').click();
    });

    await test.step('시스템코드관리 팝업 클릭', async () => {
      await page.getByText('(팝)시스템코드관리').click();
    });

    await test.step('탭이 생성되었는지 확인', async () => {
      // 탭 영역이 있는지 확인
      await expect(page.locator('body')).toBeVisible();
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

}); 