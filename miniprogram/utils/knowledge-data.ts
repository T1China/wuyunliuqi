/**
 * knowledge-data.ts
 * 五运六气知识库静态数据
 * 来源：《黄帝内经·素问》六元正纪大论、至真要大论等
 */

export interface LiuqiInfo {
  name: string         // 气名
  element: string      // 五行
  organ: string        // 对应脏腑
  nature: string       // 气候特征
  disease: string      // 易发疾病
  nourish: string      // 调养建议
  color: string        // 五行色
}

export interface WuxingInfo {
  element: string      // 五行
  zang: string         // 脏
  fu: string           // 腑
  nature: string       // 特性
  season: string       // 对应季节
  emotion: string      // 对应情志
  taste: string        // 对应五味
  nourish: string      // 调养要点
  color: string
}

export const LIUQI_DATA: LiuqiInfo[] = [
  {
    name: '厥阴风木',
    element: '木',
    organ: '肝、胆',
    nature: '风气主令，气候特征为风气盛行，乍暖乍寒，气候多变',
    disease: '腹部拘急、头痛眩晕、肢体抽搐及疮疡皮疹等；肝气郁滞、筋脉拘急，易患过敏性疾病',
    nourish: '防风保暖，温阳补气，避免风邪侵袭。春季宜养肝血，可食青色蔬菜辅助调理肝脏，保持心情舒畅，防肝气郁结',
    color: '#4CAF50',
  },
  {
    name: '少阴君火',
    element: '火',
    organ: '心、脾、肾',
    nature: '君火主令，热气盛行且易夹湿，气候温热潮湿',
    disease: '中暑、肠胃炎、泌尿系统感染和心肺热症；心火亢盛、失眠烦躁、口舌生疮',
    nourish: '清热祛湿，饮食宜清淡清补，推荐绿豆汤、薏米粥。避免久处空调房，可艾灸足三里穴健脾益气',
    color: '#F44336',
  },
  {
    name: '少阳相火',
    element: '火',
    organ: '三焦、胆',
    nature: '相火主令，暑热夹湿，气候最热，阳气盛极',
    disease: '流泪、耳鸣、头晕目眩、失眠头痛及咽喉疾病；暑热伤津，心烦胸闷',
    nourish: '清心降火、健脾祛湿。食用莲子、苦瓜、百合、银耳，避免辛辣油腻。情志宜平和，适度运动促进排汗',
    color: '#FF5722',
  },
  {
    name: '太阴湿土',
    element: '土',
    organ: '脾、胃',
    nature: '湿气主令，梅雨长夏季节，阴雨连绵，湿气偏重',
    disease: '足痿、下肢无力、腰痛膝髀关节病；脾胃运化失司、纳差腹胀、肢体困重',
    nourish: '健脾祛湿、温阳利水。饮食宜薏米、冬瓜、赤小豆等健脾祛湿之品，避免油腻厚味，居住环境宜通风干燥',
    color: '#FF9800',
  },
  {
    name: '阳明燥金',
    element: '金',
    organ: '肺、大肠',
    nature: '燥气主令，气候干燥，秋高气爽，收敛杀伐特征',
    disease: '干咳少痰、呼吸系统疾病、皮肤干燥及便秘；肺燥津伤，鼻燥咽干',
    nourish: '润肺养阴、生津止渴。推荐银耳、百合、梨、蜂蜜、杏仁等润燥食物。关注气候变化增减衣物，保证充足睡眠',
    color: '#9E9E9E',
  },
  {
    name: '太阳寒水',
    element: '水',
    organ: '肾、膀胱',
    nature: '寒气主令，冬季寒气最盛，阳气潜藏，开阳之气',
    disease: '各类寒邪相关疾病及膀胱肾虚弱症状；腰膝冷痛、畏寒怕冷、夜尿频多',
    nourish: '温阳化气、利水健脾。冬季应早睡晚起，保暖避寒，适度运动温阳，可食羊肉、生姜、核桃等温阳食物',
    color: '#2196F3',
  },
]

export const WUXING_DATA: WuxingInfo[] = [
  {
    element: '木',
    zang: '肝',
    fu: '胆',
    nature: '肝主疏泄，调畅气机，主筋膜目光，性喜条达而恶抑郁',
    season: '春',
    emotion: '怒',
    taste: '酸',
    nourish: '春季宜养肝血，保持心情舒畅，避免生气抑郁。食用绿色蔬菜、生菜、绿茶等，忌过度劳累伤阴血，适度户外活动跟随春季生发节奏',
    color: '#4CAF50',
  },
  {
    element: '火',
    zang: '心',
    fu: '三焦、小肠',
    nature: '心为阳中之阳，主血脉神明；三焦为相火之腑，主气化通调',
    season: '夏',
    emotion: '喜',
    taste: '苦',
    nourish: '夏季宜养心神，避免过度兴奋，食用红豆、桂圆、大枣等红色食物。保持作息规律，避免熬夜伤心阴，静坐冥想有利心神安宁',
    color: '#F44336',
  },
  {
    element: '土',
    zang: '脾',
    fu: '胃',
    nature: '脾为后天之本、气血生化之源，主运化水谷，主肌肉四肢',
    season: '长夏',
    emotion: '思',
    taste: '甘',
    nourish: '长夏宜健脾益气，饮食清淡易消化，食用山药、薏米、黄豆等黄色食物。规律进食勿过饱，避免过度忧思伤脾，温脾阳勿贪凉冷饮',
    color: '#FF9800',
  },
  {
    element: '金',
    zang: '肺',
    fu: '大肠',
    nature: '肺为娇脏，主气司呼吸，主皮毛，为相傅之官，朝百脉主治节',
    season: '秋',
    emotion: '悲',
    taste: '辛',
    nourish: '秋季宜润肺养阴，食用银耳、百合、山药、梨等白色食物。早睡早起，适度运动增强肺功能，避免过度悲伤郁闷，忌过度哭泣伤肺气',
    color: '#9E9E9E',
  },
  {
    element: '水',
    zang: '肾',
    fu: '膀胱',
    nature: '肾为先天之本、生命之源，主藏精纳气，主生长发育，作强之官',
    season: '冬',
    emotion: '恐',
    taste: '咸',
    nourish: '冬季宜温阳补肾，食用黑芝麻、黑豆、桂圆等黑色食物。早睡晚起保护阳气，避免过度房劳伤肾精，冬季勿过度出汗散阳',
    color: '#2196F3',
  },
]

export const YANGBO_INTRO = `李阳波五运六气数字体系，源自《开启中医之门》，用五组数字代表五行运气强度值：木运410、火运115（君火相火统一）、土运126、金运28、水运39。数字含义来自河图洛书天地之数，"∧"表示太过（偏强），"∨"表示不及（偏弱）。通过对比命图（出生年）与病图（发病年）的数字格局，分析五行偏盛偏衰，判断当年气候特点和易发疾病，为辨证施治和养生调理提供参考依据。`

export const GANZHI_INTRO = `干支纪年以甲子（1984年）为基准循环计算。十天干（甲乙丙丁戊己庚辛壬癸）代表阴阳五行属性；十二地支（子丑寅卯辰巳午未申酉戌亥）决定司天在泉格局。天干10年轮回，地支12年轮回，六十年完成一次完整甲子周期。司天之气影响上半年气候，在泉之气主导下半年，二者互为对应，相差三位。`

// ─────────────────────────────────────────────
// 以下为点击解释系统新增数据
// ─────────────────────────────────────────────

export interface TianganInfo {
  char: string; yinyang: string; element: string; organ: string; desc: string
}
export const TIANGAN_DATA: Record<string, TianganInfo> = {
  '甲': { char: '甲', yinyang: '阳', element: '木', organ: '胆',   desc: '大树破土，主生发领导' },
  '乙': { char: '乙', yinyang: '阴', element: '木', organ: '肝',   desc: '藤蔓柔韧，主生长调和' },
  '丙': { char: '丙', yinyang: '阳', element: '火', organ: '小肠', desc: '烈日照耀，主温暖明朗' },
  '丁': { char: '丁', yinyang: '阴', element: '火', organ: '心',   desc: '烛光温和，主神明养护' },
  '戊': { char: '戊', yinyang: '阳', element: '土', organ: '胃',   desc: '山岳厚重，主承载运化' },
  '己': { char: '己', yinyang: '阴', element: '土', organ: '脾',   desc: '田园沃土，主滋养化生' },
  '庚': { char: '庚', yinyang: '阳', element: '金', organ: '大肠', desc: '刀剑刚硬，主收敛肃杀' },
  '辛': { char: '辛', yinyang: '阴', element: '金', organ: '肺',   desc: '珠玉温润，主精细收藏' },
  '壬': { char: '壬', yinyang: '阳', element: '水', organ: '膀胱', desc: '江河广阔，主流动智慧' },
  '癸': { char: '癸', yinyang: '阴', element: '水', organ: '肾',   desc: '雨露滋润，主封藏生机' },
}

export interface DizhiInfo {
  char: string; animal: string; element: string; organ: string
  direction: string; hour: string; jieqi: string
}
export const DIZHI_DATA: Record<string, DizhiInfo> = {
  '子': { char: '子', animal: '鼠', element: '水', organ: '胆',   direction: '正北', hour: '23-01时', jieqi: '冬至' },
  '丑': { char: '丑', animal: '牛', element: '土', organ: '肝',   direction: '东北', hour: '01-03时', jieqi: '大寒' },
  '寅': { char: '寅', animal: '虎', element: '木', organ: '肺',   direction: '东北', hour: '03-05时', jieqi: '立春' },
  '卯': { char: '卯', animal: '兔', element: '木', organ: '大肠', direction: '正东', hour: '05-07时', jieqi: '春分' },
  '辰': { char: '辰', animal: '龙', element: '土', organ: '胃',   direction: '东南', hour: '07-09时', jieqi: '清明' },
  '巳': { char: '巳', animal: '蛇', element: '火', organ: '脾',   direction: '东南', hour: '09-11时', jieqi: '立夏' },
  '午': { char: '午', animal: '马', element: '火', organ: '心',   direction: '正南', hour: '11-13时', jieqi: '夏至' },
  '未': { char: '未', animal: '羊', element: '土', organ: '小肠', direction: '西南', hour: '13-15时', jieqi: '大暑' },
  '申': { char: '申', animal: '猴', element: '金', organ: '膀胱', direction: '西南', hour: '15-17时', jieqi: '立秋' },
  '酉': { char: '酉', animal: '鸡', element: '金', organ: '肾',   direction: '正西', hour: '17-19时', jieqi: '秋分' },
  '戌': { char: '戌', animal: '狗', element: '土', organ: '心包', direction: '西北', hour: '19-21时', jieqi: '寒露' },
  '亥': { char: '亥', animal: '猪', element: '水', organ: '三焦', direction: '西北', hour: '21-23时', jieqi: '立冬' },
}

export const WUYUN_DATA: Record<string, string> = {
  '木运太过': '风气流行，肝气偏旺，脾胃易受邪。多见眩晕、腹泻、腹胀、情绪易怒。',
  '木运不及': '燥气偏盛，肝气不足，多见胁痛、肢体麻木、目涩。',
  '火运太过': '热气流行，心火旺盛，肺金受邪。多见心烦失眠、咳喘、皮肤病。',
  '火运不及': '寒气偏盛，心阳不振。多见心悸、胸痛、畏寒、精神萎靡。',
  '土运太过': '雨湿流行，脾气偏盛，肾水受邪。多见水肿、腹满、腰酸。',
  '土运不及': '风气偏旺，脾气不足。多见食欲差、肌肉无力、腹泻便溏。',
  '金运太过': '燥气流行，肺气偏强，肝木受邪。多见胁痛、便秘、咳嗽气急。',
  '金运不及': '火气偏盛，肺气不足。多见干咳、皮肤粗糙、易感冒。',
  '水运太过': '寒气流行，肾气偏强，心火受邪。多见心悸、水肿、腰膝冷痛。',
  '水运不及': '湿气偏盛，肾气不足。多见耳鸣、腰膝酸软、浮肿。',
}

export const LABEL_EXPLAIN: Record<string, { subtitle: string; body: string }> = {
  '干支':     { subtitle: '天干地支，60年一轮回', body: '天干地支合称，以甲子年（1984）为基准，60年一轮回，反映该年的阴阳五行属性。' },
  '主运':     { subtitle: '由天干决定的该年五行主运', body: '由天干决定的该年五行主运，分太过（年干为阳：甲丙戊庚壬）和不及（年干为阴：乙丁己辛癸）。' },
  '司天':     { subtitle: '上半年主导气候（大寒到大暑）', body: '上半年（大寒到大暑）的主导气候，决定上半年偏热/湿/寒/燥，由年支决定。' },
  '在泉':     { subtitle: '下半年主导气候（大暑到大寒）', body: '下半年（大暑到大寒）的主导气候，与司天阴阳相对，互为配对。' },
  '主气':     { subtitle: '四季固定主气，每年不变', body: '四季固定主气，每年不变，6段按节气轮转，是气候的固定背景。' },
  '客气':     { subtitle: '每年随年支变化的气候', body: '每年随年支变化的气候，叠加在主气上，是当年气候的特殊变量。' },
  '当令主气': { subtitle: '当前时段固定主气', body: '当前节气时段的主气（固定不变），反映该季节的正常气候特征。' },
  '当令客气': { subtitle: '当前时段今年特有客气', body: '当前节气时段今年特有的客气，与主气叠加判断当前气候特点和易发疾病。' },
}

export const QISEGMENT_EXPLAIN: Record<string, { subtitle: string; body: string }> = {
  '初之气': { subtitle: '大寒到春分（约1/20到3/20）', body: '大寒到春分，主气厥阴风木，风气初动，阳气萌发，春寒料峭。' },
  '二之气': { subtitle: '春分到小满（约3/20到5/21）', body: '春分到小满，主气少阴君火，气候渐暖，阳气升发，万物生长。' },
  '三之气': { subtitle: '小满到大暑（约5/21到7/23）', body: '小满到大暑，主气少阳相火，暑热最盛，阳气极旺，夏季高峰。' },
  '四之气': { subtitle: '大暑到秋分（约7/23到9/23）', body: '大暑到秋分，主气太阴湿土，湿热交蒸，长夏多雨，脾胃易困。' },
  '五之气': { subtitle: '秋分到小雪（约9/23到11/22）', body: '秋分到小雪，主气阳明燥金，秋燥当令，肺肠易病，宜润燥养肺。' },
  '终之气': { subtitle: '小雪到大寒（约11/22到1/20）', body: '小雪到大寒，主气太阳寒水，寒气主令，阳气收藏，肾膀胱易病。' },
}

export interface PopupInfo {
  title: string
  subtitle: string
  body: string
  color?: string
}

export function lookupTerm(term: string): PopupInfo | null {
  if (!term) return null

  // 1. 标签概念（干支/主运/司天/在泉/主气/客气/当令主气/当令客气）
  if (LABEL_EXPLAIN[term]) {
    const { subtitle, body } = LABEL_EXPLAIN[term]
    return { title: term, subtitle, body }
  }

  // 2. 气段标签（初之气 ~ 终之气）
  if (QISEGMENT_EXPLAIN[term]) {
    const { subtitle, body } = QISEGMENT_EXPLAIN[term]
    return { title: term, subtitle, body, color: '#94B8D0' }
  }

  // 3. 六气名（厥阴风木 / 少阴君火 / 少阳相火 / 太阴湿土 / 阳明燥金 / 太阳寒水）
  const qi = LIUQI_DATA.find(x => x.name === term)
  if (qi) {
    return {
      title: qi.name,
      subtitle: qi.element + ' · ' + qi.organ,
      body: '气候特征：' + qi.nature + '\n易发疾病：' + qi.disease + '\n调养建议：' + qi.nourish,
      color: qi.color,
    }
  }

  // 4. 五运太过/不及（如 "木-太过" → 查 "木运太过"）
  const wuyunKey = term.replace('-', '运')
  if (WUYUN_DATA[wuyunKey]) {
    const base = term[0]
    const wx = WUXING_DATA.find(x => x.element === base)
    return {
      title: term,
      subtitle: wx ? wx.season + '季 · 脏：' + wx.zang + ' 腑：' + wx.fu : '',
      body: WUYUN_DATA[wuyunKey],
      color: wx ? wx.color : undefined,
    }
  }

  // 5. 干支组合（如 "甲子"，动态拼装天干+地支解释）
  if (term.length === 2 && TIANGAN_DATA[term[0]] && DIZHI_DATA[term[1]]) {
    const tg = TIANGAN_DATA[term[0]]
    const dz = DIZHI_DATA[term[1]]
    const wxColor = WUXING_DATA.find(x => x.element === tg.element)
    return {
      title: term,
      subtitle: '天干' + tg.yinyang + tg.element + '，' + dz.animal + '年',
      body: '【天干·' + tg.char + '】' + tg.yinyang + tg.element + '，脏腑：' + tg.organ + '\n' + tg.desc
        + '\n\n【地支·' + dz.char + '】' + dz.animal + '，' + dz.element + '，脏腑：' + dz.organ
        + '\n方位：' + dz.direction + '，时辰：' + dz.hour + '，节令：' + dz.jieqi,
      color: wxColor ? wxColor.color : '#FFD700',
    }
  }

  // 6. 单独天干
  if (TIANGAN_DATA[term]) {
    const tg = TIANGAN_DATA[term]
    return {
      title: term,
      subtitle: tg.yinyang + tg.element + '，脏腑：' + tg.organ,
      body: tg.desc,
    }
  }

  // 7. 单独地支
  if (DIZHI_DATA[term]) {
    const dz = DIZHI_DATA[term]
    return {
      title: term,
      subtitle: dz.animal + '，' + dz.element + '，脏腑：' + dz.organ,
      body: '方位：' + dz.direction + '，时辰：' + dz.hour + '，节令：' + dz.jieqi,
    }
  }

  // 8. 单字五行（木/火/土/金/水）
  const wx2 = WUXING_DATA.find(x => x.element === term)
  if (wx2) {
    return {
      title: term + '（' + wx2.zang + '/' + wx2.fu + '）',
      subtitle: wx2.season + '季 · 情志：' + wx2.emotion + ' · 五味：' + wx2.taste,
      body: wx2.nature + '\n\n调养：' + wx2.nourish,
      color: wx2.color,
    }
  }

  return null
}
