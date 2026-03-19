// pages/knowledge/knowledge.ts
import { LIUQI_DATA, WUXING_DATA, YANGBO_INTRO, GANZHI_INTRO, LiuqiInfo, WuxingInfo } from '../../utils/knowledge-data'

Page({
  data: {
    activeTab: 0,   // 0=六气, 1=五行, 2=理论
    liuqiList: [] as LiuqiInfo[],
    wuxingList: [] as WuxingInfo[],
    yangboIntro: '',
    ganzhiIntro: '',
    expandedLiuqi: -1,
    expandedWuxing: -1,
  },

  onLoad() {
    this.setData({
      liuqiList: LIUQI_DATA,
      wuxingList: WUXING_DATA,
      yangboIntro: YANGBO_INTRO,
      ganzhiIntro: GANZHI_INTRO,
    })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') this.getTabBar().setData({ selected: 2 })
  },

  switchTab(e: WechatMiniprogram.CustomEvent) {
    this.setData({ activeTab: e.currentTarget.dataset.idx, expandedLiuqi: -1, expandedWuxing: -1 })
  },

  toggleLiuqi(e: WechatMiniprogram.CustomEvent) {
    const idx = e.currentTarget.dataset.idx
    this.setData({ expandedLiuqi: this.data.expandedLiuqi === idx ? -1 : idx })
  },

  toggleWuxing(e: WechatMiniprogram.CustomEvent) {
    const idx = e.currentTarget.dataset.idx
    this.setData({ expandedWuxing: this.data.expandedWuxing === idx ? -1 : idx })
  },
})
