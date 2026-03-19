// pages/profile/profile.ts
Page({
  data: {
    historyList: [] as Array<{birth:string; disease:string; ts:number; dateStr:string}>,
  },

  onShow() {
    this.loadHistory()
    if (typeof this.getTabBar === 'function') this.getTabBar().setData({ selected: 3 })
  },

  loadHistory() {
    try {
      const list: Array<{birth:string; disease:string; ts:number}> =
        wx.getStorageSync('history') || []
      const historyList = list.map(item => ({
        ...item,
        dateStr: new Date(item.ts).toLocaleDateString('zh-CN', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit'
        }),
      }))
      this.setData({ historyList })
    } catch {
      this.setData({ historyList: [] })
    }
  },

  goResult(e: WechatMiniprogram.CustomEvent) {
    const { birth, disease } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/result/result?birth=${birth}&disease=${disease}` })
  },

  clearHistory() {
    wx.showModal({
      title: '清除记录',
      content: '确认清除所有历史推算记录？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('history')
          this.setData({ historyList: [] })
        }
      }
    })
  },
})
