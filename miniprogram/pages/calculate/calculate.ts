import { calculate } from '../../utils/wuyunliuqi'
import { getLunarInfo, formatDateInput } from '../../utils/lunar'

Page({
  data: {
    birthDate:    '',
    diseaseDate:  '',
    birthGanzhi:  '',
    diseaseGanzhi:'',
    today:        '',
  },

  onLoad() {
    const now = new Date()
    const fmt = formatDateInput(now)
    this.setData({ birthDate: fmt, diseaseDate: fmt, today: fmt })
    this.updateGanzhi(fmt, fmt)
  },

  onShow() {
    if (typeof this.getTabBar === 'function') this.getTabBar().setData({ selected: 1 })
  },

  updateGanzhi(birth: string, disease: string) {
    const bg = getLunarInfo(new Date(birth)).ganzhi
    const dg = getLunarInfo(new Date(disease)).ganzhi
    this.setData({ birthGanzhi: bg, diseaseGanzhi: dg })
  },

  onBirthChange(e: WechatMiniprogram.CustomEvent) {
    const v = e.detail.value as string
    this.setData({ birthDate: v, birthGanzhi: getLunarInfo(new Date(v)).ganzhi })
  },

  onDiseaseChange(e: WechatMiniprogram.CustomEvent) {
    const v = e.detail.value as string
    this.setData({ diseaseDate: v, diseaseGanzhi: getLunarInfo(new Date(v)).ganzhi })
  },

  onGenerate() {
    if (!this.data.birthDate || !this.data.diseaseDate) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return
    }
    // 保存历史
    try {
      const list: any[] = wx.getStorageSync('history') || []
      list.unshift({ birth: this.data.birthDate, disease: this.data.diseaseDate, ts: Date.now() })
      wx.setStorageSync('history', list.slice(0, 10))
    } catch {}

    wx.navigateTo({
      url: `/pages/result/result?birth=${this.data.birthDate}&disease=${this.data.diseaseDate}`
    })
  },
})
