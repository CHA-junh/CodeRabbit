import React from "react";
import { render, screen } from "../../test/test-utils";
import PSM0060M00 from "./PSM0060M00";

describe("PSM0060M00 - 개발환경 선택 팝업", () => {
  test("컴포넌트가 정상적으로 렌더링된다", () => {
    render(<PSM0060M00 onConfirm={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getByText("개발환경/DBMS/언어 내용 입력")).toBeInTheDocument();
  });
}); 