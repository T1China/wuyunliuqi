// components/qi-circle/qi-circle.ts
import { drawQiCircle, CircleChartData } from '../../utils/chart'

Component({
  properties: {
    chartData: {
      type: Object,
      value: null,
    },
    canvasId: {
      type: String,
      value: 'qi-circle-canvas',
    },
  },

  lifetimes: {
    attached() {},
    ready() {
      if (this.properties.chartData) {
        this.draw()
      }
    },
  },

  observers: {
    'chartData': function(data: CircleChartData | null) {
      if (data) {
        // 等待组件渲染完毕
        setTimeout(() => this.draw(), 100)
      }
    },
  },

  methods: {
    draw() {
      const data = this.properties.chartData as CircleChartData
      if (!data) return

      const query = this.createSelectorQuery()
      query.select(`#${this.properties.canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]?.node) return
          const canvas = res[0].node
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
          const dpr  = wx.getSystemInfoSync().pixelRatio
          const size = res[0].width
          canvas.width  = size * dpr
          canvas.height = size * dpr
          ctx.scale(dpr, dpr)
          drawQiCircle(ctx, data, size)
        })
    },
  },
})
