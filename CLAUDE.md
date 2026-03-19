# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 微信小程序项目（主体开发目标）

### 技术栈

| 层级 | 选型 | 理由 |
|------|------|------|
| 开发框架 | **原生微信小程序 + TypeScript** | 调试最稳定，无跨端转译损耗 |
| UI 组件库 | **TDesign Miniprogram** (`tdesign-miniprogram`) | 腾讯官方出品，设计精美，组件丰富 |
| 圆形图可视化 | **小程序原生 Canvas 2D API** | 重写 C# GDI+ 逻辑，无需第三方依赖 |
| 年历/趋势图表 | **ECharts for 微信小程序** (`echarts-for-weixin`) | 雷达图、饼图展示五运六气分布 |
| 农历转换 | **lunar-typescript** | 比 C# ChineseLunisolarCalendar 更准确，支持节气 |
| 数据持久化 | **微信云开发 CloudBase**（可选） | 保存历史命图、病图记录 |
| 包管理 | **npm**（微信开发者工具内置构建） | — |

### 小程序目录结构（规划）

```
miniprogram/
├── app.ts / app.json / app.wxss   # 全局入口与样式
├── pages/
│   ├── index/          # 首页：日期选择（出生日期 + 发病日期）
│   ├── result/         # 结果页：文字版五运六气详情 + 李阳波数字
│   ├── chart/          # 可视化页：Canvas 同心圆框架图
│   └── about/          # 关于页：五运六气知识介绍
├── components/
│   ├── qi-circle/      # 自定义圆形图组件（封装 Canvas 绘图）
│   └── qi-badge/       # 五行元素标签徽章
├── utils/
│   ├── wuyunliuqi.ts   # 核心计算引擎（从 C# 移植）
│   ├── lunar.ts        # 农历/节气转换（基于 lunar-typescript）
│   └── chart.ts        # Canvas 绘图逻辑（同心圆图）
└── miniprogram_npm/    # npm 构建产物
```

### 开发命令

```bash
# 安装依赖（在 miniprogram/ 目录下）
cd miniprogram && npm install

# 微信开发者工具：工具 → 构建 npm（每次新增 npm 包后执行）
# 用微信开发者工具打开 miniprogram/ 目录，AppID 填测试号即可本地 demo
```

### 已创建文件清单

```
miniprogram/
├── app.ts / app.json / app.wxss      # 全局入口、路由、CSS变量
├── package.json / tsconfig.json
├── pages/
│   ├── home/       home.ts/wxml/wxss/json   # 今日首页
│   ├── calculate/  calculate.ts/wxml/wxss/json  # 日期推算页
│   ├── result/     result.ts/wxml/wxss/json     # 结果页（命图+病图+对比）
│   ├── knowledge/  knowledge.ts/wxml/wxss/json  # 知识库页
│   └── profile/    profile.ts/wxml/wxss/json    # 历史记录页
├── components/
│   └── qi-circle/  qi-circle.ts/wxml/wxss/json  # Canvas 圆形图组件
└── utils/
    ├── wuyunliuqi.ts     # 核心算法（完整移植自 C#）
    ├── lunar.ts          # 农历/节气封装（lunar-typescript）
    ├── chart.ts          # Canvas 彩色圆形图绘图逻辑
    └── knowledge-data.ts # 六气/五行知识文案静态数据
```

### C# → TypeScript 算法移植对照

核心算法全部在 `Form1.cs` 的 `wuyunliuqi` 类中，移植到 `utils/wuyunliuqi.ts`：

| C# 方法 | TS 方法 | 说明 |
|---------|---------|------|
| `getGanzhi(DateTime)` | `getGanzhi(date: Date)` | 干支，基准年 1984 |
| `getWuxing(DateTime)` | `getWuxing(date: Date)` | 五运（主运）含太过/不及 |
| `getSitian(DateTime)` | `getSitian(date: Date)` | 司天 |
| `getZaiquan(DateTime)` | `getZaiquan(date: Date)` | 在泉 |
| `getCurrentZhuqi(DateTime)` | `getCurrentZhuqi(date: Date)` | 当前主气（按月份区间） |
| `getCurrentKeqi(DateTime)` | `getCurrentKeqi(date: Date)` | 当前客气 |
| `getKeqi(DateTime)` | `getKeqi(date: Date)` | 全年6段客气列表 |
| `yangboNum(string)` (Form1) | `yangboNum(str: string)` | 李阳波数字编码 |
| `DrwaCircleQL()` (GDI+) | `drawCircleChart(ctx, data)` | Canvas 2D 重写 |

**移植关键注意点**：
- 基准年 `1984`（甲子年）不变，公式 `(year - 1984 + 6000) % 10` 直接复用
- C# 中主气区间用 `AddMonths(2)` 近似，移植时保持同样逻辑（每段约60天）
- 农历转换改用 `lunar-typescript` 的 `Lunar.fromDate(date)` 替代 `ChineseLunisolarCalendar`
- Canvas 坐标系：中医方位"南上北下"，与屏幕 Y 轴方向相同（南=下=Y增大）

## Project Overview

A Windows Forms desktop application implementing "Five Movements Six Qi" (五运六气) calculations from Traditional Chinese Medicine, based on Li Yangbo's (李阳波) system. The app takes birth and disease dates as input and generates circular framework diagrams and TCM analysis output.

## Build Commands

This is a .NET Framework 4.0 Windows Forms project. Build using MSBuild or Visual Studio:

```bash
# Debug build
msbuild "生成框架图.csproj" /p:Configuration=Debug /p:Platform="AnyCPU"

# Release build
msbuild "生成框架图.csproj" /p:Configuration=Release /p:Platform="AnyCPU"
```

Output: `bin\Debug\生成框架图.例子.exe` or `bin\Release\生成框架图.例子.exe`

There are no automated tests or linters configured.

## Architecture

All significant logic lives in [Form1.cs](Form1.cs), which contains two classes:

### `Form1` (UI Layer, lines 1–254)
- Handles date picker inputs (birth date and disease date)
- `Button1_Click()` triggers the full computation pipeline
- `ConvertCC(DateTime)` converts Gregorian dates to Chinese Lunar Calendar
- `yangboNum(string)` maps TCM element names to Li Yangbo's numerical codes
- Uses GDI+ (`Graphics`, `Bitmap`) to render circular diagrams into `PictureBox` controls
- Saves generated images to `生成的图片\` directory relative to the exe

### `wuyunliuqi` (Core TCM Logic, lines 255–934)
The calculation engine. Key methods:
- `getGanzhi(DateTime)` — returns Heavenly Stems + Earthly Branches (干支) for a year
- `getWuxing(DateTime)` — returns the Five Element (五行) for a year
- `getSitian(DateTime)` — returns the Governing Qi (司天)
- `getZaiquan(DateTime)` — returns the In-Ground Qi (在泉)
- `getCurrentZhuqi(DateTime)` — returns the Host Qi (主气) for the current month segment
- `getCurrentKeqi(DateTime)` — returns the Guest Qi (客气) for the current month segment
- `DrwaCircleQL(DateTime, List<string>)` — generates the circular qi diagram as a `Bitmap`
- `画圈圈()` — GDI+ helper that draws concentric circles
- `TextToBitmap()` — renders text labels onto the bitmap

**Base year**: 1984 (甲子年, Jiǎzǐ year) is the epoch for all cyclical calculations. The 60-year Ganzhi cycle is computed relative to this year.

**Data arrays** (class-level fields): Heavenly Stems (10 items), Earthly Branches (12 items), Six Qi types (六气), Five Elements (五行) — all defined as string arrays at the top of the `wuyunliuqi` class.

## Key Domain Concepts

- **干支 (Ganzhi)**: 60-year cycle combining 10 Heavenly Stems (天干) × 12 Earthly Branches (地支)
- **五运 (Wuyun)**: Five Movements — Wood, Fire, Earth, Metal, Water governing each year
- **六气 (Liuqi)**: Six Qi — Wind, Heat, Fire, Damp, Dryness, Cold governing seasonal segments
- **司天/在泉**: Upper/lower governing qi of a year
- **主气/客气**: Host qi (fixed seasonal) / Guest qi (yearly rotating) for each of the 6 segments
