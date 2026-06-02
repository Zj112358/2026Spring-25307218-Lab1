# Custom Canvas 一次开发多端部署计划

> 最后更新：2026-06-01 | 版本：v2.1.0

---

## 一、当前现状分析

| 维度 | 现状 | 问题 |
|------|------|------|
| 目标设备 | 仅 `phone`（module.json5） | 未声明 tablet/2in1 支持 |
| Canvas 尺寸 | `CANVAS_WIDTH = 750` 固定常量 | 平板/桌面端显示过小，无法撑满屏幕 |
| 工具栏布局 | 底部固定 Row + 固定宽度按钮 | 平板横屏空间浪费，桌面端体验差 |
| 画笔面板 | 半模态弹窗（bindSheet） | 平板大屏下半模态弹窗遮挡画布 |
| 折叠屏适配 | 硬编码 `scaleValueX = 0.5` | 仅覆盖折叠态，未覆盖展开态全屏 |
| 触摸交互 | 仅支持单指+双指缩放 | 未适配手写笔压感、鼠标滚轮 |
| 资源限定 | 无 size/density 限定目录 | 不同密度/尺寸屏幕下图标/间距不优 |
| viewmodel 层 | 纯逻辑，无 UI 依赖 | 天然可复用，无需改造 |

---

## 二、HarmonyOS 多端部署核心架构：1 + N + X

```
┌─────────────────────────────────────────────┐
│  1 — 公共基础层（设备无关，完全复用）          │
│  ├── viewmodel/DrawInvoker.ets              │
│  ├── viewmodel/IBrush.ets                   │
│  ├── viewmodel/IDraw.ets                    │
│  ├── viewmodel/Paint.ets                    │
│  └── common/CommonConstants.ets             │
├─────────────────────────────────────────────┤
│  N — 多设备 UI 层（按设备类型差异化）          │
│  ├── pages/phone/Index.ets    （手机竖屏）    │
│  ├── pages/tablet/Index.ets   （平板横屏）    │
│  └── pages/desktop/Index.ets  （2in1 桌面）   │
├─────────────────────────────────────────────┤
│  X — 设备特有能力层（按能力按需加载）          │
│  ├── capability/PencilPressure.ets（手写笔）  │
│  ├── capability/MouseWheel.ets  （鼠标滚轮）  │
│  └── capability/DragDrop.ets    （拖拽文件）  │
└─────────────────────────────────────────────┘
```

---

## 三、路线图总览

```
Phase 1 (配置与基础)  ──►  Phase 2 (响应式布局)  ──►  Phase 3 (交互适配)  ──►  Phase 4 (进阶优化)
   ✅ 已完成               ✅ 已完成               ✅ 已完成             ✅ 已完成
```

---

## 四、Phase 1 — 配置与基础适配（优先级：🔴 高）

> 目标：最小改动让应用在多设备上可运行、不崩溃

### 4.1 扩展设备类型声明
- **现状**：`module.json5` 中 `deviceTypes: ["phone"]`
- **任务**：
  - [x] 将 `deviceTypes` 扩展为 `["phone", "tablet", "2in1"]`
  - [x] 验证应用在三种设备上可安装启动
- **涉及文件**：`entry/src/main/module.json5`

### 4.2 Canvas 尺寸动态化
- **现状**：`CommonConstants.CANVAS_WIDTH = 750` 硬编码，Index.ets 中 Canvas 组件使用此固定值
- **任务**：
  - [x] 新增 `ScreenInfo.ets` 工具类，通过 `display.getDefaultDisplaySync()` 获取屏幕宽高（vp）
  - [x] Canvas 组件改为 `'100%'` 宽高，或基于 ScreenInfo 动态计算
  - [x] 移除 `CANVAS_WIDTH` 固定常量（或保留仅作默认值）
  - [x] 确保 `refreshOffCanvas()` / `clearTopCanvas()` 使用实际 canvas 尺寸
- **涉及文件**：`CommonConstants.ets`、`Index.ets`、新增 `common/ScreenInfo.ets`

### 4.3 折叠屏适配改造
- **现状**：硬编码 `scaleValueX = 0.5`，仅处理折叠态
- **任务**：
  - [x] 基于 `display.getDefaultDisplaySync()` 的实际宽高动态计算缩放比
  - [x] 折叠屏展开态恢复全屏（当前已实现 `scaleValueX = 1`）
  - [x] 折叠屏半折叠态（态3）适配：按实际显示区域比例缩放
  - [x] 使用 `display.on('foldStatusChange')` + `display.getFoldDisplayStatus()` 获取折叠区域信息
- **涉及文件**：`Index.ets`、`common/ScreenInfo.ets`

---

## 五、Phase 2 — 响应式布局（优先级：🔴 高）

> 目标：UI 布局根据屏幕尺寸自动调整，手机/平板/桌面各有最优布局

### 5.1 断点系统引入
- **任务**：
  - [x] 新增 `common/BreakpointSystem.ets`，定义断点枚举与计算逻辑
  - [x] 断点定义：sm（<600vp 手机）、md（600~840vp 平板竖屏）、lg（>840vp 平板横屏/桌面）
  - [x] 在 `aboutToAppear` 中计算当前断点，监听屏幕尺寸变化动态更新
  - [x] 使用 `@StorageProp('currentBreakpoint')` 全局共享断点状态
- **涉及文件**：新增 `common/BreakpointSystem.ets`，修改 `Index.ets`

### 5.2 工具栏响应式改造
- **现状**：底部固定 Row，6个按钮均分
- **任务**：
  - [x] sm 断点：保持底部 Row 布局（当前样式）
  - [x] md 断点：底部 Row 但按钮间距加大，图标/文字更大
  - [x] lg 断点：改为左侧垂直 ToolBar + 右侧属性面板，画布占满剩余空间
  - [x] 使用 `GridRow`/`GridCol` 栅格系统实现断点切换
- **涉及文件**：`Index.ets`、新增 `view/ToolBar.ets`

### 5.3 画笔面板响应式改造
- **现状**：半模态弹窗（bindSheet），固定高度 650~750
- **任务**：
  - [x] sm 断点：保持半模态弹窗
  - [x] md 断点：半模态弹窗高度按屏幕比例计算
  - [x] lg 断点：改为右侧常驻侧边面板，不遮挡画布
  - [x] 面板内部布局也需响应式（颜色网格列数、滑块宽度等）
- **涉及文件**：`myPaintSheet.ets`、`Index.ets`

### 5.4 资源限定目录
- **任务**：
  - [x] 新增 `resources/base/element/` 下的尺寸资源，按断点提供不同值
  - [x] 图标资源：为高密度屏提供更高分辨率 SVG（当前 SVG 矢量已适配，主要补间距/字号）
  - [x] 使用 `$r('app.float.xxx')` 替代硬编码数值，方便多设备覆盖
- **已完成替换**：
  - **Index.ets**：tool_icon_size(48→48/56/64), tool_btn_width(80→80/96/112), tool_sub_icon_size(24→24/28/32), tool_icon_font(22→22/26/30), tool_label_font(12→12/14/16), tool_title_font(16→16/18/20), tool_small_font(11→11/13/14), tool_border_radius(24→24/28/32), tool_margin_top(6→6/8/10), small_icon_width(28→28/32/36), sync_indicator_size(8→8/10/12), sync_font(12→12/14/16), cursor_size(12→12/14/16), cursor_name_font(10→10/12/14)
  - **myPaintSheet.ets**：color_grid_width(26→26/30/34), color_grid_height(20→20/24/28), rgb_label_font(12→12/14/16), rgb_label_width(16→16/20/24), rgb_value_font(11→11/13/14), rgb_value_width(28→28/32/36), color_preview_size(18→18/22/26), color_preview_radius(9→9/11/13)
  - **textInputSheet.ets**：text_area_height(80→80/100/120), text_area_font(16→16/18/20), font_list_item_font(14→14/16/18), font_list_item_height(30→30/36/42), font_list_height(120→120/144/168), font_list_width(80→80/96/112), bold_btn_width(48→48/56/64), bold_btn_height(36→36/42/48), bold_btn_radius(8→8/10/12), bold_btn_font(18→18/20/22)
- **涉及文件**：`resources/` 目录、`Index.ets`、`myPaintSheet.ets`、`textInputSheet.ets`

---

## 六、Phase 3 — 交互适配（优先级：🟡 中）

> 目标：不同设备使用最适合的交互方式

### 6.1 手写笔压感支持
- **任务**：
  - [x] 监听 `TouchType.Down` 时判断 `event.touches[0].toolType` 是否为 `TouchToolType.Stylus`
  - [x] 手写笔模式：读取 `event.touches[0].force`（压力值 0~1）动态调整线宽
  - [x] 手写笔倾斜角：读取 `event.touches[0].tiltX/Y` 模拟钢笔笔锋方向
  - [x] 手机触控模式保持当前逻辑不变
- **涉及文件**：`Index.ets`、`IBrush.ets`（新增 `StylusBrush`）

### 6.2 鼠标交互适配
- **任务**：
  - [x] 鼠标右键：弹出上下文菜单（撤销/重做/清空/删除/复制）
  - [x] 鼠标滚轮：缩放画布（替代双指缩放）
  - [x] 鼠标中键拖拽：平移画布
  - [x] 鼠标悬停：显示光标样式（画笔/橡皮/移动/十字）
  - [x] 使用 `.mouseStyle()` 和 `onMouseEvent` 实现
- **涉及文件**：`Index.ets`、新增 `capability/MouseInteraction.ets`

### 6.3 键盘快捷键
- **任务**：
  - [x] Ctrl+Z：撤销
  - [x] Ctrl+Shift+Z / Ctrl+Y：重做
  - [x] Delete/Backspace：删除选中
  - [x] Ctrl+A：全选
  - [x] Escape：取消选择
  - [x] 使用 `onKeyEvent` 实现
- **涉及文件**：`Index.ets`

### 6.4 多窗口/自由窗口适配
- **任务**：
  - [x] 监听窗口尺寸变化（`window.on('windowSizeChange')`）
  - [x] 自由窗口模式下画布和工具栏动态重排
  - [x] 窗口最小尺寸限制（防止 UI 溢出）
- **涉及文件**：`EntryAbility.ets`、`Index.ets`

---

## 七、Phase 4 — 进阶优化（优先级：🟢 低）

> 目标：充分发挥大屏设备优势，提升专业体验

### 7.1 平板多面板布局
- [x] lg 断点实现三栏布局：左侧工具栏 + 中间画布 + 右侧属性面板
- [x] 属性面板常驻显示：笔刷类型/颜色/粗细/不透明度/图层
- [x] 面板可折叠/展开
- [x] 画布区域支持全屏模式（隐藏面板）

### 7.2 分屏/平行视界适配
- [x] 支持半屏模式运行
- [x] 画布在半屏下保持可用（工具栏精简为图标）
- [x] 支持平行视界下左右分屏操作

### 7.3 拖拽交互
- [x] 支持从文件管理器拖拽图片到画布
- [x] 支持从画布拖拽选中内容到其他应用
- [x] 使用 `@kit.AbilityKit` 的 `DragBehavior` 实现

### 7.4 高刷新率适配
- [x] 检测屏幕刷新率（`display.getDefaultDisplaySync().refreshRate`）
- [x] 120Hz 屏幕下优化 Canvas 渲染频率
- [x] 触摸采样率适配（高采样率下减少冗余点）

### 7.5 无障碍适配
- [x] 为工具按钮添加 `accessibilityText`/`accessibilityDescription`
- [x] 画布区域添加无障碍节点（描述画布内容）
- [x] 支持屏幕阅读器朗读当前工具/颜色/粗细状态
- [x] 高对比度模式下颜色方案适配

---

## 八、技术实现要点

### 8.1 断点计算核心代码

```typescript
// common/BreakpointSystem.ets
export enum BreakpointType { SM, MD, LG }

export class BreakpointSystem {
  static readonly SM_MAX = 600;
  static readonly MD_MAX = 840;

  static calculate(widthVp: number): BreakpointType {
    if (widthVp < this.SM_MAX) return BreakpointType.SM;
    if (widthVp < this.MD_MAX) return BreakpointType.MD;
    return BreakpointType.LG;
  }
}
```

### 8.2 屏幕信息获取核心代码

```typescript
// common/ScreenInfo.ets
import { display } from '@kit.ArkUI';

export class ScreenInfo {
  static getWidthVp(): number {
    let d = display.getDefaultDisplaySync();
    return d.width / d.densityPixels;
  }
  static getHeightVp(): number {
    let d = display.getDefaultDisplaySync();
    return d.height / d.densityPixels;
  }
}
```

### 8.3 响应式布局核心代码

```typescript
// Index.ets 中
@StorageProp('currentBreakpoint') currentBp: string = 'sm';

build() {
  if (this.currentBp === 'lg') {
    this.buildDesktopLayout()   // 三栏：工具栏 + 画布 + 属性面板
  } else if (this.currentBp === 'md') {
    this.buildTabletLayout()    // 画布 + 底部加大工具栏
  } else {
    this.buildPhoneLayout()     // 当前布局
  }
}
```

### 8.4 手写笔压感核心代码

```typescript
// TouchDown / TouchMove 中
if (event.touches[0].toolType === TouchToolType.Stylus) {
  let force = event.touches[0].force;  // 0~1
  this.mPaint.setStrokeWidth(this.strokeWidth * (0.5 + force * 1.5));
}
```

---

## 九、改造优先级矩阵

| 任务 | 影响范围 | 工作量 | 优先级 | 依赖 |
|------|----------|--------|--------|------|
| 4.1 扩展设备类型 | module.json5 | 0.5天 | 🔴 P0 | 无 |
| 4.2 Canvas 尺寸动态化 | Index.ets + CommonConstants | 1天 | 🔴 P0 | 无 |
| 4.3 折叠屏改造 | Index.ets | 1天 | 🔴 P0 | 4.2 |
| 5.1 断点系统 | 新增 + Index.ets | 1天 | 🔴 P1 | 4.2 |
| 5.2 工具栏响应式 | Index.ets | 2天 | 🔴 P1 | 5.1 |
| 5.3 画笔面板响应式 | myPaintSheet.ets | 1.5天 | 🟡 P2 | 5.1 |
| 5.4 资源限定目录 | resources/ | 1天 | 🟡 P2 | 5.1 |
| 6.1 手写笔压感 | Index.ets + IBrush.ets | 2天 | 🟡 P2 | 4.2 |
| 6.2 鼠标交互 | Index.ets | 2天 | 🟡 P2 | 5.2 |
| 6.3 键盘快捷键 | Index.ets | 1天 | 🟡 P2 | 无 |
| 6.4 多窗口适配 | EntryAbility + Index.ets | 1天 | 🟢 P3 | 5.2 |
| 7.1 多面板布局 | Index.ets | 3天 | 🟢 P3 | 5.2 + 5.3 |
| 7.2 分屏适配 | Index.ets | 1.5天 | 🟢 P3 | 6.4 |
| 7.3 拖拽交互 | Index.ets | 2天 | 🟢 P4 | 6.2 |
| 7.4 高刷新率 | Index.ets | 1天 | 🟢 P4 | 4.2 |
| 7.5 无障碍 | Index.ets + resources | 2天 | 🟢 P4 | 5.2 |

---

## 十、版本里程碑

| 版本 | 阶段 | 核心交付 | 目标日期 |
|------|------|----------|----------|
| **v1.1.0** | Phase 1 | 多设备可运行 + Canvas 自适应 + 折叠屏完善 | - |
| **v1.2.0** | Phase 2 | 断点系统 + 工具栏/面板响应式 + 资源限定 | - |
| **v1.3.0** | Phase 3 | 手写笔 + 鼠标 + 键盘 + 多窗口 | - |
| **v2.0.0** | Phase 4 | 三栏布局 + 分屏 + 拖拽 + 高刷新率 + 无障碍 | - |

---

## 十一、验证清单

每完成一个 Phase，需在以下设备/模式上验证：

| 验证项 | 手机竖屏 | 手机横屏 | 平板竖屏 | 平板横屏 | 桌面窗口 | 折叠屏 |
|--------|----------|----------|----------|----------|----------|--------|
| 应用启动 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Canvas 渲染 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 画笔绘制 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 工具栏可用 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 画笔面板可用 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 撤销/重做 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 缩放正常 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 选择/删除 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 无 UI 溢出 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## 十二、更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-05-26 | 初始版本：基于项目现状制定四阶段多端部署计划，识别16项改造任务 |
| 2026-05-30 | Phase 1-4 全部完成：设备扩展+Canvas动态化+断点系统+响应式+手写笔+鼠标+键盘+多窗口 |
| 2026-06-01 | 补充：横竖屏自动适配+工具栏收缩+Stack浮层布局+hitTestBehavior+onReady重绘+工具栏间隔自适配+SM断点隐藏标签 |

---

## 十三、如何使用本计划

1. **按 Phase 顺序推进**：每个 Phase 内按优先级矩阵（P0→P4）执行
2. **勾选任务**：完成一项后将 `[ ]` 改为 `[x]`，并更新"最后更新"日期
3. **验证清单**：每完成一个 Phase 后，按验证清单在多设备上逐项检查
4. **新增任务**：在对应 Phase 下新增条目，标注优先级
5. **定期回顾**：建议每两周回顾一次，调整优先级和里程碑
6. **版本发布**：完成一个 Phase 后，更新版本号和更新日志
