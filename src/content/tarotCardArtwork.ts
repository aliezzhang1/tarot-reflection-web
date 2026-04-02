export type TarotCardArtwork = {
  imageSrc: string;
  imageAlt: string;
};

const artworkBasePath = "https://tarot-1418573091.cos.ap-hongkong.myqcloud.com/cards/major-arcana";

export const majorArcanaArtworkMap = {
  "major-fool": {
    imageSrc: `${artworkBasePath}/major-fool.webp`,
    imageAlt: "愚者牌插图",
  },
  "major-magician": {
    imageSrc: `${artworkBasePath}/major-magician.webp`,
    imageAlt: "魔术师牌插图",
  },
  "major-high-priestess": {
    imageSrc: `${artworkBasePath}/major-high-priestess.webp`,
    imageAlt: "女祭司牌插图",
  },
  "major-empress": {
    imageSrc: `${artworkBasePath}/major-empress.webp`,
    imageAlt: "皇后牌插图",
  },
  "major-emperor": {
    imageSrc: `${artworkBasePath}/major-emperor.webp`,
    imageAlt: "皇帝牌插图",
  },
  "major-hierophant": {
    imageSrc: `${artworkBasePath}/major-hierophant.webp`,
    imageAlt: "教皇牌插图",
  },
  "major-lovers": {
    imageSrc: `${artworkBasePath}/major-lovers.webp`,
    imageAlt: "恋人牌插图",
  },
  "major-chariot": {
    imageSrc: `${artworkBasePath}/major-chariot.webp`,
    imageAlt: "战车牌插图",
  },
  "major-strength": {
    imageSrc: `${artworkBasePath}/major-strength.webp`,
    imageAlt: "力量牌插图",
  },
  "major-hermit": {
    imageSrc: `${artworkBasePath}/major-hermit.webp`,
    imageAlt: "隐者牌插图",
  },
  "major-wheel-of-fortune": {
    imageSrc: `${artworkBasePath}/major-wheel-of-fortune.webp`,
    imageAlt: "命运之轮牌插图",
  },
  "major-justice": {
    imageSrc: `${artworkBasePath}/major-justice.webp`,
    imageAlt: "正义牌插图",
  },
  "major-hanged-man": {
    imageSrc: `${artworkBasePath}/major-hanged-man.webp`,
    imageAlt: "倒吊人牌插图",
  },
  "major-death": {
    imageSrc: `${artworkBasePath}/major-death.webp`,
    imageAlt: "死神牌插图",
  },
  "major-temperance": {
    imageSrc: `${artworkBasePath}/major-temperance.webp`,
    imageAlt: "节制牌插图",
  },
  "major-devil": {
    imageSrc: `${artworkBasePath}/major-devil.webp`,
    imageAlt: "恶魔牌插图",
  },
  "major-tower": {
    imageSrc: `${artworkBasePath}/major-tower.webp`,
    imageAlt: "高塔牌插图",
  },
  "major-star": {
    imageSrc: `${artworkBasePath}/major-star.webp`,
    imageAlt: "星星牌插图",
  },
  "major-moon": {
    imageSrc: `${artworkBasePath}/major-moon.webp`,
    imageAlt: "月亮牌插图",
  },
  "major-sun": {
    imageSrc: `${artworkBasePath}/major-sun.webp`,
    imageAlt: "太阳牌插图",
  },
  "major-judgement": {
    imageSrc: `${artworkBasePath}/major-judgement.webp`,
    imageAlt: "审判牌插图",
  },
  "major-world": {
    imageSrc: `${artworkBasePath}/major-world.webp`,
    imageAlt: "世界牌插图",
  },
} as const satisfies Record<string, TarotCardArtwork>;

export const majorArcanaBackArtwork: TarotCardArtwork = {
  imageSrc: `${artworkBasePath}/major-arcana-back.webp`,
  imageAlt: "塔罗牌背面插图",
};

export function getTarotCardArtwork(cardId: string): TarotCardArtwork | undefined {
  return majorArcanaArtworkMap[cardId as keyof typeof majorArcanaArtworkMap];
}
