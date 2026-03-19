import { calculate, QiResult, WUXING_COLOR, QI_LABELS, getYearSegments } from '../../utils/wuyunliuqi'
import { getLunarInfo, getNextJieqi, formatDate, LunarInfo, JieqiInfo } from '../../utils/lunar'
import { lookupTerm, PopupInfo } from '../../utils/knowledge-data'

Page({
  data: {
    today: '',
    lunarInfo: null as LunarInfo | null,
    qiResult: null as QiResult | null,
    nextJieqi: null as JieqiInfo | null,
    wuxingColor: WUXING_COLOR,
    qiLabels: QI_LABELS,
    currentYear: 0,
    yearSegments: [] as any[],
    popupVisible: false,
    popupInfo: null as PopupInfo | null,
  },

  onLoad() { this.refresh() },
  onShow() {
    this.refresh()
    if (typeof this.getTabBar === 'function') this.getTabBar().setData({ selected: 0 })
  },

  refresh() {
    const now    = new Date()
    const result = calculate(now)
    const lunar  = getLunarInfo(now)
    const jieqi  = getNextJieqi(now)
    const segs   = getYearSegments(now).map((s: any, i: number) => ({
      ...s, active: i === result.zhuqiIndex,
    }))
    this.setData({
      today:        formatDate(now),
      lunarInfo:    lunar,
      qiResult:     result,
      nextJieqi:    jieqi,
      currentYear:  now.getFullYear(),
      yearSegments: segs,
    })
  },

  goCalculate() {
    wx.switchTab({ url: '/pages/calculate/calculate' })
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
})
