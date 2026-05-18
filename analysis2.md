# Custom Canvas 自定义画布应用 - 功能详细介绍

---

## 0. 工程目录

```
custom-canvas-master/
├── AppScope/                                    # 应用全局作用域
│   ├── app.json5                                #   应用全局配置（包名、版本号、图标、标签）
│   └── resources/base/
│       ├── element/string.json                  #   应用级字符串资源（app_name）
│       └── media/app_icon.png                   #   应用图标
│
├── entry/                                       # 主模块（HAP 包）
│   ├── build-profile.json5                      #   模块构建配置（API 类型、混淆规则）
│   ├── oh-package.json5                         #   模块包依赖信息
│   ├── obfuscation-rules.txt                    #   代码混淆规则
│   └── src/main/
│       ├── module.json5                         #   模块配置（Ability 声明、设备类型、页面路由）
│       │
│       ├── ets/                                 # ===== ArkTS 源码 =====
│       │   ├── entryability/
│       │   │   └── EntryAbility.ets             #     应用入口 Ability（生命周期管理、加载 Index 页面）
│       │   │
│       │   ├── common/
│       │   │   └── CommonConstants.ets          #     公共常量类 + COLOR_GRAY_ROW + COLOR_GRID + hslToHex/generateGrayRow/generateColorGrid
│       │   │
│       │   ├── pages/
│       │   │   └── Index.ets                    #     主页面（双层Canvas + 底部工具栏 + 手势处理 + 作图工具面板 + 圆规交互）
│       │   │
│       │   ├── view/
│       │   │   └── myPaintSheet.ets             #     半模态设置面板（笔刷/网格选色/RGB滑块/不透明度/粗细）
│       │   │
│       │   └── viewmodel/                       #     视图模型层（MVVM）
│       │       ├── DrawInvoker.ets              #       绘制命令管理器（命令模式：撤销/重做/执行）
│       │       ├── IBrush.ets                   #       笔刷接口IBrush + NormalBrush + FountainPenBrush
│       │       ├── IDraw.ets                    #       绘制接口IDraw + DrawPath + ShapeDraw（直线/圆弧/矩形）
│       │       └── Paint.ets                    #       画笔属性类（线宽、颜色、透明度）
│       │
│       └── resources/                           # ===== 应用资源 =====
│           ├── base/                            #   基础资源（默认语言）
│           │   ├── element/
│           │   │   ├── color.json               #     颜色资源（主题色、笔刷背景色、渐变色等）
│           │   │   ├── float.json               #     尺寸资源（字体、间距、圆角、滑块宽度等）
│           │   │   └── string.json              #     字符串资源（按钮标签、面板标题、color_grid、rgb_slider等）
│           │   ├── media/                       #     图标资源（SVG）
│           │   │   ├── paintbrush.svg           #       画笔图标（普通态）
│           │   │   ├── paintbrush_active.svg    #       画笔图标（激活态）
│           │   │   ├── Ballpoint.svg            #       圆珠笔图标（普通态）
│           │   │   ├── Ballpoint_active.svg     #       圆珠笔图标（激活态）
│           │   │   ├── marker.svg               #       马克笔图标（普通态）
│           │   │   ├── marker_active.svg        #       马克笔图标（激活态）
│           │   │   ├── fountain.svg             #       钢笔图标（普通态）
│           │   │   ├── fountain_active.svg      #       钢笔图标（激活态）
│           │   │   ├── rubbers.svg              #       橡皮擦图标（普通态）
│           │   │   ├── rubbers_active.svg       #       橡皮擦图标（激活态）
│           │   │   ├── recall.svg               #       撤回图标（普通态）
│           │   │   ├── recall_active.svg        #       撤回图标（激活态）
│           │   │   ├── redo.svg                 #       重做图标（普通态）
│           │   │   ├── redo_active.svg          #       重做图标（激活态）
│           │   │   ├── clear.svg                #       清空图标（普通态）
│           │   │   ├── clear_active.svg         #       清空图标（激活态）
│           │   │   ├── add.svg                  #       加号图标
│           │   │   ├── minuses.svg              #       减号图标
│           │   │   ├── foreground.svg           #       应用图标前景（钢笔+调色板）
│           │   │   ├── background.svg           #       应用图标背景（蓝色渐变圆角矩形）
│           │   │   ├── startIcon.svg            #       启动图标（完整合成）
│           │   │   └── layered_image.json       #       分层图标配置
│           │   └── profile/
│           │       ├── main_pages.json          #     页面路由配置（注册 pages/Index）
│           │       └── backup_config.json       #     备份配置
│           │
│           ├── zh_CN/element/string.json        #   中文字符串资源
│           └── en_US/element/string.json        #   英文字符串资源
│
├── build-profile.json5                          # 项目级构建配置（SDK 版本、运行时 OS、构建模式）
├── oh-package.json5                             # 项目级包信息
├── hvigorfile.ts                                # Hvigor 构建脚本
└── LICENSE                                      # Apache License 2.0
```

---

## 1. 自由绘画

### 1.1 触摸绘制

应用的核心功能是在 Canvas 画布上通过手指触摸进行自由绘画。采用**双层 Canvas** 架构：

- **底层 Canvas（offContext）**：白色背景，显示所有已提交路径的快照，仅在路径提交/undo/redo/clear 时重绘
- **顶层 Canvas（context）**：透明背景，仅绘制当前正在书写的笔画预览

**触摸按下（TouchType.Down）**：
- 创建新的 `DrawPath`，包含当前画笔属性和空的 `Path2D` 路径对象
- 调用笔刷的 `down()` 方法，在路径上执行 `moveTo(x, y)`

**触摸移动（TouchType.Move）**：
- 调用笔刷的 `move()` 方法，在路径上添加线段
- 仅清空顶层 Canvas 并重绘当前笔画（`clearTopCanvas()` + `mPath.draw()`），不遍历历史路径
- 钢笔模式下同步速度点数据实现实时变宽预览

**触摸抬起（TouchType.Up）**：
- 将路径添加到 `DrawInvoker` 历史列表
- **增量渲染**：仅将新路径追加画到底层离屏 Canvas（`appendToOffCanvas()`），不清空不重绘历史
- 清空顶层 Canvas，笔画显示在底层上

### 1.2 增量渲染优化

- **TouchUp**：只把新路径追加到离屏 Canvas（O(1)），不重绘全部历史
- **undo/redo/clear**：全量重绘离屏 Canvas（`refreshOffCanvas()`），这些操作频率低
- 避免了钢笔路径多时每帧重绘全部历史导致的卡顿

---

## 2. 画笔模式

### 2.1 画笔工具

点击底部工具栏的"画笔"按钮进入画笔模式，弹出半模态设置面板。

### 2.2 橡皮擦工具

点击"橡皮擦"按钮，画笔属性重置为白色、粗细10、透明度1，用白色线条覆盖原有内容。

### 2.3 模式互斥

画笔和橡皮擦通过 `isPaint` 状态变量互斥控制。

---

## 3. 笔刷选择

在半模态设置面板的"笔刷"区域，提供 3 种笔刷类型：

### 3.1 圆珠笔

- 默认选中的笔刷，使用 `NormalBrush`（`lineTo` 直线连接）
- 不透明度固定为 100%

### 3.2 马克笔

- 半透明笔刷，使用 `NormalBrush`，模拟马克笔荧光效果
- 不透明度默认为 50%，可自由调节

### 3.3 钢笔

- 模拟钢笔的书写效果，使用 `FountainPenBrush`，带有笔锋粗细变化
- 基于速度感知的变宽渲染：慢速→粗笔（1.5x），快速→细笔（0.4x）
- 使用二次贝塞尔曲线平滑笔触，首尾渐细（taper）
- 不透明度默认为 100%，可自由调节

---

## 4. 钢笔（FountainPenBrush）

### 4.1 速度追踪

- 每次 `move()` 计算当前速度（距离/时间），指数移动平均平滑（SMOOTH_FACTOR=0.3）
- 每个触摸点记录坐标 + 平滑速度到 `FountainPenPoint[]`

### 4.2 变宽渲染

`DrawPath.drawFountainPen()` 逐段渲染：
1. 根据速度计算每点宽度：`widthFactor = 1.5 - normalizedVelocity * 1.1`
2. 3点移动平均平滑宽度（2次）
3. 首尾渐细（taper），前4点和后4点线性递减
4. 逐段 `lineTo` + `stroke()`，相邻段取平均宽度过渡

---

## 5. 颜色选择

### 5.1 双模式切换

颜色选择支持两种模式，通过点击"颜色"标题旁的蓝色文字切换：
- **网格选色**（colorMode=0）：10列灰度条 + 9×10色彩网格
- **RGB滑块**（colorMode=1）：R/G/B三色滑块（0-255）

两种模式通过 `syncRgbFromColor()` / `updateColorFromRgb()` 双向同步，切换时自动保持当前颜色一致。

### 5.2 网格选色

**灰度条**（`COLOR_GRAY_ROW`）：10个灰度色块，从黑到白均匀分布。

**色彩网格**（`COLOR_GRID`）：9行×10列，由 `generateColorGrid()` 生成：
- 横向：色相从0°到360°均匀分布（红→橙→黄→绿→青→蓝→紫→红）
- 纵向：明度从亮到暗（90%→10%），通过HSL色彩空间转HEX
- 选中色块显示白色边框高亮

### 5.3 RGB 三色滑块

在RGB模式下提供 R/G/B 三个滑块（0-255）：
- 红色滑块：标识色 `#E90808`
- 绿色滑块：标识色 `#63B959`
- 蓝色滑块：标识色 `#0A59F7`
- 拖动任意滑块实时合成 HEX 颜色并更新当前色和预览
- 在网格选色中点击色块时自动同步 RGB 滑块值
- 每个滑块右侧显示当前数值

### 5.4 当前颜色预览

颜色栏下方显示"当前颜色"文字 + 实时跟随的色块圆点。

---

## 6. 不透明度调节

- 使用 `Slider` 组件（`InSet` 样式），范围 0~100
- 所有笔刷和作图工具模式下均可调整不透明度
- 右侧显示百分比数值

---

## 7. 粗细调节

- 使用 `Slider` 组件，范围 3~21，步长 1
- 右侧显示当前粗细数值
- 拖动滑块即时更新画笔属性

---

## 8. 作图工具

### 8.1 独立工具栏

作图工具从画笔面板中独立出来，位于底部工具栏的第二个按钮。点击弹出独立半模态面板选择工具。

### 8.2 支持的形状

| 工具 | 图标 | 绘制方式 |
|------|------|----------|
| 直尺 | `/`（斜线） | 两点之间画直线 |
| 圆规 | `○` | 第一次点击拖动画完整圆，第二次点击拖动画圆弧 |
| 矩形 | `□` | 以按下点和抬起点为对角顶点画矩形 |

### 8.3 形状绘制流程

1. **Down**：记录起始点坐标
2. **Move**：实时预览形状（清空顶层 Canvas + 绘制当前形状）
3. **Up**：提交 `ShapeDraw` 到历史，增量追加到离屏 Canvas

### 8.4 ShapeDraw 类

`ShapeDraw extends DrawPath`，包含 `shapeType`、`startX/Y`、`endX/Y`、`startAngle`、`endAngle` 属性，`draw()` 方法根据 `shapeType` 绘制直线/圆弧/矩形。

### 8.5 圆规圆弧交互

适配触摸屏（无右键），采用两步交互模式：
- **第一次点击+拖动**：以按下点为圆心，拖动距离为半径，画完整圆（startAngle=0, endAngle=2π）
- **第二次点击+拖动**：在已有圆的基础上，拖动位置计算角度，画圆弧（startAngle和endAngle由拖动角度决定）
- `compassStep` 状态变量追踪当前步骤（0=未使用, 1=已画完整圆, 2=画圆弧中）

---

## 9. 撤销/重做

### 9.1 撤销

- 调用 `drawInvoker.undo()`，从路径列表移入重做列表
- 触发离屏 Canvas 全量重绘（`refreshOffCanvas()`）

### 9.2 重做

- 调用 `drawInvoker.redo()`，从重做列表移回路径列表
- 触发离屏 Canvas 全量重绘

### 9.3 状态联动

- 新绘制后清空重做列表，禁用重做按钮
- 撤销/重做按钮通过 `.enabled()` 控制可交互状态

---

## 10. 清空画布

- 调用 `clear()` 方法，清空路径列表和重做列表
- 触发离屏 Canvas 全量重绘，画布恢复空白
- 禁用撤回和重做按钮
- 清空操作不可撤销

---

## 11. 双指缩放

- Canvas 和上层透明 Column 均绑定 `PinchGesture`
- 缩放期间 `index=1`，透明层拦截触摸事件阻止绘制
- 缩放通过 Canvas 的 `.scale()` 属性实现，视觉缩放不影响坐标
- 缩放过程中清空顶层 Canvas，缩放结束后重绘

---

## 12. 折叠屏适配

- 通过 `display.on('foldStatusChange')` 监听折叠状态
- 折叠态：X轴缩放0.5；展开态：恢复1.0
- 状态切换后重绘离屏 Canvas

---

## 13. 半模态设置面板

### 13.1 画笔面板

- 点击"画笔"按钮弹出，包含：笔刷选择（3种）、颜色选择（网格/RGB切换+当前预览）、不透明度、粗细
- 面板高度 detents: [650, 750]

### 13.2 作图工具面板

- 点击"作图工具"按钮弹出，包含直尺/圆规/矩形三个选项
- 选择工具后面板自动关闭
- 再次点击按钮取消作图工具，恢复自由绘画

---

## 14. 底部工具栏

### 14.1 布局

- 6个按钮均匀分布（`SpaceEvenly`），每个 56vp × 52vp
- 布局顺序：画笔 → 作图工具 → 橡皮擦 → 撤回 → 重做 → 清空

### 14.2 按钮结构

每个按钮采用 `Stack` 堆叠布局：
1. **显示层**（Column）：图标 + 文字标签，根据状态切换
2. **交互层**（Button）：透明背景的全尺寸按钮

---

## 15. 双层 Canvas 渲染架构

### 15.1 架构说明

```
┌─────────────────────────────────┐
│  顶层 Canvas (context)          │  ← 透明背景，仅绘制当前笔画/形状预览
│  - Move: clearTopCanvas() + draw│
│  - Up: appendToOffCanvas() + clear
├─────────────────────────────────┤
│  底层 Canvas (offContext)       │  ← 白色背景，显示所有已提交路径快照
│  - Up: 增量追加新路径            │
│  - Undo/Redo/Clear: 全量重绘    │
└─────────────────────────────────┘
```

### 15.2 性能优势

| 场景 | 传统方式 | 双层Canvas |
|------|----------|------------|
| Move绘制 | clearRect + 遍历全部历史重绘 O(N) | clearTop + draw当前笔画 O(1) |
| TouchUp | 全量重绘 O(N) | 增量追加1条路径 O(1) |
| Undo/Redo | 全量重绘 O(N) | 全量重绘 O(N)，但频率低 |

---

## 16. 画笔属性同步机制

### 16.1 ToggleThicknessColor()

修改任何画笔参数时调用：
1. 创建新 `Paint` 对象
2. 设置线宽、颜色、透明度
3. 根据笔刷类型创建对应实例：钢笔→`FountainPenBrush`，其他→`NormalBrush`

### 16.2 数据流向

```
myPaintSheet (子组件)
  │ @Link: isMarker, isFountainPen, shapeTool, alpha, percent, color, strokeWidth
  │ @Consume: mPaint, mBrush
  │
  ▼
DrawCanvas (主页面)
  │ @State: isDrawing, isPaint, isShow, isShapeShow, ...
  │ @Provide: mPaint, mBrush
  │
  └─ 下次触摸绘制时，使用最新的 mPaint 和 mBrush 创建 DrawPath
```

### 16.3 关键特性

- 画笔属性的修改**不会**影响已绘制的路径：每条 `DrawPath` 在创建时保存了当时的 `Paint` 对象快照
- 同一画布上可以存在不同颜色、粗细、透明度的线条

---

## 17. SVG 矢量图标

### 17.1 图标设计

应用图标采用 SVG 矢量格式，由 `layered_image.json` 配置分层：

- **foreground.svg**：钢笔（金质笔尖 + 深色笔身 + 银色笔夹）+ 调色板（6色圆点）+ 墨滴 + 星光效果
- **background.svg**：蓝色渐变圆角矩形（#EBF5FB → #D6EAF8 → #AED6F1）
- **startIcon.svg**：合成完整启动图标（背景+前景一体）

### 17.2 优势

- 矢量格式，任意缩放不失真
- 图标主题呼应应用定位（画布+绘画工具）
- SVG 优先级高于 PNG，HarmonyOS 自动匹配同名 SVG 文件
