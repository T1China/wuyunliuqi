/**
 * wuyunliuqi.ts
 * 五运六气核心计算引擎
 * 从 C# Form1.cs wuyunliuqi 类移植，算法完全对应
 * 基准年：1984（甲子年）
 */

// ── 基础数据 ──────────────────────────────────────────────────────────
const GAN  = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const ZHI  = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
// 司天顺序（地支余数 0-5 循环）
const SITIAN_ALL = ['少阴君火','太阴湿土','少阳相火','阳明燥金','太阳寒水','厥阴风木']
// 五行顺序（天干余数 0-4 循环，偏移2）
const WUXING_ALL = ['木','火','土','金','水']
// 六气顺序（主气固定，从初之气到终之气）
const LIUQI_ALL  = ['厥阴风木','少阴君火','少阳相火','太阴湿土','阳明燥金','太阳寒水']

// 五行配色（供 UI/Canvas 使用）
export const WUXING_COLOR: Record<string, string> = {
  '木': '#4CAF50',
  '火': '#F44336',
  '土': '#FF9800',
  '金': '#9E9E9E',
  '水': '#2196F3',
}

// 李阳波数字编码
export const YANGBO_CODE: Record<string, string> = {
  '木': '410',
  '火': '115',
  '土': '126',
  '金': '28',
  '水': '39',
}

// ── 类型定义 ──────────────────────────────────────────────────────────
export interface QiResult {
  ganzhi: string        // 干支，如"甲子"
  wuxing: string        // 五运主运，如"木-太过"
  wuxingBase: string    // 纯五行名，如"木"
  isExcess: boolean     // true=太过，false=不及
  sitian: string        // 司天
  zaiquan: string       // 在泉
  zhuqi: string         // 当前节段主气
  keqi: string          // 当前节段客气
  zhuqiIndex: number    // 主气所在段（0-5）
  allZhuqi: string[]    // 全年6段主气
  allKeqi: string[]     // 全年6段客气
  yangboNums: string[]  // 李阳波数字[主运,司天,在泉,主气,客气]
}

export interface DateSegment {
  label: string    // 初之气～终之气
  zhuqi: string
  keqi: string
  startDesc: string  // 起始日期描述
  endDesc: string    // 结束日期描述
}

// ── 核心计算函数 ───────────────────────────────────────────────────────

/** 获取干支 */
export function getGanzhi(date: Date): string {
  const year = date.getFullYear()
  const iGan = ((year - 1984) % 10 + 10 * 6000) % 10
  const iZhi = ((year - 1984) % 12 + 12 * 6000) % 12
  return GAN[iGan] + ZHI[iZhi]
}

/** 获取五运主运（含太过/不及） */
export function getWuxing(date: Date): string {
  const year = date.getFullYear()
  const iGan = ((year - 1984) % 10 + 10 * 6000) % 10
  const idxGan = (iGan + 2) % 5
  const guoji = iGan % 2 === 0 ? '太过' : '不及'
  return WUXING_ALL[idxGan] + '-' + guoji
}

/** 获取纯五行名（不含太过/不及） */
export function getWuxingBase(date: Date): string {
  const year = date.getFullYear()
  const iGan = ((year - 1984) % 10 + 10 * 6000) % 10
  return WUXING_ALL[(iGan + 2) % 5]
}

/** 获取司天 */
export function getSitian(date: Date): string {
  const year = date.getFullYear()
  const iZhi = ((year - 1984) % 12 + 12 * 6000) % 12
  return SITIAN_ALL[iZhi % 6]
}

/** 获取在泉（= 司天 +3 模6） */
export function getZaiquan(date: Date): string {
  const year = date.getFullYear()
  const iZhi = ((year - 1984) % 12 + 12 * 6000) % 12
  return SITIAN_ALL[(iZhi % 6 + 3) % 6]
}

/** 获取全年6段主气列表（固定顺序） */
export function getAllZhuqi(): string[] {
  return [...LIUQI_ALL]
}

/** 获取全年6段客气列表 */
export function getAllKeqi(date: Date): string[] {
  const year = date.getFullYear()
  const iZhi = ((year - 1984) % 12 + 12 * 6000) % 12
  const idxZhi = iZhi % 6
  return Array.from({ length: 6 }, (_, i) => SITIAN_ALL[(idxZhi - 2 + 6 + i) % 6])
}

/**
 * 获取当前日期所在主气段（0-5）
 * 六气时间区间（近似，以1月21日为基准，每段约2个月）：
 *   0 初之气  01.21 ~ 03.21  厥阴风木
 *   1 二之气  03.21 ~ 05.21  少阴君火
 *   2 三之气  05.21 ~ 07.21  少阳相火
 *   3 四之气  07.21 ~ 09.21  太阴湿土
 *   4 五之气  09.21 ~ 11.21  阳明燥金
 *   5 终之气  11.21 ~ 01.21  太阳寒水
 */
export function getZhuqiIndex(date: Date): number {
  const year = date.getFullYear()
  // 基准日：当年1月21日
  const base = new Date(year, 0, 21) // 月份0-indexed
  const ms = date.getTime() - base.getTime()
  const days = ms / (1000 * 60 * 60 * 24)

  if (days < 0) return 5           // 1.21前 → 上年终之气
  if (days < 60)  return 0         // 初之气 ~60天
  if (days < 120) return 1         // 二之气 ~60天
  if (days < 183) return 2         // 三之气 ~63天
  if (days < 245) return 3         // 四之气 ~62天
  if (days < 305) return 4         // 五之气 ~60天
  return 5                         // 终之气
}

/** 获取当前主气 */
export function getCurrentZhuqi(date: Date): string {
  return LIUQI_ALL[getZhuqiIndex(date)]
}

/** 获取当前客气 */
export function getCurrentKeqi(date: Date): string {
  const keqi = getAllKeqi(date)
  return keqi[getZhuqiIndex(date)]
}

/** 李阳波数字编码（含太过∧/不及∨） */
export function yangboNum(element: string): string {
  let code = ''
  for (const [key, val] of Object.entries(YANGBO_CODE)) {
    if (element.includes(key)) { code = val; break }
  }
  if (element.includes('太过')) code += '∧'
  if (element.includes('不及')) code += '∨'
  return code
}

/** 提取六气/五运中的五行名 */
export function extractWuxing(qi: string): string {
  for (const wx of WUXING_ALL) {
    if (qi.includes(wx)) return wx
  }
  return ''
}

/** 统计QiResult中各五行出现次数（用于雷达图） */
export function calcWuxingWeights(result: QiResult): Record<string, number> {
  const items = [result.wuxingBase, result.sitian, result.zaiquan, result.zhuqi, result.keqi]
  const weights: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 }
  for (const item of items) {
    const wx = extractWuxing(item)
    if (wx) weights[wx]++
  }
  return weights
}

/**
 * 一键计算完整结果
 * 对应 C# Button1_Click 中的所有计算逻辑
 */
export function calculate(date: Date): QiResult {
  const wuxing     = getWuxing(date)
  const wuxingBase = getWuxingBase(date)
  const isExcess   = wuxing.includes('太过')
  const sitian     = getSitian(date)
  const zaiquan    = getZaiquan(date)
  const allZhuqi   = getAllZhuqi()
  const allKeqi    = getAllKeqi(date)
  const zhuqiIndex = getZhuqiIndex(date)
  const zhuqi      = allZhuqi[zhuqiIndex]
  const keqi       = allKeqi[zhuqiIndex]

  const yangboNums = [
    yangboNum(wuxing),
    yangboNum(sitian),
    yangboNum(zaiquan),
    yangboNum(zhuqi),
    yangboNum(keqi),
  ]

  return {
    ganzhi: getGanzhi(date),
    wuxing,
    wuxingBase,
    isExcess,
    sitian,
    zaiquan,
    zhuqi,
    keqi,
    zhuqiIndex,
    allZhuqi,
    allKeqi,
    yangboNums,
  }
}

/** 六气段标签 */
export const QI_LABELS = ['初之气','二之气','三之气','四之气','五之气','终之气']

/** 获取全年六气段详情（含日期描述） */
export function getYearSegments(date: Date): DateSegment[] {
  const year = date.getFullYear()
  const allZhuqi = getAllZhuqi()
  const allKeqi  = getAllKeqi(date)
  const startDates = [
    `${year}/1/21`,  `${year}/3/21`,  `${year}/5/21`,
    `${year}/7/21`,  `${year}/9/21`,  `${year}/11/21`,
  ]
  const endDates = [
    `${year}/3/21`,  `${year}/5/21`,  `${year}/7/21`,
    `${year}/9/21`,  `${year}/11/21`, `${year+1}/1/21`,
  ]
  return QI_LABELS.map((label, i) => ({
    label,
    zhuqi: allZhuqi[i],
    keqi:  allKeqi[i],
    startDesc: startDates[i],
    endDesc:   endDates[i],
  }))
}
