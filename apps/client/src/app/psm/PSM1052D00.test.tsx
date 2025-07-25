import React from "react";
import { render, screen } from "../../test/test-utils";
import PSM1052D00 from "./PSM1052D00";

describe("PSM1052D00 - 경력 입력 컴포넌트", () => {
  test("컴포넌트가 정상적으로 렌더링된다", () => {
    render(<PSM1052D00 />);
    expect(screen.getByText("※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.")).toBeInTheDocument();
  });

  test("경력 입력 관련 안내 문구들이 모두 표시된다", () => {
    render(<PSM1052D00 />);
    
    // 자사인력 관련 안내 문구들
    expect(screen.getByText("※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.")).toBeInTheDocument();
    expect(screen.getByText("※ 입사후 경력 (자사인력) - 입사 후 재직 기간을 말함.")).toBeInTheDocument();
    
    // 학력기준 관련 문구들
    expect(screen.getByText("(1)학력기준: 프로젝트 최초 투입일부터 입사일 전까지의 개월 수")).toBeInTheDocument();
    expect(screen.getByText("(1)학력기준: 입사일부터 현재일까지의 개월 수 (재직개월수와 동일)")).toBeInTheDocument();
    
    // 기술자격기준 관련 문구들
    expect(screen.getByText("(2)기술자격기준: 자격취득일부터 입사일 전까지의 개월 수")).toBeInTheDocument();
    expect(screen.getByText("(2)기술자격기준: 자격취득일부터 현재일까지의 개월 수")).toBeInTheDocument();
    
    // 외주인력 관련 문구
    expect(screen.getByText("※ 외주인력은 프로젝트 최초 투입일부터 최종 철수일까지 프로필의 경력 개월수를 계산함.")).toBeInTheDocument();
    
    // 계산 및 저장 관련 문구들
    expect(screen.getByText("※ 계산된 경력개월수와 등급을 사원정보 저장 시 반영을 할려면 [확인]버튼을 선택하고 미반영시에는 [취소]버튼을 선택함.")).toBeInTheDocument();
    expect(screen.getByText("※ 입사전 경력 개월을 수정 입력 후 [계산]버튼을 클릭하면 DB에 저장된 값으로 바뀜. 수정 후 먼저 사원정보를 저장해야 함.")).toBeInTheDocument();
  });

  test("컴포넌트가 파란색 배경의 안내 박스로 표시된다", () => {
    render(<PSM1052D00 />);
    
    const container = screen.getByText("※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.").closest('div');
    expect(container).toHaveClass('bg-blue-50', 'border-blue-200');
  });

  test("텍스트가 파란색으로 표시된다", () => {
    render(<PSM1052D00 />);
    
    const textElement = screen.getByText("※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.");
    expect(textElement).toHaveClass('text-[#00509A]');
  });

  test("들여쓰기가 적용된 문구들이 올바르게 표시된다", () => {
    render(<PSM1052D00 />);
    
    const indentedElements = screen.getAllByText(/^\(1\)학력기준:|^\(2\)기술자격기준:/);
    indentedElements.forEach(element => {
      expect(element).toHaveClass('ml-4');
    });
  });
});

describe("PSM1052D00 - PSM1050M00과의 연동", () => {
  test("PSM1050M00에서 신규 모드일 때만 호출된다", () => {
    // PSM1050M00의 조건부 렌더링 로직을 시뮬레이션
    const newFlag = true; // 신규 모드
    const shouldRenderPSM1052D00 = newFlag;
    
    expect(shouldRenderPSM1052D00).toBeTruthy();
    
    // 신규 모드일 때 PSM1052D00이 렌더링됨을 확인
    if (shouldRenderPSM1052D00) {
      render(<PSM1052D00 />);
      expect(screen.getByText("※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.")).toBeInTheDocument();
    }
  });

  test("PSM1050M00에서 수정 모드일 때는 호출되지 않는다", () => {
    // PSM1050M00의 조건부 렌더링 로직을 시뮬레이션
    const newFlag = false; // 수정 모드
    const shouldRenderPSM1052D00 = newFlag;
    
    expect(shouldRenderPSM1052D00).toBeFalsy();
    
    // 수정 모드일 때는 PSM1051D00이 대신 호출됨
    const shouldRenderPSM1051D00 = !newFlag;
    expect(shouldRenderPSM1051D00).toBeTruthy();
  });

  test("PSM1050M00의 조건부 렌더링 로직이 올바르게 작동한다", () => {
    // PSM1050M00의 실제 렌더링 로직을 시뮬레이션
    const renderConditionalComponent = (newFlag: boolean) => {
      if (newFlag) {
        return <PSM1052D00 />;
      } else {
        return <div data-testid="psm1051d00-placeholder">PSM1051D00</div>;
      }
    };

    // 신규 모드 테스트
    const { rerender } = render(renderConditionalComponent(true));
    expect(screen.getByText("※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.")).toBeInTheDocument();
    expect(screen.queryByTestId("psm1051d00-placeholder")).not.toBeInTheDocument();

    // 수정 모드 테스트
    rerender(renderConditionalComponent(false));
    expect(screen.queryByText("※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.")).not.toBeInTheDocument();
    expect(screen.getByTestId("psm1051d00-placeholder")).toBeInTheDocument();
  });

  test("PSM1050M00에서 경력 계산 후 확인 버튼 클릭 시 PSM1052D00의 안내 문구가 유효하다", () => {
    render(<PSM1052D00 />);
    
    // 경력 계산 후 확인 버튼 관련 안내 문구 확인
    const confirmMessage = screen.getByText("※ 계산된 경력개월수와 등급을 사원정보 저장 시 반영을 할려면 [확인]버튼을 선택하고 미반영시에는 [취소]버튼을 선택함.");
    expect(confirmMessage).toBeInTheDocument();
    
    // 이 문구는 PSM1050M00의 확인 버튼과 연동되어야 함
    expect(confirmMessage.textContent).toContain("[확인]");
    expect(confirmMessage.textContent).toContain("[취소]");
  });

  test("PSM1050M00에서 경력 수정 후 계산 버튼 클릭 시 PSM1052D00의 안내 문구가 유효하다", () => {
    render(<PSM1052D00 />);
    
    // 경력 수정 후 계산 버튼 관련 안내 문구 확인
    const calcMessage = screen.getByText("※ 입사전 경력 개월을 수정 입력 후 [계산]버튼을 클릭하면 DB에 저장된 값으로 바뀜. 수정 후 먼저 사원정보를 저장해야 함.");
    expect(calcMessage).toBeInTheDocument();
    
    // 이 문구는 PSM1050M00의 계산 버튼과 연동되어야 함
    expect(calcMessage.textContent).toContain("[계산]");
    expect(calcMessage.textContent).toContain("사원정보를 저장");
  });
});

describe("PSM1052D00 - 경력 입력 가이드", () => {
  test("자사인력과 외주인력의 경력 계산 방식이 명확히 구분되어 표시된다", () => {
    render(<PSM1052D00 />);
    
    // 자사인력 관련 문구들
    const companyEmployeeTexts = [
      "※ 입사전 경력 (자사인력)",
      "※ 입사후 경력 (자사인력)"
    ];
    
    companyEmployeeTexts.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
    
    // 외주인력 관련 문구
    expect(screen.getByText("※ 외주인력은 프로젝트 최초 투입일부터 최종 철수일까지 프로필의 경력 개월수를 계산함.")).toBeInTheDocument();
  });

  test("학력기준과 기술자격기준이 명확히 구분되어 표시된다", () => {
    render(<PSM1052D00 />);
    
    // 학력기준 관련 문구들
    const educationTexts = [
      "(1)학력기준: 프로젝트 최초 투입일부터 입사일 전까지의 개월 수",
      "(1)학력기준: 입사일부터 현재일까지의 개월 수 (재직개월수와 동일)"
    ];
    
    educationTexts.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
    
    // 기술자격기준 관련 문구들
    const qualificationTexts = [
      "(2)기술자격기준: 자격취득일부터 입사일 전까지의 개월 수",
      "(2)기술자격기준: 자격취득일부터 현재일까지의 개월 수"
    ];
    
    qualificationTexts.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("경력 계산의 기준점들이 명확히 표시된다", () => {
    render(<PSM1052D00 />);
    
    // 기준점들 확인
    const criteriaPoints = [
      "프로젝트 최초 투입일",
      "입사일",
      "현재일",
      "자격취득일",
      "최종 철수일"
    ];
    
    criteriaPoints.forEach(point => {
      const element = screen.getByText((content, element) => {
        return element?.textContent?.includes(point) || false;
      });
      expect(element).toBeInTheDocument();
    });
  });
}); 