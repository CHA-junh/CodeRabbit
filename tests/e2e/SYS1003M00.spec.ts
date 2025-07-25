import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 2560, height: 1440 }
});

test.describe('SYS1003M00 사용자역할관리 - 사용자역할목록 조회', () => {
  test('사용자역할목록 조회', async ({ page }) => {
    await test.step('로그인 페이지 진입', async () => {
      await page.goto('http://localhost:3000/signin');
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
    await test.step('메뉴 오픈 및 시스템관리 진입', async () => {
      await page.getByRole('button', { name: '메뉴 아이콘 메뉴' }).click();
      await page.getByText('시스템관리').click();
      await page.getByText('시스템관리').nth(1).click();
      await page.locator('div').filter({ hasText: /^사용자역할관리$/ }).click();
    });
    await test.step('사용자역할코드/명 입력', async () => {
      await page.getByRole('textbox', { name: '사용자역할코드/명 입력' }).fill('관리자');
    });
    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });
    await test.step('결과 그리드에서 "인사관리자" 확인', async () => {
      await expect(page.getByRole('gridcell', { name: '인사관리자', exact: true })).toBeVisible();
    });
  });
}); 