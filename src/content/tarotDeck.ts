import { getTarotCardArtwork, majorArcanaArtworkMap } from "./tarotCardArtwork";

export type TarotArcana = "major" | "minor";

export type TarotSuit =
  | "major-arcana"
  | "wands"
  | "cups"
  | "swords"
  | "pentacles";

export type TarotCardDefinition = {
  id: string;
  arcana: TarotArcana;
  suit: TarotSuit;
  rank: string;
  nameCn: string;
  nameEn: string;
  number: number;
  uprightKeywords: readonly string[];
  reversedKeywords: readonly string[];
  uprightMeaning: string;
  reversedMeaning: string;
  reflectionQuestions: readonly string[];
  gentleActions: readonly string[];
  imageSrc?: string;
  imageAlt?: string;
};

type MajorArcanaDraft = Omit<
  TarotCardDefinition,
  "arcana" | "suit" | "imageSrc" | "imageAlt"
>;

function createMajorArcanaCard(card: MajorArcanaDraft): TarotCardDefinition {
  return {
    ...card,
    arcana: "major",
    suit: "major-arcana",
    ...(getTarotCardArtwork(card.id) ?? {}),
  };
}

export const tarotCardFieldGuide = {
  id: "用于前端路由、记录存储和分享卡片生成的稳定唯一标识。",
  arcana: "区分大阿尔卡纳与小阿尔卡纳，方便未来扩展到 78 张完整牌库。",
  suit: "牌所属套系。大阿尔卡纳统一使用 major-arcana，小阿尔卡纳可扩展为四元素花色。",
  rank: "牌面序位文本，例如 0、I、II、Ace、Page。",
  nameCn: "中文牌名。",
  nameEn: "英文牌名。",
  number: "数值编号。大阿尔卡纳通常是 0 到 21。",
  uprightKeywords: "正位关键词数组，适合结果页和分享卡片展示。",
  reversedKeywords: "逆位关键词数组，适合结果页和分享卡片展示。",
  uprightMeaning: "正位的简短牌义说明。",
  reversedMeaning: "逆位的简短牌义说明。",
  reflectionQuestions: "引导用户停下来整理思绪的反思问题。",
  gentleActions: "低风险、温和、可执行的小步骤建议。",
  imageSrc: "本地牌面资源路径，适合结果页、历史页和分享卡片使用。",
  imageAlt: "牌面图片的替代文本。",
} as const;

export const majorArcanaDeck: readonly TarotCardDefinition[] = [
  createMajorArcanaCard({
    id: "major-fool",
    rank: "0",
    nameCn: "愚者",
    nameEn: "The Fool",
    number: 0,
    uprightKeywords: ["启程", "好奇", "信任", "轻盈"],
    reversedKeywords: ["莽撞", "迟疑", "分心", "边界模糊"],
    uprightMeaning:
      "愚者更像一扇刚打开的门，提醒你可以用轻一点的姿态靠近新的体验，不必一开始就把终点想得太重。",
    reversedMeaning:
      "逆位的愚者像是在门口来回踱步，提醒你先看清脚下的落点，再决定要不要迈出下一步。",
    reflectionQuestions: [
      "眼下让我心里发亮的那个新方向，究竟是在邀请我开始，还是在提醒我别再停留太久？",
      "如果暂时放下必须证明自己的压力，我最想先尝试的那一步会是什么？",
    ],
    gentleActions: [
      "把想开始的事写成一个 20 分钟内就能完成的小实验，今天只做第一步。",
      "给自己留一段不设结果的探索时间，只观察什么最能带来轻松感。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-magician",
    rank: "I",
    nameCn: "魔术师",
    nameEn: "The Magician",
    number: 1,
    uprightKeywords: ["行动", "聚焦", "调动资源", "显化"],
    reversedKeywords: ["分散", "用力过猛", "拖延", "表达失真"],
    uprightMeaning:
      "魔术师更像一次清晰的调度，提醒你手头已有不少可用资源，关键在于把注意力重新收回来。",
    reversedMeaning:
      "逆位的魔术师更像一桌摆得太满的工具，提醒你别急着全都用上，先找出真正重要的那一项。",
    reflectionQuestions: [
      "我已经拥有却还没有认真调用的能力、经验或帮助，是什么？",
      "如果这件事只能推进一个最关键的环节，我会先抓住哪一点？",
    ],
    gentleActions: [
      "列出今天能调动的三项资源，只选最顺手的一项开始。",
      "把目标缩成一句清楚的话，避免让自己同时推进太多方向。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-high-priestess",
    rank: "II",
    nameCn: "女祭司",
    nameEn: "The High Priestess",
    number: 2,
    uprightKeywords: ["直觉", "静观", "内在感知", "留白"],
    reversedKeywords: ["压抑感受", "信息过载", "回避倾听", "模糊"],
    uprightMeaning:
      "女祭司更像一处安静的内室，提醒你先把外界的声音放低一些，再去听自己真实的感受。",
    reversedMeaning:
      "逆位的女祭司像被打断的静默，提醒你也许不是没有答案，而是还没有留出听见答案的空间。",
    reflectionQuestions: [
      "当我暂时不向外找解释时，身体最先给出的感受是什么？",
      "我现在最想保护、暂时不急着对外说明的部分，是什么？",
    ],
    gentleActions: [
      "给自己留 10 分钟安静时间，不输入新信息，只记录当下的感受。",
      "把脑中最吵的三个声音写下来，再圈出真正像自己的一句。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-empress",
    rank: "III",
    nameCn: "皇后",
    nameEn: "The Empress",
    number: 3,
    uprightKeywords: ["丰盛", "照料", "创造", "感受力"],
    reversedKeywords: ["过度付出", "匮乏感", "忽略自己", "停滞"],
    uprightMeaning:
      "皇后更像一片被好好照料的花园，提醒你去关注滋养、舒展和让事情自然生长的条件。",
    reversedMeaning:
      "逆位的皇后像土壤缺了水分，提醒你也许已经给出去很多，但还没有把照料留给自己。",
    reflectionQuestions: [
      "我最近最需要被照顾的，不是任务，而是哪一部分感受或身体状态？",
      "什么样的环境会让我更容易恢复创造力和柔软感？",
    ],
    gentleActions: [
      "给今天的自己安排一个真正有恢复感的小照料动作，例如好好吃一餐或整理角落。",
      "如果有一个想推进的计划，先补充它所需要的养分，而不是立刻催促结果。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-emperor",
    rank: "IV",
    nameCn: "皇帝",
    nameEn: "The Emperor",
    number: 4,
    uprightKeywords: ["结构", "边界", "稳定", "掌舵"],
    reversedKeywords: ["僵硬", "控制过度", "压迫感", "失序"],
    uprightMeaning:
      "皇帝更像一座稳固的框架，提醒你为当下的事情建立清晰边界、顺序和可以依靠的支点。",
    reversedMeaning:
      "逆位的皇帝像绷得太紧的铠甲，提醒你规则或控制感也许已经开始压住呼吸和弹性。",
    reflectionQuestions: [
      "我现在最需要建立清楚边界的，是时间、关系还是责任分配？",
      "什么规则是在保护我，什么规则又已经变成负担？",
    ],
    gentleActions: [
      "把这周最重要的三件事排出先后，先守住第一件。",
      "针对一件让你混乱的事，补上一条简单明确的边界说明。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-hierophant",
    rank: "V",
    nameCn: "教皇",
    nameEn: "The Hierophant",
    number: 5,
    uprightKeywords: ["传统", "指引", "学习", "传承"],
    reversedKeywords: ["教条", "盲从", "疏离", "规则失效"],
    uprightMeaning:
      "教皇更像一位耐心的引导者，提醒你借用成熟的方法、经验或可靠的人来帮自己看清下一步。",
    reversedMeaning:
      "逆位的教皇像一本不再贴合现实的旧手册，提醒你不是所有规则都还适合现在的处境。",
    reflectionQuestions: [
      "我现在最需要借鉴的，是谁的经验、哪套方法，或哪一种稳定的传统？",
      "哪些外界标准我已经沿用很久，但其实并不真正贴合现在的自己？",
    ],
    gentleActions: [
      "找一个你信任的人或资料来源，只向它请教一个具体问题。",
      "把一条习惯性的“应该”写下来，看看它是否仍然对你有帮助。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-lovers",
    rank: "VI",
    nameCn: "恋人",
    nameEn: "The Lovers",
    number: 6,
    uprightKeywords: ["连接", "选择", "真诚", "靠近"],
    reversedKeywords: ["摇摆", "疏离", "价值冲突", "失衡"],
    uprightMeaning:
      "恋人更像一次对齐，提醒你去看关系、选择和价值观之间是否正在慢慢靠近彼此。",
    reversedMeaning:
      "逆位的恋人像两条没有对齐的线，提醒你先厘清自己的心意，再谈真正的靠近或决定。",
    reflectionQuestions: [
      "我现在面对的是想靠近一个人，还是想更靠近自己的真实选择？",
      "如果这件事需要忠于一种核心价值，那会是哪一种？",
    ],
    gentleActions: [
      "把你最在意的两种需求写出来，看看它们能否同时被照顾。",
      "如果涉及关系沟通，先说清自己的感受，再谈结论。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-chariot",
    rank: "VII",
    nameCn: "战车",
    nameEn: "The Chariot",
    number: 7,
    uprightKeywords: ["推进", "意志", "掌控方向", "胜任"],
    reversedKeywords: ["失控", "分散拉扯", "急冲", "卡住"],
    uprightMeaning:
      "战车更像一股被驾驭好的前进力，提醒你把分散的拉扯收束成一个清楚的方向，再稳稳推进。",
    reversedMeaning:
      "逆位的战车像缰绳松开的瞬间，提醒你也许不是不努力，而是力量还没有朝同一个方向用。",
    reflectionQuestions: [
      "我想推进的事情里，最消耗我的拉扯来自哪里？",
      "如果只能选一个主方向向前，我最愿意把力气投向哪一边？",
    ],
    gentleActions: [
      "把眼前并行的任务删减成一个主线和一个辅助线。",
      "为今天的推进设定一个清楚终点，到点就停，避免过度冲刺。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-strength",
    rank: "VIII",
    nameCn: "力量",
    nameEn: "Strength",
    number: 8,
    uprightKeywords: ["温柔的坚定", "耐心", "稳住自己", "勇气"],
    reversedKeywords: ["心气不足", "逞强", "压抑", "焦躁"],
    uprightMeaning:
      "力量更像一只被温柔安抚下来的猛兽，提醒你真正有用的力量常常来自稳定而不过度用力。",
    reversedMeaning:
      "逆位的力量像咬紧牙关的坚持，提醒你也许已经太久没有承认自己的疲惫和脆弱。",
    reflectionQuestions: [
      "这件事里我最需要的，是更大声地用力，还是更稳定地陪伴自己？",
      "什么会让我恢复那种不慌不忙的勇气？",
    ],
    gentleActions: [
      "在一个让你紧绷的情境里，先放慢三次呼吸，再决定怎么回应。",
      "把“必须马上解决”改成“今天先稳住一点点”。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-hermit",
    rank: "IX",
    nameCn: "隐者",
    nameEn: "The Hermit",
    number: 9,
    uprightKeywords: ["独处", "审视", "沉淀", "寻找光源"],
    reversedKeywords: ["封闭", "过度抽离", "停留太久", "迷失"],
    uprightMeaning:
      "隐者更像一盏只照亮脚边的灯，提醒你不必一下看很远，只要先照清眼前的这一小段路。",
    reversedMeaning:
      "逆位的隐者像关得太久的门，提醒你沉淀很重要，但偶尔也需要重新和外界交换空气。",
    reflectionQuestions: [
      "我现在真正需要的是安静独处，还是一个可信任的陪伴者？",
      "什么问题值得我慢一点想，而不是马上给出答案？",
    ],
    gentleActions: [
      "留一段不被打扰的时间，只做梳理，不急着输出。",
      "如果已经独自扛太久，试着向一个可靠的人说出你的现状。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-wheel-of-fortune",
    rank: "X",
    nameCn: "命运之轮",
    nameEn: "Wheel of Fortune",
    number: 10,
    uprightKeywords: ["转机", "周期", "变化", "顺势"],
    reversedKeywords: ["反复", "失去节奏", "被动", "旧模式循环"],
    uprightMeaning:
      "命运之轮更像一个正在转动的周期，提醒你现在适合看清趋势，而不只是盯住某个瞬间。",
    reversedMeaning:
      "逆位的命运之轮像卡住的齿轮，提醒你也许还在同一模式里打转，先看懂循环本身。",
    reflectionQuestions: [
      "最近反复出现的主题，究竟在提示我什么还没被看见？",
      "如果顺着大一点的节奏来看，这件事正处在哪个阶段？",
    ],
    gentleActions: [
      "记录最近一周重复出现的情绪或事件，找找其中的节奏。",
      "遇到变动时先问自己：我能顺势调整的部分是什么？",
    ],
  }),
  createMajorArcanaCard({
    id: "major-justice",
    rank: "XI",
    nameCn: "正义",
    nameEn: "Justice",
    number: 11,
    uprightKeywords: ["平衡", "看清事实", "责任", "判断"],
    reversedKeywords: ["偏差", "逃避责任", "失衡", "自我辩护"],
    uprightMeaning:
      "正义更像一把重新校准的秤，提醒你把感受和事实都摆上来，再做更稳妥的判断。",
    reversedMeaning:
      "逆位的正义像被手指按住的一侧天平，提醒你也许有某部分事实还没有被诚实地看见。",
    reflectionQuestions: [
      "如果把情绪和事实分开看，眼前的局面会出现什么不同？",
      "这件事里我真正该承担的部分，和不必继续背着的部分，分别是什么？",
    ],
    gentleActions: [
      "把你知道的事实列成清单，再单独写下你的感受。",
      "遇到难判断的事，先延后一点点，给自己一个更平衡的视角。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-hanged-man",
    rank: "XII",
    nameCn: "倒吊人",
    nameEn: "The Hanged Man",
    number: 12,
    uprightKeywords: ["暂停", "换角度", "松手", "等待成熟"],
    reversedKeywords: ["僵持", "拖住不放", "不甘心", "停而不歇"],
    uprightMeaning:
      "倒吊人更像一次主动的停顿，提醒你现在未必适合硬推，而适合换个角度重新理解眼前的事。",
    reversedMeaning:
      "逆位的倒吊人像被困在原处的等待，提醒你分辨这是有价值的暂停，还是已经变成拖延。",
    reflectionQuestions: [
      "如果我暂时不急着解决，眼前这件事会呈现出什么新的样子？",
      "我现在抓着不放的，是结果，还是某种不甘心？",
    ],
    gentleActions: [
      "给这个问题设一个短暂停顿，例如今晚不再反复推演它。",
      "尝试从另一个人的视角，重写一次你对这件事的理解。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-death",
    rank: "XIII",
    nameCn: "死神",
    nameEn: "Death",
    number: 13,
    uprightKeywords: ["结束", "脱落", "更新", "转化"],
    reversedKeywords: ["抗拒告别", "停在旧处", "迟迟不放", "过渡期拉长"],
    uprightMeaning:
      "死神更像一扇关闭后的新门，提醒你某个阶段也许正在完成，它的离开本身就在腾出空间。",
    reversedMeaning:
      "逆位的死神像迟迟不愿松开的手，提醒你真正辛苦的也许不是变化，而是对旧状态的不舍。",
    reflectionQuestions: [
      "现在最需要结束或放下的，究竟是一件事、一个角色，还是一种旧习惯？",
      "如果允许某段阶段自然结束，我会为新的什么腾出位置？",
    ],
    gentleActions: [
      "做一个象征性的收尾动作，例如删除、整理、归档或告别。",
      "允许自己为失去而难过，同时不急着否认变化已经发生。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-temperance",
    rank: "XIV",
    nameCn: "节制",
    nameEn: "Temperance",
    number: 14,
    uprightKeywords: ["调和", "节奏", "修复", "平稳过渡"],
    reversedKeywords: ["失衡", "极端化", "消耗", "节奏被打乱"],
    uprightMeaning:
      "节制更像一条缓慢流动的水线，提醒你先把节奏调回稳态，再让不同部分慢慢重新协作。",
    reversedMeaning:
      "逆位的节制像失去比例的调配，提醒你此刻可能不是做更多，而是减少极端和拉扯。",
    reflectionQuestions: [
      "我生活里的哪两个部分，最近最需要被重新调和？",
      "什么会帮助我从过快或过满的状态里回到适合自己的节奏？",
    ],
    gentleActions: [
      "今天故意放慢一件事的节奏，观察身体和情绪有什么变化。",
      "把一个过量的安排减一点点，给恢复留出空间。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-devil",
    rank: "XV",
    nameCn: "恶魔",
    nameEn: "The Devil",
    number: 15,
    uprightKeywords: ["牵制", "欲望", "依赖", "看见束缚"],
    reversedKeywords: ["松绑", "看穿幻象", "抽离", "重新选择"],
    uprightMeaning:
      "恶魔更像一面把欲望和牵制放大的镜子，提醒你看清自己正在被什么吸住、困住或反复消耗。",
    reversedMeaning:
      "逆位的恶魔像链条出现了松动，提醒你也许已经开始看见出口，只是还需要一点勇气挪开视线。",
    reflectionQuestions: [
      "我现在最难放开的，是某个习惯、关系，还是一种短暂但上瘾的安慰？",
      "如果我不再自动追随那个惯性，会失去什么，又会腾出什么？",
    ],
    gentleActions: [
      "把最近最消耗你的一个触发点记录下来，看看它总在什么情境里出现。",
      "试一次把惯常的自动反应延后十分钟，给自己增加一点选择感。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-tower",
    rank: "XVI",
    nameCn: "高塔",
    nameEn: "The Tower",
    number: 16,
    uprightKeywords: ["震动", "拆除旧结构", "真相显形", "突变"],
    reversedKeywords: ["余震", "抗拒改变", "延后爆发", "紧绷"],
    uprightMeaning:
      "高塔更像一道突然打下来的光，提醒你有些旧结构正在松动，虽然不舒服，却也可能带来真正的清醒。",
    reversedMeaning:
      "逆位的高塔像还没完全散去的余震，提醒你变化也许已开始，只是还没有完全落地。",
    reflectionQuestions: [
      "最近让我措手不及的那一下，究竟打碎了什么旧假设？",
      "如果不再强撑原来的样子，我需要先保护好哪一部分自己？",
    ],
    gentleActions: [
      "先处理最现实的一件小事，帮助自己从震荡里找回落点。",
      "把“全盘崩塌”的想法拆开，看看真正需要调整的到底是哪一部分。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-star",
    rank: "XVII",
    nameCn: "星星",
    nameEn: "The Star",
    number: 17,
    uprightKeywords: ["希望", "修复", "坦诚", "微光"],
    reversedKeywords: ["心灰意冷", "自我怀疑", "恢复缓慢", "期待落空"],
    uprightMeaning:
      "星星更像夜里一盏安静的远光，提醒你即使节奏慢一点，修复和希望仍然在发生。",
    reversedMeaning:
      "逆位的星星像被云遮住的夜空，提醒你暂时看不清希望，并不代表它真的消失了。",
    reflectionQuestions: [
      "最近哪一件微小但真实的事情，让我重新感到一点点希望？",
      "如果我允许恢复慢一些，最想先修补的会是什么？",
    ],
    gentleActions: [
      "记下一件今天仍然值得感激或感到松动的小事。",
      "做一个让自己重新补水、休息或安静下来的动作，把恢复放在前面。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-moon",
    rank: "XVIII",
    nameCn: "月亮",
    nameEn: "The Moon",
    number: 18,
    uprightKeywords: ["梦境感", "不确定", "潜意识", "感受起伏"],
    reversedKeywords: ["迷雾散开", "看清一点", "误解松动", "情绪回稳"],
    uprightMeaning:
      "月亮更像一条夜里的路，提醒你眼下未必适合追求完全确定，而适合慢慢辨认感受和投影。",
    reversedMeaning:
      "逆位的月亮像雾气慢慢散开，提醒你可以一点点把模糊的部分说清，而不是继续被它牵着走。",
    reflectionQuestions: [
      "我现在的不安，哪些来自事实，哪些可能来自想象或旧经验的投射？",
      "在还没完全看清之前，我需要怎样照顾自己的安全感？",
    ],
    gentleActions: [
      "把脑中的担心分成“已经发生”和“还没发生”两列。",
      "今晚尽量减少过度输入，让自己在更安静的状态里消化感受。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-sun",
    rank: "XIX",
    nameCn: "太阳",
    nameEn: "The Sun",
    number: 19,
    uprightKeywords: ["明朗", "活力", "敞开", "确认"],
    reversedKeywords: ["热得过头", "短暂遮挡", "喜悦受限", "能量回落"],
    uprightMeaning:
      "太阳更像一块被照亮的空地，提醒你有些答案其实已经很清楚了，可以更坦然地承认自己的喜悦和力量。",
    reversedMeaning:
      "逆位的太阳像被云遮了一下的白昼，提醒你能量也许暂时没那么满，但光还在那里。",
    reflectionQuestions: [
      "什么事情一想到就让我感到轻松、坦荡或更有生命力？",
      "如果允许自己更大方地接住好结果，我会担心什么？",
    ],
    gentleActions: [
      "今天主动靠近一个会给你带来明亮感的人、地方或活动。",
      "把已经做成的一件事写下来，允许自己正面承认它。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-judgement",
    rank: "XX",
    nameCn: "审判",
    nameEn: "Judgement",
    number: 20,
    uprightKeywords: ["苏醒", "召唤", "复盘", "重新站起"],
    reversedKeywords: ["迟疑", "自责", "错过回应", "停在旧评判里"],
    uprightMeaning:
      "审判更像一次清醒的召唤，提醒你回看走到这里的脉络，并决定要不要以新的姿态回应自己。",
    reversedMeaning:
      "逆位的审判像迟迟没有回音的钟声，提醒你也许已经听见了召唤，只是还没准备好行动。",
    reflectionQuestions: [
      "最近反复回到我心里的问题，究竟在邀请我做出什么回应？",
      "如果少一点自责和旧评判，我会更愿意如何重新开始？",
    ],
    gentleActions: [
      "回看最近一个阶段，写下你真正想保留和想放下的各一件事。",
      "给自己一个小小的“重新回应”动作，例如发出消息、提交申请或重新安排计划。",
    ],
  }),
  createMajorArcanaCard({
    id: "major-world",
    rank: "XXI",
    nameCn: "世界",
    nameEn: "The World",
    number: 21,
    uprightKeywords: ["完成", "整合", "圆满感", "进入下一轮"],
    reversedKeywords: ["收尾未竟", "松散", "差最后一步", "整合不足"],
    uprightMeaning:
      "世界更像一个阶段自然收拢成圆，提醒你看见自己已经走过的路，也允许完成感落到身上。",
    reversedMeaning:
      "逆位的世界像拼图还差最后一角，提醒你不是前功尽弃，而是还需要一个收尾动作来帮助整合。",
    reflectionQuestions: [
      "我已经完成了什么，只是还没有认真承认它的意义？",
      "如果要把这一阶段真正收尾，我最需要补上的最后一步是什么？",
    ],
    gentleActions: [
      "给最近完成的一件事做一个简单庆祝或归档动作。",
      "如果感觉还差一点，就把“最后一步”具体写下来，别再让它停留在模糊里。",
    ],
  }),
] as const;

export const majorArcanaSampleCards: readonly TarotCardDefinition[] = majorArcanaDeck.slice(0, 2);

export const majorArcanaPrototypeDeck: readonly TarotCardDefinition[] = majorArcanaDeck;

export const majorArcanaCollectionMeta = {
  key: "major-arcana",
  totalCards: 22,
  artworkCount: Object.keys(majorArcanaArtworkMap).length,
  includedSampleCount: majorArcanaSampleCards.length,
  prototypeDeckCount: majorArcanaPrototypeDeck.length,
  fullDeckCount: majorArcanaDeck.length,
  description: "当前已补齐 22 张大阿尔卡纳数据定义，并与本地牌面资源一一对应。",
} as const;

export function getTarotCardById(
  cardId: string,
  deck: readonly TarotCardDefinition[] = majorArcanaDeck,
): TarotCardDefinition | undefined {
  return deck.find((card) => card.id === cardId);
}
