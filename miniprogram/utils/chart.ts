/**
 * chart.ts — 五运六气圆形图（能量环版）
 *
 * 五方位：上(火/南) 下(水/北) 左(木/东) 右(金/西) 中(土)
 * 能量环设计：引用次数 N → N-1 条向外扩散的光环，光晕强度随 N 增大
 */

export interface CircleChartData {
  wuxingBase: string
  sitian: string
  zaiquan: string
  zhuqi: string
  keqi: string
}

interface Circle {
  x: number; y: number; r: number
  element: string
  zang: string; fu: string
}

// 明亮图表专用配色（比 WUXING_COLOR 更亮）
const CC: Record<string, string> = {
  '木': '#4ADE80',
  '火': '#FB7185',
  '土': '#FCD34D',
  '金': '#94BBCF',
  '水': '#38BDF8',
}

const ZANGFU: Record<string, [string, string]> = {
  '木': ['肝', '胆'],
  '火': ['心', '三焦'],
  '土': ['脾', '胃'],
  '金': ['肺', '大肠'],
  '水': ['肾', '膀胱'],
}

// 能量环配置：count >= ring.minCount 时绘制，向外扩散
const ENERGY_RINGS = [
  { minCount: 2, rm: 1.28, lw: 2.2, a: 0.72 },
  { minCount: 3, rm: 1.60, lw: 1.5, a: 0.48 },
  { minCount: 4, rm: 1.95, lw: 0.9, a: 0.28 },
]

// 发光强度（shadowBlur 系数）by count
const GLOW = [0, 0.016, 0.028, 0.045, 0.068, 0.096]

function rgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${Math.min(1, Math.max(0, a))})`
}

function extractEl(s: string) {
  for (const e of ['木','火','土','金','水']) if (s.includes(e)) return e
  return ''
}

// 绘制圆角矩形路径
function pillPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = h / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

/** 点阵背景 */
function drawGrid(ctx: CanvasRenderingContext2D, size: number) {
  const sp = size * 0.055
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.028)'
  for (let x = sp * 0.5; x < size; x += sp) {
    for (let y = sp * 0.5; y < size; y += sp) {
      ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2); ctx.fill()
    }
  }
  ctx.restore()
}

/** 渐变连接线 */
function drawLines(ctx: CanvasRenderingContext2D, cx: number, cy: number, circs: Circle[]) {
  for (let i = 1; i < circs.length; i++) {
    const c = circs[i]
    const g = ctx.createLinearGradient(cx, cy, c.x, c.y)
    g.addColorStop(0,   'rgba(255,255,255,0)')
    g.addColorStop(0.35,'rgba(255,255,255,0.12)')
    g.addColorStop(0.65,'rgba(255,255,255,0.12)')
    g.addColorStop(1,   'rgba(255,255,255,0)')
    ctx.save()
    ctx.strokeStyle = g; ctx.lineWidth = 0.8
    ctx.setLineDash([3, 7])
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(c.x, c.y); ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()
  }
}

/** 绘制单个五行元素（能量环 + 核心）*/
function drawElement(
  ctx: CanvasRenderingContext2D,
  c: Circle, count: number, size: number
) {
  const col = CC[c.element] || '#fff'
  const active = count > 0
  const glow = size * (GLOW[Math.min(count, 5)] || 0)

  // ── 1. 星云背景晕（仅活跃元素）
  if (active) {
    const ng = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * 2.6)
    ng.addColorStop(0,   rgba(col, 0.10 * count))
    ng.addColorStop(0.5, rgba(col, 0.03 * count))
    ng.addColorStop(1,   rgba(col, 0))
    ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 2.6, 0, Math.PI * 2)
    ctx.fillStyle = ng; ctx.fill()
  }

  // ── 2. 能量环（向外扩散，数量=引用次数-1）
  for (const ring of ENERGY_RINGS) {
    if (count < ring.minCount) continue
    const rr = c.r * ring.rm
    ctx.save()
    ctx.shadowColor = col; ctx.shadowBlur = glow * 0.7
    ctx.beginPath(); ctx.arc(c.x, c.y, rr, 0, Math.PI * 2)
    ctx.strokeStyle = rgba(col, ring.a)
    ctx.lineWidth = ring.lw; ctx.stroke()
    ctx.restore()
  }

  // ── 3. 主圆（渐变填充 + 描边 + 发光）
  const fa = active ? 0.06 + 0.06 * count : 0.03
  const bg = ctx.createRadialGradient(c.x - c.r * 0.2, c.y - c.r * 0.2, 0, c.x, c.y, c.r)
  bg.addColorStop(0,   rgba(col, Math.min(fa * 3.5, 0.55)))
  bg.addColorStop(0.55, rgba(col, fa))
  bg.addColorStop(1,   rgba(col, 0.01))
  ctx.save()
  if (active) { ctx.shadowColor = col; ctx.shadowBlur = glow }
  ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
  ctx.fillStyle = bg; ctx.fill()
  ctx.strokeStyle = active ? col : rgba(col, 0.22)
  ctx.lineWidth = active ? 2.0 : 0.8
  ctx.globalAlpha = active ? 1 : 0.38
  ctx.stroke()
  ctx.restore()

  // ── 4. 核心光点（越多引用越大越亮）
  if (active) {
    const cr = c.r * (0.20 + 0.055 * Math.min(count, 5))
    const cg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, cr)
    cg.addColorStop(0,   rgba(col, 0.95))
    cg.addColorStop(0.55, rgba(col, 0.50))
    cg.addColorStop(1,   rgba(col, 0.05))
    ctx.save()
    ctx.shadowColor = col; ctx.shadowBlur = size * 0.022
    ctx.beginPath(); ctx.arc(c.x, c.y, cr, 0, Math.PI * 2)
    ctx.fillStyle = cg; ctx.fill()
    ctx.restore()
  }
}

/** 方位文字 */
function drawDirs(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, gap: number, R: number, size: number
) {
  const fs = Math.round(size * 0.034)
  const pad = R + size * 0.048
  const pts = [
    { x: cx,       y: cy - gap - pad, t: '南' },
    { x: cx,       y: cy + gap + pad, t: '北' },
    { x: cx - gap - pad, y: cy,       t: '西' },
    { x: cx + gap + pad, y: cy,       t: '东' },
  ]
  ctx.save()
  ctx.font = `bold ${fs}px sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(255,215,0,0.65)'
  ctx.shadowColor = 'rgba(255,215,0,0.4)'; ctx.shadowBlur = size * 0.012
  pts.forEach(p => ctx.fillText(p.t, p.x, p.y))
  ctx.restore()
}

/** 脏腑文字 */
function drawLabels(
  ctx: CanvasRenderingContext2D,
  circs: Circle[], counts: Record<string, number>, size: number
) {
  const eFS = Math.round(size * 0.044)  // 五行字
  const zFS = Math.round(size * 0.036)  // 脏名
  const fFS = Math.round(size * 0.026)  // 腑名

  for (const c of circs) {
    const col = CC[c.element] || '#fff'
    const cnt = counts[c.element] || 0
    ctx.save()
    ctx.globalAlpha = cnt > 0 ? 1 : 0.38
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

    // 五行字
    ctx.shadowColor = cnt > 0 ? col : 'transparent'
    ctx.shadowBlur  = cnt > 0 ? size * 0.018 : 0
    ctx.fillStyle = col
    ctx.font = `bold ${eFS}px sans-serif`
    ctx.fillText(c.element, c.x, c.y - zFS * 0.9)

    // 脏名
    ctx.shadowBlur = 0
    ctx.font = `bold ${zFS}px sans-serif`
    ctx.fillStyle = '#E8EAF6'
    ctx.fillText(c.zang, c.x, c.y + zFS * 0.45)

    // 腑名
    ctx.font = `${fFS}px sans-serif`
    ctx.fillStyle = 'rgba(232,234,246,0.5)'
    ctx.fillText(c.fu, c.x, c.y + zFS * 0.45 + fFS * 1.3)

    ctx.restore()
  }
}

/** 来源 pill 标签（围绕每个圆弧形分布）*/
function drawBadges(
  ctx: CanvasRenderingContext2D,
  circs: Circle[],
  srcs: Array<{ key: string; label: string }>,
  cx: number, cy: number, size: number
) {
  // 按元素分组
  const grp: Record<string, string[]> = {}
  for (const { key, label } of srcs) {
    if (!key) continue
    if (!grp[key]) grp[key] = []
    grp[key].push(label)
  }

  const bfs = Math.round(size * 0.024)
  const bPad = { x: size * 0.02, y: size * 0.01 }
  const bH = bfs + bPad.y * 2
  ctx.font = `${bfs}px sans-serif`

  for (const [el, labels] of Object.entries(grp)) {
    const c = circs.find(ci => ci.element === el)
    if (!c) continue
    const col = CC[el] || '#fff'

    // 中心元素特殊处理：朝左下斜方（避开其他圆）
    const isCenter = Math.abs(c.x - cx) < 1 && Math.abs(c.y - cy) < 1
    const baseAng = isCenter ? Math.PI * 0.65 : Math.atan2(c.y - cy, c.x - cx)
    const spread = (Math.PI * 0.20) / Math.max(labels.length - 1, 1)
    const startAng = baseAng - ((labels.length - 1) / 2) * spread
    const dist = c.r * 2.05 + size * 0.025

    labels.forEach((lbl, i) => {
      const ang = startAng + i * spread
      const bx = c.x + Math.cos(ang) * dist
      const by = c.y + Math.sin(ang) * dist
      const bw = ctx.measureText(lbl).width + bPad.x * 2

      ctx.save()
      ctx.fillStyle = rgba(col, 0.18)
      ctx.strokeStyle = rgba(col, 0.60)
      ctx.lineWidth = 0.8
      pillPath(ctx, bx - bw / 2, by - bH / 2, bw, bH)
      ctx.fill(); ctx.stroke()
      ctx.fillStyle = col; ctx.globalAlpha = 0.92
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(lbl, bx, by)
      ctx.restore()
    })
  }
}

/**
 * 主绘图函数
 * @param ctx  Canvas 2D context
 * @param data 五运六气数据
 * @param size 画布像素尺寸（正方形）
 */
export function drawQiCircle(
  ctx: CanvasRenderingContext2D,
  data: CircleChartData,
  size: number
) {
  const cx = size / 2
  const cy = size / 2
  const R   = size * 0.12
  const gap = size * 0.40

  // 背景
  ctx.clearRect(0, 0, size, size)
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.7)
  bgGrad.addColorStop(0, '#0C1829')
  bgGrad.addColorStop(1, '#060D18')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, size, size)

  drawGrid(ctx, size)

  const circs: Circle[] = [
    { x: cx,       y: cy,       r: R, element: '土', ...{zang: ZANGFU['土'][0], fu: ZANGFU['土'][1]} },
    { x: cx,       y: cy - gap, r: R, element: '火', ...{zang: ZANGFU['火'][0], fu: ZANGFU['火'][1]} },
    { x: cx,       y: cy + gap, r: R, element: '水', ...{zang: ZANGFU['水'][0], fu: ZANGFU['水'][1]} },
    { x: cx - gap, y: cy,       r: R, element: '木', ...{zang: ZANGFU['木'][0], fu: ZANGFU['木'][1]} },
    { x: cx + gap, y: cy,       r: R, element: '金', ...{zang: ZANGFU['金'][0], fu: ZANGFU['金'][1]} },
  ]

  drawLines(ctx, cx, cy, circs)

  // 统计引用次数
  const qiList = [data.wuxingBase, data.sitian, data.zaiquan, data.zhuqi, data.keqi]
  const counts: Record<string, number> = {}
  for (const q of qiList) {
    const el = extractEl(q)
    if (el) counts[el] = (counts[el] || 0) + 1
  }

  // 先画不活跃元素（底层）
  for (const c of circs) {
    if ((counts[c.element] || 0) === 0) drawElement(ctx, c, 0, size)
  }
  // 再画活跃元素（顶层，发光不被遮挡）
  for (const c of circs) {
    const cnt = counts[c.element] || 0
    if (cnt > 0) drawElement(ctx, c, cnt, size)
  }

  drawDirs(ctx, cx, cy, gap, R, size)
  drawLabels(ctx, circs, counts, size)

  const srcMap = [
    { key: data.wuxingBase,           label: '主运' },
    { key: extractEl(data.sitian),    label: '司天' },
    { key: extractEl(data.zaiquan),   label: '在泉' },
    { key: extractEl(data.zhuqi),     label: '主气' },
    { key: extractEl(data.keqi),      label: '客气' },
  ]
  drawBadges(ctx, circs, srcMap, cx, cy, size)
}
