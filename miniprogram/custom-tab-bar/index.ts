Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/home/home',         text: '今日',  icon: '☀' },
      { pagePath: '/pages/calculate/calculate',text: '推算', icon: '☯' },
      { pagePath: '/pages/knowledge/knowledge',text: '知识', icon: '📖' },
      { pagePath: '/pages/profile/profile',    text: '我的',  icon: '◎' },
    ],
  },
  methods: {
    switchTab(e: WechatMiniprogram.CustomEvent) {
      const idx  = e.currentTarget.dataset.idx as number
      const path = this.data.list[idx].pagePath
      wx.switchTab({ url: path })
    },
  },
})
