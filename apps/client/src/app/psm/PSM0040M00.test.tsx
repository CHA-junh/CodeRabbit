import React from "react";
import { render, screen } from "../../test/test-utils";
import PSM0040M00 from "./PSM0040M00";

describe("PSM0040M00 - 개발프로필 관리 메인 화면", () => {
  test("컴포넌트가 정상적으로 렌더링된다", () => {
    render(<PSM0040M00 empNo="EMP001" empNm="홍길동" />);
    expect(screen.getByText("개발 프로필 내역")).toBeInTheDocument();
  });
}); 