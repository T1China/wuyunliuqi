/**
 * lunar.ts — 无外部依赖版本
 * 移除 lunar-typescript，内置节气近似日期和干支生肖计算
 */

const GAN       = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const ZHI       = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const SHENGXIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']

// 24节气近似日期（公历，±1天误差）
const JIEQI_DATES = [
  { name:'小寒',  m:1,  d:5  }, { name:'大寒',  m:1,  d:20 },
  { name:'立春',  m:2,  d:4  }, { name:'雨水',  m:2,  d:19 },
  { name:'惊蛰',  m:3,  d:6  }, { name:'春分',  m:3,  d:21 },
  { name:'清明',  m:4,  d:5  }, { name:'谷雨',  m:4,  d:20 },
  { name:'立夏',  m:5,  d:6  }, { name:'小满',  m:5,  d:21 },
  { name:'芒种',  m:6,  d:6  }, { name:'夏至',  m:6,  d:21 },
  { name:'小暑',  m:7,  d:7  }, { name:'大暑',  m:7,  d:23 },
  { name:'立秋',  m:8,  d:7  }, { name:'处暑',  m:8,  d:23 },
  { name:'白露',  m:9,  d:8  }, { name:'秋分',  m:9,  d:23 },
  { name:'寒露',  m:10, d:8  }, { name:'霜降',  m:10, d:23 },
  { name:'立冬',  m:11, d:7  }, { name:'小雪',  m:11, d:22 },
  { name:'大雪',  m:12, d:7  }, { name:'冬至',  m:12, d:22 },
]

export interface LunarInfo {
  ganzhi: string
  shengxiao: string
  displayStr: string
}

export interface JieqiInfo {
  name: string
  daysUntil: number
}

export function getLunarInfo(date: Date): LunarInfo {
  const year  = date.getFullYear()
  const iGan  = ((year - 1984) % 10 + 100) % 10
  const iZhi  = ((year - 1984) % 12 + 120) % 12
  const ganzhi    = GAN[iGan] + ZHI[iZhi] + '年'
  const shengxiao = SHENGXIAO[iZhi] + '年'
  return { ganzhi, shengxiao, displayStr: ganzhi }
}

export function getNextJieqi(from?: Date): JieqiInfo | null {
  const base  = from ?? new Date()
  const year  = base.getFullYear()
  const today = base.getTime()

  for (const j of JIEQI_DATES) {
    const d = new Date(year, j.m - 1, j.d).getTime()
    const daysUntil = Math.round((d - today) / 86400000)
    if (daysUntil >= 0) return { name: j.name, daysUntil }
  }
  // 跨年取下一年第一个节气
  const j0 = JIEQI_DATES[0]
  const d0  = new Date(year + 1, j0.m - 1, j0.d).getTime()
  return { name: j0.name, daysUntil: Math.round((d0 - today) / 86400000) }
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
}

export function formatDateInput(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
