import { calculate, QiResult, WUXING_COLOR, QI_LABELS, calcWuxingWeights } from '../../utils/wuyunliuqi'
import { getLunarInfo, LunarInfo } from '../../utils/lunar'
import { lookupTerm, PopupInfo } from '../../utils/knowledge-data'

// ── 纯 CSS/WXML 五行图所需数据构建 ──
const CHART_COLORS: Record<string, string> = {
  '木': '#4ADE80', '火': '#FB7185', '土': '#FCD34D', '金': '#94BBCF', '水': '#38BDF8',
}
const ZANGFU: Record<string, [string, string]> = {
  '木': ['肝','胆'], '火': ['心','三焦'], '土': ['脾','胃'], '金': ['肺','大肠'], '水': ['肾','膀胱'],
}

interface QiNodeData {
  el: string; zang: string; fu: string
  cnt: number; active: boolean; color: string
  circleStyle: string
  ring1Style: string; ring2Style: string; ring3Style: string
}

function extractEl(s: string): string {
  for (const e of ['木','火','土','金','水']) if (s.includes(e)) return e
  return ''
}

function buildChart(result: QiResult): Record<string, QiNodeData> {
  const counts: Record<string, number> = {}
  const keys = [
    result.wuxingBase,
    extractEl(result.sitian),
    extractEl(result.zaiquan),
    extractEl(result.zhuqi),
    extractEl(result.keqi),
  ]
  for (const k of keys) if (k) counts[k] = (counts[k] || 0) + 1

  const makeNode = (el: string): QiNodeData => {
    const [zang, fu] = ZANGFU[el]
    const cnt = counts[el] || 0
    const color = CHART_COLORS[el]
    const active = cnt > 0
    // 发光强度随引用次数增加
    const g = cnt * 14
    const ga = ['00','55','77','99','bb','dd'][Math.min(cnt, 5)]
    const circleStyle = active
      ? `border-color:${color};background:radial-gradient(circle at 38% 38%,${color}55,${color}20 50%,${color}08);box-shadow:0 0 ${g}rpx ${color}${ga},0 0 ${g * 2}rpx ${color}33`
      : `border-color:${color}30;background:${color}08`
    return {
      el, zang, fu, cnt, active, color,
      circleStyle,
      ring1Style: `border-color:${color}cc`,
      ring2Style: `border-color:${color}80`,
      ring3Style: `border-color:${color}44`,
    }
  }

  return {
    fire:  makeNode('火'),
    water: makeNode('水'),
    wood:  makeNode('木'),
    earth: makeNode('土'),
    metal: makeNode('金'),
  }
}

Page({
  data: {
    birthDate:    '',
    diseaseDate:  '',
    birthResult:  null as QiResult | null,
    diseaseResult:null as QiResult | null,
    birthLunar:   null as LunarInfo | null,
    diseaseLunar: null as LunarInfo | null,
    wuxingColor:  WUXING_COLOR,
    qiLabels:     QI_LABELS,
    activeTab:    0,
    birthYangboStr:   '',
    diseaseYangboStr: '',
    birthWeights:     {} as Record<string, number>,
    diseaseWeights:   {} as Record<string, number>,
    // CSS 五行图数据
    birthChart:      {} as Record<string, QiNodeData>,
    diseaseChart:    {} as Record<string, QiNodeData>,
    fullscreenChart: {} as Record<string, QiNodeData>,  // 当前展开的图
    // 全屏状态（纯 CSS，无 canvas）
    fullscreenType: '' as '' | 'birth' | 'disease',
    chartEnterClass: '',
    // 弹窗
    popupVisible: false,
    popupInfo: null as PopupInfo | null,
  },

  onLoad(options: Record<string, string>) {
    const birth   = options.birth   || ''
    const disease = options.disease || ''
    const bd = new Date(birth)
    const dd = new Date(disease)

    const birthResult   = calculate(bd)
    const diseaseResult = calculate(dd)
    const birthLunar    = getLunarInfo(bd)
    const diseaseLunar  = getLunarInfo(dd)
    const birthChart    = buildChart(birthResult)
    const diseaseChart  = buildChart(diseaseResult)

    this.setData({
      birthDate:   birth,
      diseaseDate: disease,
      birthResult, diseaseResult,
      birthLunar,  diseaseLunar,
      birthYangboStr:   birthResult.yangboNums.join('  '),
      diseaseYangboStr: diseaseResult.yangboNums.join('  '),
      birthWeights:     calcWuxingWeights(birthResult),
      diseaseWeights:   calcWuxingWeights(diseaseResult),
      birthChart, diseaseChart,
    })
  },

  onReady() {
    setTimeout(() => this.triggerEnterAnimation(), 150)
  },

  switchTab(e: WechatMiniprogram.CustomEvent) {
    const idx = e.currentTarget.dataset.idx as number
    this.setData({ activeTab: idx, chartEnterClass: '' }, () => {
      setTimeout(() => this.triggerEnterAnimation(), 50)
    })
  },

  triggerEnterAnimation() {
    this.setData({ chartEnterClass: '' }, () => {
      setTimeout(() => this.setData({ chartEnterClass: 'chart-enter' }), 30)
    })
  },

  expandChart(e: WechatMiniprogram.CustomEvent) {
    const type = e.currentTarget.dataset.type as 'birth' | 'disease'
    const fullscreenChart = type === 'birth' ? this.data.birthChart : this.data.diseaseChart
    this.setData({ fullscreenType: type, fullscreenChart })
  },

  // 全屏关闭：纯 WebView view，catchtap 直接有效，无 canvas 干扰
  closeFullscreen() {
    this.setData({ fullscreenType: '' })
  },

  onTermTap(e: WechatMiniprogram.CustomEvent) {
    const term = e.currentTarget.dataset.term as string
    if (!term) return
    const info = lookupTerm(term)
    if (!info) return
    this.setData({ popupInfo: info, popupVisible: true })
  },

  onPopupClose() {
    this.setData({ popupVisible: false })
  },

  onShareAppMessage() {
    return {
      title: `五运六气命图 ${this.data.birthDate}`,
      path:  `/pages/result/result?birth=${this.data.birthDate}&disease=${this.data.diseaseDate}`,
    }
  },
})
