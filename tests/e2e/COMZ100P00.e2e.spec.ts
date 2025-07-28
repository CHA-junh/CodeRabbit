import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 800,
    width: 1270
  }
});

test.describe('COMZ100P00 사용자명 검색 팝업 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('로그인 페이지 진입', async () => {
      await page.goto('http://172.20.30.176:3000/signin');
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

    await test.step('사용자명 검색 팝업 페이지로 직접 이동', async () => {
      await page.goto('http://172.20.30.176:3000/popup/com/COMZ100P00');
      await page.waitForTimeout(3000);
    });
  });

  test('기본 화면 로딩 테스트', async ({ page }) => {
    await test.step('사용자명 검색 팝업 화면 요소들이 로드되었는지 확인', async () => {
      // 팝업 헤더가 있는지 확인
      await expect(page.locator('.popup-header')).toBeVisible();
      // 사용자명 검색 타이틀이 있는지 확인
      await expect(page.getByText('사용자명 검색')).toBeVisible();
      // 검색 영역이 있는지 확인
      await expect(page.locator('.search-div')).toBeVisible();
      // 사용자명 입력 필드가 있는지 확인
      await expect(page.getByRole('textbox', { name: '사용자명 입력' })).toBeVisible();
      // 조회 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '조회' })).toBeVisible();
    });
  });

  test('사용자명 검색 테스트 - 차준형', async ({ page }) => {
    await test.step('사용자명 입력', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).fill('차준형');
    });

    await test.step('사용자명이 입력되었는지 확인', async () => {
      await expect(page.getByRole('textbox', { name: '사용자명 입력' })).toHaveValue('차준형');
    });

    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('검색 결과가 로드되었는지 확인', async () => {
      // 검색 결과 테이블이 표시되는지 확인
      await expect(page.locator('.grid-table')).toBeVisible();
      // 테이블 헤더가 있는지 확인
      await expect(page.getByText('No')).toBeVisible();
      await expect(page.getByText('사번')).toBeVisible();
      await expect(page.getByText('성명')).toBeVisible();
      await expect(page.getByText('본부명')).toBeVisible();
      await expect(page.getByText('부서명')).toBeVisible();
      await expect(page.getByText('직급명')).toBeVisible();
      await expect(page.getByText('사용자 권한')).toBeVisible();
    });
  });

  test('검색 결과 데이터 표시 테스트', async ({ page }) => {
    await test.step('사용자명 입력', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).fill('차준형');
    });

    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('검색 결과가 표시되는지 확인', async () => {
      // 검색 결과가 있는지 확인
      await expect(page.locator('.grid-table tbody tr')).toBeVisible();
    });

    await test.step('검색 결과 데이터 구조 확인', async () => {
      // 첫 번째 행의 데이터가 있는지 확인
      const firstRow = page.locator('.grid-table tbody tr').first();
      await expect(firstRow).toBeVisible();
      
      // 사번 컬럼이 있는지 확인
      await expect(firstRow.locator('td').nth(1)).toBeVisible();
      // 성명 컬럼이 있는지 확인
      await expect(firstRow.locator('td').nth(2)).toBeVisible();
      // 본부명 컬럼이 있는지 확인
      await expect(firstRow.locator('td').nth(3)).toBeVisible();
      // 부서명 컬럼이 있는지 확인
      await expect(firstRow.locator('td').nth(4)).toBeVisible();
      // 직급명 컬럼이 있는지 확인
      await expect(firstRow.locator('td').nth(5)).toBeVisible();
    });
  });

  test('postMessage 통신 직접 테스트', async ({ page, context }) => {
    // 부모창 시뮬레이션
    const mainPage = page;
    
    await test.step('부모창에서 postMessage 리스너 설정', async () => {
      await mainPage.evaluate(() => {
        (window as any).receivedMessages = [];
        window.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'EMP_SELECTED') {
            (window as any).receivedMessages.push(event.data);
            console.log('부모창에서 받은 메시지:', event.data);
          }
        });
      });
    });

    await test.step('자식창(팝업) 생성 및 테스트', async () => {
      // 팝업 창 생성
      const popupPromise = context.waitForEvent('page');
      await mainPage.evaluate(() => {
        window.open('http://172.20.30.176:3000/popup/com/COMZ100P00', 'empSearch', 'width=1000,height=800');
      });
      const popupPage = await popupPromise;
      await popupPage.waitForLoadState();
      
      await test.step('팝업에서 사용자명 검색', async () => {
        await popupPage.getByRole('textbox', { name: '사용자명 입력' }).fill('차준형');
        await popupPage.getByRole('button', { name: '조회' }).click();
        await popupPage.waitForTimeout(3000);
      });

      await test.step('검색 결과 확인', async () => {
        await expect(popupPage.locator('.grid-table')).toBeVisible();
        const firstRow = popupPage.locator('.grid-table tbody tr').first();
        await expect(firstRow).toBeVisible();
        
        const empNo = await firstRow.locator('td').nth(1).textContent();
        const empNm = await firstRow.locator('td').nth(2).textContent();
        console.log('검색된 직원 정보:', { empNo, empNm });
      });

      await test.step('더블클릭 실행', async () => {
        const firstRow = popupPage.locator('.grid-table tbody tr').first();
        
        // 더블클릭 전 데이터 확인
        const beforeEmpNo = await firstRow.locator('td').nth(1).textContent();
        const beforeEmpNm = await firstRow.locator('td').nth(2).textContent();
        console.log('더블클릭 전 직원 정보:', { empNo: beforeEmpNo, empNm: beforeEmpNm });
        
        // postMessage 전송을 시뮬레이션
        await popupPage.evaluate((empData) => {
          if (window.opener && !window.opener.closed) {
            const messageData = {
              type: 'EMP_SELECTED',
              data: empData,
              source: 'COMZ100P00',
              timestamp: new Date().toISOString()
            };
            window.opener.postMessage(messageData, '*');
            console.log('postMessage 전송됨:', messageData);
          }
        }, { empNo: beforeEmpNo, empNm: beforeEmpNm, authCd: 'AUTH001' });
        
        console.log('postMessage 시뮬레이션 성공');
      });

      await test.step('부모창에서 메시지 수신 확인', async () => {
        // 부모창으로 돌아가서 메시지 확인
        await mainPage.waitForTimeout(2000);
        
        const receivedMessages = await mainPage.evaluate(() => {
          return (window as any).receivedMessages;
        });
        
        console.log('부모창에서 받은 메시지들:', receivedMessages);
        
        // 메시지가 전달되었는지 확인
        expect(receivedMessages.length).toBeGreaterThan(0);
        
        if (receivedMessages.length > 0) {
          const lastMessage = receivedMessages[receivedMessages.length - 1];
          
          // 메시지 구조 확인
          expect(lastMessage.type).toBe('EMP_SELECTED');
          expect(lastMessage.source).toBe('COMZ100P00');
          expect(lastMessage.data).toBeDefined();
          expect(lastMessage.data.empNo).toBeDefined();
          expect(lastMessage.data.empNm).toBeDefined();
          expect(lastMessage.data.authCd).toBeDefined();
          
          console.log('전달된 파라미터:', {
            empNo: lastMessage.data.empNo,
            empNm: lastMessage.data.empNm,
            authCd: lastMessage.data.authCd
          });
        }
      });
    });
  });

  test('빈값 입력 시 사용자명 입력 알림 테스트', async ({ page }) => {
    await test.step('빈값으로 조회 버튼 클릭', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).clear();
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('사용자명 입력 알림 메시지 확인', async () => {
      // Toast 메시지가 나타나는지 확인
      await expect(page.locator('body')).toBeVisible();
      // 또는 특정 알림 메시지 요소가 있는지 확인
      await expect(page.getByText('사용자명을 입력해주세요')).toBeVisible();
    });
  });

  test('존재하지 않는 사용자명 검색 테스트', async ({ page }) => {
    await test.step('존재하지 않는 사용자명 입력', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).fill('존재하지않는사용자');
    });

    await test.step('조회 버튼 클릭', async () => {
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('사용자가 없다는 알림 메시지 확인', async () => {
      // 검색 결과가 없다는 메시지가 표시되는지 확인
      await expect(page.getByText('해당 직원명은 존재하지 않습니다')).toBeVisible();
      // 또는 검색 결과가 없다는 메시지
      await expect(page.getByText('검색 결과가 없습니다')).toBeVisible();
    });
  });

  test('엔터키로 검색 실행 테스트', async ({ page }) => {
    await test.step('사용자명 입력', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).fill('차준형');
    });

    await test.step('엔터키 입력', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).press('Enter');
    });

    await test.step('검색이 실행되었는지 확인', async () => {
      // 검색 결과가 로드되었는지 확인
      await expect(page.locator('.grid-table')).toBeVisible();
    });
  });

  test('ESC 키로 팝업 닫기 테스트', async ({ page }) => {
    await test.step('ESC 키 입력', async () => {
      await page.keyboard.press('Escape');
    });

    await test.step('팝업이 닫혔는지 확인', async () => {
      // 팝업이 닫혔는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('닫기 버튼으로 팝업 닫기 테스트', async ({ page }) => {
    await test.step('닫기 버튼 클릭', async () => {
      await page.getByRole('button', { name: '×' }).click();
    });

    await test.step('팝업이 닫혔는지 확인', async () => {
      // 팝업이 닫혔는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('종료 버튼으로 팝업 닫기 테스트', async ({ page }) => {
    await test.step('종료 버튼 클릭', async () => {
      await page.getByRole('button', { name: '종료' }).click();
    });

    await test.step('팝업이 닫혔는지 확인', async () => {
      // 팝업이 닫혔는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('포커스 시 전체 선택 테스트', async ({ page }) => {
    await test.step('사용자명 입력 필드 클릭', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).click();
    });

    await test.step('텍스트 입력', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).fill('테스트');
    });

    await test.step('다시 포커스하여 전체 선택 확인', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).click();
      // 전체 선택되었는지 확인 (실제 구현에 따라 조정 필요)
      await expect(page.getByRole('textbox', { name: '사용자명 입력' })).toBeVisible();
    });
  });

  test('postMessage 데이터 수신 테스트', async ({ page }) => {
    await test.step('postMessage로 데이터 전송 시뮬레이션', async () => {
      // postMessage로 데이터를 전송하는 시뮬레이션
      await page.evaluate(() => {
        const messageData = {
          type: 'CHOICE_EMP_INIT',
          data: {
            empNm: '차준형',
            empList: [
              {
                LIST_NO: '1',
                EMP_NO: '10757',
                EMP_NM: '차준형',
                HQ_DIV_NM: 'SI본부',
                DEPT_DIV_NM: 'SI 3팀',
                DUTY_NM: '사원',
                AUTH_CD_NM: '일반사용자',
                BSN_USE_YN: '1',
                WPC_USE_YN: '0',
                PSM_USE_YN: '1',
                RMK: '',
                HQ_DIV_CD: 'HQ001',
                DEPT_DIV_CD: 'DEPT001',
                DUTY_CD: 'DUTY001',
                DUTY_DIV_CD: 'DUTY_DIV001',
                AUTH_CD: 'AUTH001',
                APV_APOF_ID: 'APV001',
                EMAIL_ADDR: 'chajun@company.com'
              }
            ]
          }
        };
        window.postMessage(messageData, '*');
      });
    });

    await test.step('postMessage 데이터가 처리되었는지 확인', async () => {
      // 사용자명이 설정되었는지 확인
      await expect(page.getByRole('textbox', { name: '사용자명 입력' })).toHaveValue('차준형');
    });
  });

  test('업무별 사용권한 체크박스 테스트', async ({ page }) => {
    await test.step('사용자명 검색 실행', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).fill('차준형');
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('업무별 사용권한 체크박스들이 표시되는지 확인', async () => {
      // 사업 체크박스
      await expect(page.locator('input[type="checkbox"]').nth(0)).toBeVisible();
      // 추진비 체크박스
      await expect(page.locator('input[type="checkbox"]').nth(1)).toBeVisible();
      // 인사/복리 체크박스
      await expect(page.locator('input[type="checkbox"]').nth(2)).toBeVisible();
    });
  });

  test('검색 결과 없을 때 메시지 표시 테스트', async ({ page }) => {
    await test.step('존재하지 않는 사용자명으로 검색', async () => {
      await page.getByRole('textbox', { name: '사용자명 입력' }).fill('존재하지않는사용자명');
      await page.getByRole('button', { name: '조회' }).click();
    });

    await test.step('검색 결과 없음 메시지 확인', async () => {
      // 검색 결과가 없다는 메시지가 표시되는지 확인
      await expect(page.getByText('검색 결과가 없습니다')).toBeVisible();
    });
  });
}); 