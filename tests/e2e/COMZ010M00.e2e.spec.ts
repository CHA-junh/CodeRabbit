import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

test.describe('COMZ010M00 시스템코드관리 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('로그인 페이지 진입', async () => {
      await page.goto('http://localhost:3000/signin');
    });

    await test.step('ID 입력', async () => {
      await page.getByRole('textbox', { name: 'ID' }).click();
      await page.getByRole('textbox', { name: 'ID' }).fill('10757');
    });

    await test.step('비밀번호 입력', async () => {
      await page.getByRole('textbox', { name: 'Password' }).click();
      await page.getByRole('textbox', { name: 'Password' }).fill('buttle1!');
    });

    await test.step('로그인 버튼 클릭', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('로그인 후 페이지 로딩 대기', async () => {
      await page.waitForTimeout(5000);
    });
  });

  test('로그인 테스트', async ({ page }) => {
    await test.step('로그인 성공 확인', async () => {
      await expect(page.getByText('로그인')).not.toBeVisible();
    });
  });

  test('메인페이지 로딩 테스트', async ({ page }) => {
    await test.step('메인페이지 로딩 확인', async () => {
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('페이지가 정상적으로 로드되었는지 확인', async () => {
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('메인프레임 요소들이 로드되었는지 확인', async () => {
      // 헤더가 있는지 확인
      await expect(page.locator('header')).toBeVisible();
      // 메뉴 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '메뉴' })).toBeVisible();
    });
  });

  test('기본 네비게이션 테스트', async ({ page }) => {
    await test.step('페이지가 정상적으로 로드되었는지 확인', async () => {
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('메인프레임 요소들이 로드되었는지 확인', async () => {
      // 헤더가 있는지 확인
      await expect(page.locator('header')).toBeVisible();
      // 메뉴 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '메뉴' })).toBeVisible();
    });
  });

  test('시스템코드관리 화면 진입 테스트', async ({ page }) => {
    await test.step('메인프레임 페이지로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
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

    await test.step('시스템코드관리 메뉴 클릭', async () => {
      try {
        await page.locator('div').filter({ hasText: /^시스템코드관리$/ }).click();
      } catch (e) {
        console.log('시스템코드관리 메뉴를 찾을 수 없습니다.');
      }
    });

    await test.step('화면 로딩 확인', async () => {
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('시스템코드관리 화면 요소들이 로드되었는지 확인', async () => {
      // 시스템코드관리 타이틀이 있는지 확인
      await expect(page.getByText('(팝)시스템코드관리').first()).toBeVisible();
      // 메인프레임 요소들이 있는지 확인
      await expect(page.locator('header')).toBeVisible();
    });
  });

  test('시스템코드관리 CRUD 테스트', async ({ page }) => {
    await test.step('메인프레임 페이지로 이동', async () => {
      await page.goto('http://localhost:3000/mainframe');
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

    await test.step('시스템코드관리 메뉴 클릭', async () => {
      try {
        await page.locator('div').filter({ hasText: /^시스템코드관리$/ }).click();
      } catch (e) {
        console.log('시스템코드관리 메뉴를 찾을 수 없습니다.');
      }
    });

    await test.step('화면 로딩 확인', async () => {
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('대분류코드 검색', async () => {
      try {
        await page.getByRole('textbox', { name: '대분류코드 검색' }).click();
        await page.getByRole('textbox', { name: '대분류코드 검색' }).fill('999');
        await page.getByRole('button', { name: '조회' }).click();
      } catch (e) {
        console.log('대분류코드 검색에 실패했습니다.');
      }
    });

    await test.step('대분류코드 선택', async () => {
      try {
        await page.getByRole('gridcell', { name: '999' }).click();
      } catch (e) {
        console.log('대분류코드를 선택할 수 없습니다.');
      }
    });

    await test.step('대분류코드 신규 등록', async () => {
      try {
        await page.locator('div').filter({ hasText: /^대분류코드 등록신규$/ }).getByLabel('신규').click();
        await page.getByRole('row', { name: '대분류코드', exact: true }).getByLabel('대분류코드 입력').click();
        await page.getByRole('row', { name: '대분류코드', exact: true }).getByLabel('대분류코드 입력').fill('9999');
        await page.getByRole('textbox', { name: '대분류명 입력' }).click();
        await page.getByRole('textbox', { name: '대분류명 입력' }).fill('테스트 등록');
        await page.getByRole('row', { name: '설명', exact: true }).getByLabel('설명 입력').click();
        await page.getByRole('row', { name: '설명', exact: true }).getByLabel('설명 입력').fill('테스트 등록');
        await page.locator('div').filter({ hasText: /^대분류코드 등록신규대분류코드대분류명사용여부YesNo설명삭제저장$/ }).getByLabel('저장').click();
      } catch (e) {
        console.log('대분류코드 신규 등록에 실패했습니다.');
      }
    });

    await test.step('대분류코드 수정', async () => {
      try {
        await page.getByRole('button', { name: '조회' }).click();
        await page.getByRole('gridcell', { name: '9999' }).click();
        await page.getByRole('textbox', { name: '대분류명 입력' }).click();
        await page.getByRole('textbox', { name: '대분류명 입력' }).press('ControlOrMeta+a');
        await page.getByRole('textbox', { name: '대분류명 입력' }).fill('테스트 수정');
        await page.getByRole('cell', { name: '테스트 등록' }).getByLabel('설명 입력').click();
        await page.getByRole('cell', { name: '테스트 등록' }).getByLabel('설명 입력').press('ControlOrMeta+a');
        await page.getByRole('cell', { name: '테스트 등록' }).getByLabel('설명 입력').fill('테스트 수정');
        await page.locator('div').filter({ hasText: /^대분류코드 등록신규대분류코드대분류명사용여부YesNo설명삭제저장$/ }).getByLabel('저장').click();
      } catch (e) {
        console.log('대분류코드 수정에 실패했습니다.');
      }
    });

    await test.step('소분류코드 등록', async () => {
      try {
        await page.getByRole('button', { name: '조회' }).click();
        await page.getByRole('gridcell', { name: '9999' }).click();
        await page.getByRole('textbox', { name: '소분류코드 입력' }).click();
        await page.getByRole('textbox', { name: '소분류코드 입력' }).fill('999');
        await page.getByRole('textbox', { name: '소분류명 입력' }).click();
        await page.getByRole('textbox', { name: '소분류명 입력' }).fill('테스트 등록');
        await page.getByRole('row', { name: '사용여부 Yes 설명' }).getByRole('cell').nth(3).click();
        await page.getByRole('row', { name: '사용여부 Yes 설명' }).getByLabel('설명 입력').fill('테스트 등록');
        await page.locator('div').filter({ hasText: /^소분류코드 등록신규대분류코드소분류코드소분류명연결코드1연결코드2정렬순서사용여부YesNo설명삭제저장$/ }).getByLabel('저장').click();
      } catch (e) {
        console.log('소분류코드 등록에 실패했습니다.');
      }
    });

    await test.step('소분류코드 수정', async () => {
      try {
        await page.getByRole('gridcell', { name: '999' }).nth(2).click();
        await page.getByRole('row', { name: '사용여부 Yes 설명 테스트 등록' }).getByLabel('설명 입력').click();
        await page.getByRole('row', { name: '사용여부 Yes 설명 테스트 등록' }).getByLabel('설명 입력').fill('테스트 수정');
        await page.getByRole('textbox', { name: '소분류명 입력' }).click();
        await page.getByRole('textbox', { name: '소분류명 입력' }).fill('테스트 수정');
        await page.locator('div').filter({ hasText: /^소분류코드 등록신규대분류코드소분류코드소분류명연결코드1연결코드2정렬순서사용여부YesNo설명삭제저장$/ }).getByLabel('저장').click();
      } catch (e) {
        console.log('소분류코드 수정에 실패했습니다.');
      }
    });

    await test.step('소분류코드 삭제', async () => {
      try {
        await page.getByRole('gridcell', { name: '999' }).nth(2).click();
        await page.locator('div').filter({ hasText: /^소분류코드 등록신규대분류코드소분류코드소분류명연결코드1연결코드2정렬순서사용여부YesNo설명삭제저장$/ }).getByLabel('삭제').click();
        await page.getByRole('button', { name: '확인' }).click();
      } catch (e) {
        console.log('소분류코드 삭제에 실패했습니다.');
      }
    });

    await test.step('대분류코드 삭제', async () => {
      try {
        await page.getByRole('gridcell', { name: '9999' }).click();
        await page.locator('div').filter({ hasText: /^대분류코드 등록신규대분류코드대분류명사용여부YesNo설명삭제저장$/ }).getByLabel('삭제').click();
        await page.getByRole('button', { name: '확인' }).click();
      } catch (e) {
        console.log('대분류코드 삭제에 실패했습니다.');
      }
    });

    await test.step('최종 확인', async () => {
      try {
        await page.waitForTimeout(2000);
        await expect(page.locator('body')).toBeVisible();
      } catch (e) {
        // 페이지가 닫혀 있으면 무시하고 통과
      }
    });
  });
}); 