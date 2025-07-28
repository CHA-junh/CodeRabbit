import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

test.describe('COM0020M00 로그인 화면 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('로그인 페이지 진입', async () => {
      await page.goto('http://172.20.30.176:3000/signin');
    });
  });

  test('기본 로그인 테스트', async ({ page }) => {
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
      await page.waitForTimeout(3000);
    });

    await test.step('로그인 성공 확인', async () => {
      await expect(page.getByText('로그인')).not.toBeVisible();
    });
  });

  test('비밀번호 변경 후 로그인 테스트', async ({ page }) => {
    await test.step('ID 입력', async () => {
      await page.getByRole('textbox', { name: 'ID' }).click();
      await page.getByRole('textbox', { name: 'ID' }).fill('10757');
    });

    await test.step('초기 비밀번호 입력', async () => {
      await page.getByRole('textbox', { name: 'Password' }).click();
      await page.getByRole('textbox', { name: 'Password' }).fill('10757');
    });

    await test.step('로그인 버튼 클릭', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('비밀번호 변경 팝업 대기 및 확인', async () => {
      await page.waitForTimeout(2000);
      
      // 비밀번호 변경 팝업이 나타나는지 확인
      const popupExists = await page.getByPlaceholder('8~20자, 2종류 이상 조합').count();
      
      if (popupExists > 0) {
        await test.step('새 비밀번호 입력', async () => {
          await page.getByPlaceholder('8~20자, 2종류 이상 조합').click();
          await page.getByPlaceholder('8~20자, 2종류 이상 조합').fill('buttle1!');
          await page.getByPlaceholder('8~20자, 2종류 이상 조합').press('Tab');
        });

        await test.step('비밀번호 확인 입력', async () => {
          await page.getByPlaceholder('비밀번호 확인').fill('buttle1!');
        });

        await test.step('확인 버튼 클릭', async () => {
          await page.getByRole('button', { name: '확인' }).click();
        });

        await test.step('비밀번호 변경 완료 후 로그인 페이지로 돌아가기 대기', async () => {
          await page.waitForTimeout(2000);
        });
      } else {
        console.log('비밀번호 변경 팝업이 나타나지 않아 패스합니다.');
      }
    });

    await test.step('변경된 비밀번호로 다시 로그인', async () => {
      await page.getByRole('textbox', { name: 'ID' }).click();
      await page.getByRole('textbox', { name: 'ID' }).fill('10757');
      await page.getByRole('textbox', { name: 'ID' }).press('Tab');
      await page.getByRole('textbox', { name: 'Password' }).fill('buttle1!');
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('최종 로그인 성공 확인', async () => {
      await page.waitForTimeout(3000);
      await expect(page.getByText('로그인')).not.toBeVisible();
    });
  });

  test('로그인 화면 UI 요소 테스트', async ({ page }) => {
    await test.step('페이지 제목 확인', async () => {
      await expect(page.getByText('Sign in')).toBeVisible();
    });

    await test.step('ID 입력 필드 확인', async () => {
      await expect(page.getByRole('textbox', { name: 'ID' })).toBeVisible();
    });

    await test.step('Password 입력 필드 확인', async () => {
      await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    });

    await test.step('Login 버튼 확인', async () => {
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    await test.step('안내 문구 확인', async () => {
      await expect(page.getByText('ID는 사원번호이며, 초기비밀번호는 사원번호입니다.')).toBeVisible();
    });

    await test.step('하단 안내 문구 확인', async () => {
      await expect(page.getByText('본 시스템은 부뜰종합전산시스템입니다.')).toBeVisible();
    });
  });

  test('입력 검증 테스트', async ({ page }) => {
    await test.step('ID 필드에 숫자만 입력 가능한지 확인', async () => {
      const idInput = page.getByRole('textbox', { name: 'ID' });
      await idInput.click();
      await idInput.fill('abc123def');
      
      // 숫자만 남아있는지 확인
      const value = await idInput.inputValue();
      expect(value).toBe('123');
    });

    await test.step('빈 필드로 로그인 시도', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForTimeout(1000);
      
      // 에러 메시지가 표시되는지 확인
      const errorMessage = await page.locator('.text-red-600').textContent();
      expect(errorMessage).toContain('사원번호와 비밀번호를 입력해주세요');
    });

    await test.step('ID만 입력하고 로그인 시도', async () => {
      await page.getByRole('textbox', { name: 'ID' }).fill('10757');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForTimeout(1000);
      
      // 에러 메시지가 표시되는지 확인
      const errorMessage = await page.locator('.text-red-600').textContent();
      expect(errorMessage).toContain('사원번호와 비밀번호를 입력해주세요');
    });
  });

  test('잘못된 로그인 정보 테스트', async ({ page }) => {
    await test.step('잘못된 ID로 로그인 시도', async () => {
      await page.getByRole('textbox', { name: 'ID' }).fill('99999');
      await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('로그인 실패 메시지 확인', async () => {
      await page.waitForTimeout(2000);
      const errorMessage = await page.locator('.text-red-600').textContent();
      expect(errorMessage).toBeTruthy();
    });
  });
}); 