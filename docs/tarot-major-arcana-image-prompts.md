# 大阿尔卡纳 AI 出图提示词模板

## 使用原则
- 先只做 `22 张大阿尔卡纳`
- 每张牌只生成 `1 张主图`
- `逆位` 不单独生成，前端直接旋转即可
- 所有牌必须使用同一套画风与参数，避免风格漂移
- 不在图片里写牌名、编号、文字、字母或 watermark

## 统一视觉方向
目标气质：安静、克制、略带神秘，不做廉价玄学风。

统一风格关键词：
- vertical tarot card illustration
- calm and restrained mystical mood
- contemplative, symbolic, elegant
- editorial fine art illustration
- soft painterly texture
- subtle paper grain
- warm ivory, sage green, bronze brown palette
- gentle contrast, soft light, clean composition
- centered subject, clear symbolic storytelling
- suitable for mobile display

## 通用主提示词模板
把下面这一段作为每一张牌的基础提示词前缀，再接每张牌自己的专属描述。

```text
A vertical tarot card illustration, calm and restrained mystical mood, contemplative and symbolic, editorial fine-art style, soft painterly texture, subtle paper grain, warm ivory, sage green, bronze brown palette, elegant framing, centered composition, quiet atmosphere, refined details, gentle light, no text, no letters, no numbers, no watermark, no logo, no extra typography, designed for a reflective tarot deck.
```

## 通用负面提示词
建议所有牌共用：

```text
neon purple, cyberpunk, glossy 3d render, game splash art, anime, chibi, cheap fantasy style, horror gore, blood, jump scare, exaggerated glow, excessive particles, busy background, photo collage, photorealistic face close-up, modern city, sci-fi machinery, text, letters, numbers, watermark, logo, frame text, duplicated limbs, distorted hands, blurry details
```

## 建议参数
按你使用的平台自行换算，尽量统一：
- 比例：`3:4` 或接近塔罗牌比例
- 构图：主体居中，保留边缘留白
- 风格强度：中等，不要过度艺术化导致识别度下降
- 批量出图：每张先出 `4` 张，再人工筛 `1` 张
- 导出格式：优先 `WebP`

## 统一补充句
如果你发现某个平台容易跑偏，可以在每张牌最后再补这句：

```text
Keep the image quiet, symbolic, elegant, and cohesive with a full tarot deck. Avoid cliché occult aesthetics.
```

---

## 22 张牌专属提示词

### 0. 愚者 The Fool
```text
A young traveler standing at the edge of a cliff at dawn, holding a small bundle and a white flower, a small dog beside them, open sky, distant mountains, a feeling of innocence, beginning, trust, openness, light movement in the fabric, symbolic but restrained, no comedy, no exaggeration.
```

### 1. 魔术师 The Magician
```text
A focused figure standing behind a simple table with four symbolic elements arranged in balance, one hand raised and one hand lowered, subtle infinity motif, light gathering through the hands, atmosphere of concentration, initiative, alignment, skill, clean composition, not theatrical.
```

### 2. 女祭司 The High Priestess
```text
A calm seated figure between two vertical pillars, moonlit stillness, veil-like fabric behind them, a partially hidden scroll, pomegranate or seed-like pattern used very subtly, atmosphere of intuition, secrecy, inner knowing, quiet depth, minimal but symbolic.
```

### 3. 皇后 The Empress
```text
A serene figure seated in a fertile garden or wheat field, soft flowing fabric, natural abundance, fruit, leaves, grain, gentle sunlight, atmosphere of nurturing, creativity, sensual calm, grounded beauty, warm and generous but not luxurious or flashy.
```

### 4. 皇帝 The Emperor
```text
A steady ruler seated on a stone throne in a quiet mountain setting, geometric structure, firm posture, subtle ram symbolism, atmosphere of order, stability, boundaries, responsibility, authority expressed through restraint rather than aggression.
```

### 5. 教皇 The Hierophant
```text
A spiritual teacher figure seated in a formal symmetrical setting, two followers or students implied nearby, keys or ritual symbols placed simply, atmosphere of tradition, learning, guidance, shared wisdom, ceremonial but calm, not church-heavy or ornate.
```

### 6. 恋人 The Lovers
```text
Two figures facing each other in an open landscape, a luminous tree or garden element between or behind them, atmosphere of connection, choice, honesty, mutual recognition, emotional clarity, gentle sacredness, intimate but not romanticized cliché.
```

### 7. 战车 The Chariot
```text
A composed figure standing or seated in a chariot-like structure, two contrasting creatures or symbolic forces in front, atmosphere of determination, direction, disciplined movement, willpower, momentum held in balance, elegant and controlled, not battle-like.
```

### 8. 力量 Strength
```text
A calm figure gently resting hands on a lion, no violence, no domination, atmosphere of courage, tenderness, emotional steadiness, inner strength, compassion as power, warm light, close symbolic relationship between human and animal.
```

### 9. 隐者 The Hermit
```text
A solitary elder on a mountain path at dusk, holding a lantern close rather than high, robe moving slightly in the wind, atmosphere of introspection, quiet search, patience, retreat, inner guidance, spacious negative background, restrained and still.
```

### 10. 命运之轮 Wheel of Fortune
```text
A symbolic wheel suspended in a calm cosmic or airy space, small creatures or archetypal figures placed subtly around it, atmosphere of cycles, change, timing, turning points, movement within order, elegant symbolism without chaos.
```

### 11. 正义 Justice
```text
A composed figure seated upright with scales and a sword, balanced architectural background, clear vertical lines, atmosphere of clarity, discernment, fairness, consequence, accountability, clean and measured, no courtroom melodrama.
```

### 12. 倒吊人 The Hanged Man
```text
A figure suspended upside down from a living tree branch, body relaxed rather than distressed, halo-like light around the head, atmosphere of pause, surrender, altered perspective, acceptance, waiting with awareness, tranquil and contemplative.
```

### 13. 死神 Death
```text
A skeletal or armored symbolic rider moving quietly through a landscape of transition, fallen leaves, distant sunrise, white flower motif, atmosphere of ending, release, transformation, inevitability without horror, solemn and spacious, no gore.
```

### 14. 节制 Temperance
```text
An angelic or serene figure pouring liquid between two cups, one foot on land and one near water, path leading to distant light, atmosphere of balance, integration, healing, moderation, blending, graceful and fluid composition.
```

### 15. 恶魔 The Devil
```text
A shadowed horned figure seated above two loosely bound people, chains visibly removable, atmosphere of attachment, temptation, illusion, compulsion, material entanglement, symbolic tension, psychologically unsettling but not horror or grotesque.
```

### 16. 高塔 The Tower
```text
A tall stone tower struck by lightning in a storm-lit sky, fragments falling, figures escaping, atmosphere of disruption, revelation, collapse of false structure, sudden truth, dramatic but still elegant, avoid blockbuster disaster style.
```

### 17. 星星 The Star
```text
A kneeling figure by still water under a large central star and smaller surrounding stars, pouring water onto land and water, atmosphere of hope, renewal, openness, quiet blessing, tenderness after difficulty, spacious luminous night.
```

### 18. 月亮 The Moon
```text
A moonlit path between two towers, a dog and a wolf on either side, a crustacean emerging from water, atmosphere of uncertainty, dream, projection, intuition, the unknown, soft surreal tension, poetic rather than scary.
```

### 19. 太阳 The Sun
```text
A radiant sun over a warm open field, a child on a white horse or an innocent joyful figure, sunflowers or simple bright flora, atmosphere of vitality, clarity, warmth, confidence, uncomplicated joy, luminous but not oversaturated.
```

### 20. 审判 Judgement
```text
Figures rising or awakening in response to a distant call or trumpet, sky opening, atmosphere of awakening, reckoning, renewal, truth returning, spiritual clarity, lifted but calm, symbolic and spacious, not apocalyptic.
```

### 21. 世界 The World
```text
A central dancing or poised figure within a wreath or circular frame, four symbolic creatures placed subtly at the corners, atmosphere of completion, integration, wholeness, harmony, movement and balance, celebratory but refined.
```

---

## 推荐组合方式
每次真正喂给出图模型时，建议按这个结构拼接：

```text
[通用主提示词模板]
[某一张牌的专属提示词]
Keep the image quiet, symbolic, elegant, and cohesive with a full tarot deck. Avoid cliché occult aesthetics.
```

负面提示词单独放：

```text
[通用负面提示词]
```

## 示例：女祭司完整拼接版
```text
A vertical tarot card illustration, calm and restrained mystical mood, contemplative and symbolic, editorial fine-art style, soft painterly texture, subtle paper grain, warm ivory, sage green, bronze brown palette, elegant framing, centered composition, quiet atmosphere, refined details, gentle light, no text, no letters, no numbers, no watermark, no logo, no extra typography, designed for a reflective tarot deck.

A calm seated figure between two vertical pillars, moonlit stillness, veil-like fabric behind them, a partially hidden scroll, pomegranate or seed-like pattern used very subtly, atmosphere of intuition, secrecy, inner knowing, quiet depth, minimal but symbolic.

Keep the image quiet, symbolic, elegant, and cohesive with a full tarot deck. Avoid cliché occult aesthetics.
```

## 建议下一步
最实用的顺序是：
1. 先跑 `愚者 / 女祭司 / 隐者 / 星星 / 月亮 / 太阳` 6 张测试风格
2. 风格定了以后，再批量补齐 22 张
3. 选定最终图后，把牌库数据扩展出 `imageSrc` 和 `imageAlt`