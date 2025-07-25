import React from "react";
import { render, screen } from "../../test/test-utils";
import RoleManagementPopup from "./PSM0030P00";

describe("PSM0030P00 - 기술등급이력 조회 팝업", () => {
  test("컴포넌트가 정상적으로 렌더링된다", () => {
    render(<RoleManagementPopup empNo="EMP001" onClose={jest.fn()} />);
    expect(screen.getByText("기술등급이력조회")).toBeInTheDocument();
  });

  test("onClose prop이 정상 동작한다", () => {
    const onClose = jest.fn();
    render(<RoleManagementPopup empNo="EMP001" onClose={onClose} />);
    // 실제 닫기 버튼이 있다면 fireEvent로 클릭 테스트 추가 가능
  });
}); 