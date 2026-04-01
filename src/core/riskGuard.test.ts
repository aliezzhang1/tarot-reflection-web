import { describe, expect, it } from "vitest";
import { assessHighRiskQuestion } from "./riskGuard";

describe("assessHighRiskQuestion", () => {
  it("does not block neutral reflection questions", () => {
    const result = assessHighRiskQuestion("我该怎样调整最近的学习节奏？");

    expect(result.shouldBlock).toBe(false);
    expect(result.riskTypes).toEqual([]);
    expect(result.message).toBe("");
  });

  it("blocks medical and medication questions", () => {
    const result = assessHighRiskQuestion("我是不是该停药，换一种药吃？");

    expect(result.shouldBlock).toBe(true);
    expect(result.riskTypes).toContain("medical");
    expect(result.message).toContain("医生");
  });

  it("blocks investment and asset trading questions", () => {
    const result = assessHighRiskQuestion("我现在该不该买入股票并加仓？");

    expect(result.shouldBlock).toBe(true);
    expect(result.riskTypes).toContain("investment");
  });

  it("blocks legal dispute questions", () => {
    const result = assessHighRiskQuestion("这场合同纠纷要不要起诉对方？");

    expect(result.shouldBlock).toBe(true);
    expect(result.riskTypes).toContain("legal");
  });

  it("blocks crisis and self-harm questions", () => {
    const result = assessHighRiskQuestion("我最近总在想自杀，是不是就这样结束生命比较好？");

    expect(result.shouldBlock).toBe(true);
    expect(result.riskTypes).toContain("mental-health-crisis");
    expect(result.message).toContain("专业支持");
  });

  it("returns multiple risk types when more than one category is matched", () => {
    const result = assessHighRiskQuestion("我抑郁得很厉害，还想靠炒股翻本，应该继续加仓吗？");

    expect(result.shouldBlock).toBe(true);
    expect(result.riskTypes).toContain("mental-health-crisis");
    expect(result.riskTypes).toContain("investment");
  });
});