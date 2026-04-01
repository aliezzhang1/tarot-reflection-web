export type HighRiskType =
  | "medical"
  | "investment"
  | "legal"
  | "mental-health-crisis";

export type HighRiskAssessment = {
  shouldBlock: boolean;
  riskTypes: readonly HighRiskType[];
  message: string;
};

type HighRiskRule = {
  type: HighRiskType;
  label: string;
  keywords: readonly string[];
  message: string;
};

export const highRiskRuleRegistry: readonly HighRiskRule[] = [
  {
    type: "medical",
    label: "医疗与用药",
    keywords: [
      "看病",
      "诊断",
      "确诊",
      "药",
      "用药",
      "剂量",
      "停药",
      "处方",
      "副作用",
      "治疗",
      "手术",
      "症状",
      "病情",
    ],
    message:
      "这类问题涉及身体状况、诊断或用药判断，更适合咨询医生、药师或正规医疗机构。当前工具不继续进入抽牌与解读。",
  },
  {
    type: "investment",
    label: "投资与资产买卖",
    keywords: [
      "投资",
      "股票",
      "基金",
      "买入",
      "卖出",
      "加仓",
      "减仓",
      "抄底",
      "止损",
      "资产配置",
      "币",
      "比特币",
      "收益率",
      "期货",
      "炒股",
    ],
    message:
      "这类问题涉及投资、买卖资产或仓位判断，更适合结合独立研究与持牌专业意见。当前工具不继续进入抽牌与解读。",
  },
  {
    type: "legal",
    label: "法律纠纷与诉讼",
    keywords: [
      "法律",
      "起诉",
      "诉讼",
      "打官司",
      "律师",
      "仲裁",
      "赔偿",
      "纠纷",
      "合同",
      "离婚官司",
      "判决",
      "违法",
      "刑事",
      "民事",
    ],
    message:
      "这类问题涉及法律责任、诉讼或合同纠纷，更适合咨询律师或当地法律援助渠道。当前工具不继续进入抽牌与解读。",
  },
  {
    type: "mental-health-crisis",
    label: "心理危机与自伤风险",
    keywords: [
      "抑郁",
      "自伤",
      "自残",
      "自杀",
      "想死",
      "不想活",
      "结束生命",
      "割腕",
      "轻生",
      "上吊",
      "成瘾",
      "毒瘾",
      "酒瘾",
      "药物成瘾",
      "心理危机",
    ],
    message:
      "这类问题涉及心理危机、自伤、自杀或成瘾风险，已经超出塔罗灵感工具的适用范围。请优先联系身边可信任的人，并尽快寻求专业支持。当前工具不继续进入抽牌与解读。",
  },
] as const;

export function assessHighRiskQuestion(question: string): HighRiskAssessment {
  const normalizedQuestion = normalizeQuestion(question);

  if (!normalizedQuestion) {
    return {
      shouldBlock: false,
      riskTypes: [],
      message: "",
    };
  }

  const matchedRules = highRiskRuleRegistry.filter((rule) =>
    rule.keywords.some((keyword) => normalizedQuestion.includes(normalizeQuestion(keyword))),
  );

  if (!matchedRules.length) {
    return {
      shouldBlock: false,
      riskTypes: [],
      message: "",
    };
  }

  const uniqueTypes = Array.from(new Set(matchedRules.map((rule) => rule.type)));

  if (matchedRules.length === 1) {
    return {
      shouldBlock: true,
      riskTypes: uniqueTypes,
      message: matchedRules[0].message,
    };
  }

  const labels = matchedRules.map((rule) => rule.label).join("、");

  return {
    shouldBlock: true,
    riskTypes: uniqueTypes,
    message: `你的问题同时触及${labels}，更适合交给专业支持来处理。当前工具不继续进入抽牌与解读。`,
  };
}

export function getHighRiskTypeLabel(type: HighRiskType) {
  return highRiskRuleRegistry.find((rule) => rule.type === type)?.label ?? type;
}

function normalizeQuestion(text: string) {
  return text.toLowerCase().replace(/\s+/g, "").trim();
}