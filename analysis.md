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
│       │   │   └── CommonConstants.ets          #     公共常量类（数值常量、颜色数组、画布尺寸等）
│       │   │
│       │   ├── pages/
│       │   │   └── Index.ets                    #     主页面（Canvas 画布 + 底部工具栏 + 手势处理）
│       │   │
│       │   ├── view/
│       │   │   └── myPaintSheet.ets             #     半模态设置面板（笔刷/颜色/不透明度/粗细）
│       │   │
│       │   └── viewmodel/                       #     视图模型层（MVVM）
│       │       ├── DrawInvoker.ets              #       绘制命令管理器（命令模式：撤销/重做/执行）
│       │       ├── IBrush.ets                   #       笔刷接口 IBrush + 默认实现 NormalBrush
│       │       ├── IDraw.ets                    #       绘制接口 IDraw + 路径实现 DrawPath
│       │       └── Paint.ets                    #       画笔属性类（线宽、颜色、透明度）
│       │
│       └── resources/                           # ===== 应用资源 =====
│           ├── base/                            #   基础资源（默认语言）
│           │   ├── element/
│           │   │   ├── color.json               #     颜色资源（主题色、笔刷背景色、渐变色等）
│           │   │   ├── float.json               #     尺寸资源（字体、间距、圆角、滑块宽度等）
│           │   │   └── string.json              #     字符串资源（按钮标签、面板标题等）
│           │   ├── media/                       #     图标资源（SVG）
│           │   │   ├── paintbrush.svg           #       画笔图标（普通态）
│           │   │   ├── paintbrush_active.svg    #       画笔图标（激活态）
│           │   │   ├── Ballpoint.svg            #       圆珠笔图标（普通态）
│           │   │   ├── Ballpoint_active.svg     #       圆珠笔图标（激活态）
│           │   │   ├── marker.svg               #       马克笔图标（普通态）
│           │   │   ├── marker_active.svg        #       马克笔图标（激活态）
│           │   │   ├── pencils.svg              #       铅笔图标
│           │   │   ├── fountain.svg             #       钢笔图标
│           │   │   ├── laser.svg                #       激光笔图标
│           │   │   ├── rubbers.svg              #       橡皮擦图标（普通态）
│           │   │   ├── rubbers_active.svg       #       橡皮擦图标（激活态）
│           │   │   ├── recall.svg               #       撤回图标（普通态）
│           │   │   ├── recall_active.svg        #       撤回图标（激活态）
│           │   │   ├── redo.svg                 #       重做图标（普通态）
│           │   │   ├── redo_active.svg          #       重做图标（激活态）
│           │   │   ├── clear.svg                #       清空图标（普通态）
│           │   │   ├── clear_active.svg         #       清空图标（激活态）
│           │   │   ├── add.svg                  #       加号图标（粗细增加）
│           │   │   ├── minuses.svg              #       减号图标（粗细减少）
│           │   │   ├── background.png           #       背景图
│           │   │   ├── foreground.png           #       前景图
│           │   │   └── startIcon.png            #       启动图标
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

### 目录职责说明

| 目录/文件 | 层级 | 职责 |
|-----------|------|------|
| `AppScope/` | 应用层 | 全局配置与资源，跨模块共享 |
| `entry/` | 模块层 | 主功能模块，包含所有 UI 和业务逻辑 |
| `entry/ets/pages/` | 页面层 | UI 页面入口，负责布局和交互 |
| `entry/ets/view/` | 视图层 | 可复用 UI 组件（半模态面板） |
| `entry/ets/viewmodel/` | 视图模型层 | 业务逻辑与数据模型（命令模式、策略模式） |
| `entry/ets/common/` | 公共层 | 跨模块共享的常量与工具 |
| `entry/ets/entryability/` | 入口层 | 应用生命周期管理 |
| `entry/resources/` | 资源层 | 静态资源（图标、字符串、颜色、尺寸） |

---

## 1. 自由绘画

### 1.1 触摸绘制

应用的核心功能是在 Canvas 画布上通过手指触摸进行自由绘画。整个绘制流程分为三个阶段：

**触摸按下（TouchType.Down）**：
- 当用户手指触摸画布时，系统创建一条新的绘制路径 `DrawPath`，包含当前画笔属性（颜色、粗细、透明度）和一个空的 `Path2D` 路径对象
- 调用笔刷的 `down()` 方法，在路径上执行 `moveTo(x, y)`，将画笔移动到触摸起始点，但不绘制任何线条
- 此时不产生可见的绘制效果，仅记录起点坐标

**触摸移动（TouchType.Move）**：
- 当用户手指在画布上滑动时，调用笔刷的 `move()` 方法，在路径上执行 `lineTo(x, y)`，从上一个点连接一条直线到当前触摸点
- 每次移动都会触发重绘：先清空整个画布（`clearRect`），然后遍历所有已保存的历史路径逐条重绘（`drawInvoker.execute()`），最后绘制当前正在绘制的路径
- 内置防抖机制：使用 `arr` 数组记录触摸采样点（存储 `x + y` 的和），只有当采样点数量超过 4 个时才开始绘制当前路径，避免在触摸起始阶段绘制过短的杂线

**触摸抬起（TouchType.Up）**：
- 将当前绘制完成的路径添加到 `DrawInvoker` 的路径列表中永久保存
- 清空采样数组 `arr`，为下一次绘制做准备
- 触发全量重绘，确保画面与数据一致
- 启用撤回按钮（`unDoDraw = true`），禁用重做按钮（`redoDraw = false`），因为新绘制后没有可重做的操作

### 1.2 绘制原理

应用采用**保留模式（Retained Mode）**绘图：
- 所有绘制路径以 `DrawPath` 对象的形式保存在内存中，每个对象包含画笔属性（`Paint`）和路径数据（`Path2D`）
- 每次需要更新画面时，先清空整个画布，然后遍历所有路径逐条重绘
- 这种方式支持撤销/重做，但路径数量很多时性能会下降

### 1.3 线条样式

所有绘制线条的端点样式为圆形（`lineCap = 'round'`），使线条起止点呈现圆滑效果，而非方形截断。

---

## 2. 画笔模式

### 2.1 画笔工具

点击底部工具栏的"画笔"按钮进入画笔模式，此时：
- `isPaint` 设为 `true`，画笔图标切换为高亮状态（`paintbrush_active`）
- `index` 设为 `-1`，表示当前处于画笔绘制模式
- 同时弹出半模态设置面板，允许用户调整画笔参数
- 再次点击画笔按钮会切换半模态面板的显示/隐藏状态

### 2.2 橡皮擦工具

点击底部工具栏的"橡皮擦"按钮进入橡皮擦模式，此时：
- `isPaint` 设为 `false`，橡皮擦图标切换为高亮状态（`rubbers_active`）
- 画笔属性被重置为：颜色 = 白色（`#ffffff`）、粗细 = 10、透明度 = 1
- 橡皮擦的实现原理是用白色线条覆盖原有内容，在白色背景上效果等同于擦除
- 半模态设置面板不会弹出，橡皮擦使用固定的白色和粗细参数

### 2.3 模式互斥

画笔和橡皮擦是互斥的两种模式，通过 `isPaint` 状态变量控制：
- `isPaint = true`：画笔模式，底部工具栏画笔图标高亮
- `isPaint = false`：橡皮擦模式，底部工具栏橡皮擦图标高亮

---

## 3. 笔刷选择

在半模态设置面板的"笔刷"区域，提供 5 种笔刷类型：

### 3.1 圆珠笔（已实现）

- 默认选中的笔刷类型
- 不透明度固定为 100%（`alpha = 1`）
- 选中时背景色为主题蓝色（`#0A59F7`），图标为非激活态（`Ballpoint`）
- 未选中时背景色为灰色（`#D8D8D8`），图标为激活态（`Ballpoint_active`）
- 点击后设置 `isMarker = false`，`alpha = 1`，`percent = '100'`，并重新应用画笔属性

### 3.2 马克笔（已实现）

- 半透明笔刷，模拟马克笔的荧光效果
- 不透明度默认为 50%（`alpha = 0.5`），用户可通过不透明度滑块自由调节
- 选中时背景色为主题蓝色，图标为激活态（`marker_active`）
- 点击后设置 `isMarker = true`，`alpha = 0.5`，`percent = '50'`，并重新应用画笔属性

### 3.3 铅笔（仅展示）

- 有图标（`pencils`）和文字标签，但未绑定点击事件
- 点击无任何效果，背景色始终为灰色（未选中态）
- 属于预留的笔刷类型，尚未实现具体功能

### 3.4 钢笔（仅展示）

- 有图标（`fountain`）和文字标签，但未绑定点击事件
- 点击无任何效果，属于预留的笔刷类型

### 3.5 激光笔（仅展示）

- 有图标（`laser`）和文字标签，但未绑定点击事件
- 点击无任何效果，属于预留的笔刷类型

---

## 4. 颜色选择

在半模态设置面板的"颜色"区域，提供 8 种预设颜色：

| 序号 | 颜色值 | 颜色 |
|------|--------|------|
| 1 | `#E90808` | 红色 |
| 2 | `#63B959` | 绿色 |
| 3 | `#0A59F7` | 蓝色 |
| 4 | `#E56224` | 橙色 |
| 5 | `#F6C800` | 黄色 |
| 6 | `#5445EF` | 紫色 |
| 7 | `#A946F1` | 紫红色 |
| 8 | `#000000` | 黑色 |

**交互方式**：
- 8 个颜色以圆形色块排列在一行，使用 `ForEach` 遍历 `COLOR_ARR` 数组动态生成
- 每个色块的尺寸为 24vp，圆角半径为 12vp
- 点击某个色块后，将该颜色值赋给 `color` 变量，并调用 `ToggleThicknessColor()` 重新应用画笔属性
- 当前没有高亮选中颜色的视觉反馈，所有色块外观相同

---

## 5. 不透明度调节

在半模态设置面板的"不透明度"区域，提供透明度调节功能：

### 5.1 滑块控件

- 使用 `Slider` 组件，样式为 `InSet`（内嵌样式）
- 滑块范围 0~100，当前值 = `alpha * 100`
- 滑块宽度 242vp，高度 58vp
- 轨道颜色使用线性渐变：从透明蓝（`#000A59F7`）到半透明蓝（`#F70A59F7`），直观展示透明度变化
- 选中色（`selectedColor`）设为透明，不显示已选部分的高亮

### 5.2 仅马克笔可调

- **圆珠笔模式**：不透明度滑块被一个透明的 `Row` 遮罩覆盖，用户无法拖动滑块，不透明度固定为 100%
- **马克笔模式**：遮罩层不显示，用户可以自由拖动滑块调节不透明度
- 滑块 `onChange` 回调中判断 `if (this.isMarker)`，只有马克笔模式下才响应滑块变化

### 5.3 百分比显示

- 滑块右侧显示当前不透明度百分比文本，格式为 `数值%`（如 `50%`、`100%`）
- 文本区域宽度 47vp，背景色为浅灰色（`#0D000000`），圆角 12vp，居中对齐

---

## 6. 粗细调节

在半模态设置面板的"粗细"区域，提供画笔粗细调节功能：

### 6.1 滑块控件

- 使用 `Slider` 组件，范围 3~21
- 当前值绑定 `thicknessesValue`，与 `strokeWidth` 同步
- 滑块宽度 242vp
- 拖动滑块时，`onChange` 回调将值同时赋给 `thicknessesValue` 和 `strokeWidth`，并调用 `ToggleThicknessColor()` 重新应用画笔属性

### 6.2 加减按钮

- 滑块左侧为减号按钮（`minuses` 图标），点击后 `thicknessesValue -= 1`
- 滑块右侧为加号按钮（`add` 图标），点击后 `thicknessesValue += 1`
- 加减按钮的值变化会同步到 `strokeWidth` 并重新应用画笔属性
- 注意：加减按钮没有边界校验，可能将值调出 [3, 21] 范围

---

## 7. 撤销/重做

### 7.1 撤销（撤回）

- 底部工具栏第三个按钮，调用 `drawOperateUndo()` 方法
- 实现基于命令模式：从 `DrawInvoker` 的 `drawPathList` 中取出最后一条路径，移入 `redoList`
- 撤销后触发全量重绘，画面更新为去掉最后一条路径后的状态
- 撤销后启用重做按钮（`redoDraw = true`）
- 如果 `drawPathList` 为空，禁用撤回按钮（`unDoDraw = false`）
- 按钮通过 `.enabled(this.unDoDraw)` 控制可用状态，不可用时灰色显示

### 7.2 重做

- 底部工具栏第四个按钮，调用 `drawOperateRedo()` 方法
- 从 `DrawInvoker` 的 `redoList` 中取出最后一条路径，移回 `drawPathList`
- 重做后触发全量重绘，画面恢复被撤销的路径
- 重做后启用撤回按钮（`unDoDraw = true`）
- 如果 `redoList` 为空，禁用重做按钮（`redoDraw = false`）

### 7.3 状态联动

- 新绘制一条路径后，`redoList` 被清空，重做按钮禁用（新绘制使之前的撤销不可重做）
- 撤销和重做互为逆操作，按钮状态始终正确联动
- 撤回按钮图标：`recall`（不可用）/ `recall_active`（可用）
- 重做按钮图标：`redo`（不可用）/ `redo_active`（可用）

---

## 8. 清空画布

- 底部工具栏第五个按钮，调用 `clear()` 方法
- 清空 `DrawInvoker` 的 `drawPathList` 和 `redoList` 两个列表
- 触发全量重绘，由于路径列表为空，画布恢复为空白状态
- 同时禁用撤回和重做按钮（`unDoDraw = false`，`redoDraw = false`）
- 清空按钮图标切换为高亮状态（`clear_active`），`clean = true`
- 注意：清空操作不可撤销，一旦清空所有绘制历史将永久丢失

---

## 9. 双指缩放

### 9.1 缩放机制

应用支持双指捏合手势对画布进行缩放：

- Canvas 组件和上层透明 Column 均绑定了 `PinchGesture` 手势识别
- 双指手势开始时（`onActionStart`），设置 `index = 1`，进入缩放模式
- 缩放模式下，触摸绘制被阻止（`if (this.index === 1) return`），避免缩放时误绘制
- 双指移动时（`onActionUpdate`），根据手势的 `scale` 值计算新的缩放比例：`scaleValueX = pinchValueX * event.scale`
- 缩放通过 Canvas 的 `.scale()` 属性实现，属于视觉缩放，不影响画布内部坐标
- 双指抬起时（`onActionEnd`），保存当前缩放值为新的基准值（`pinchValueX = scaleValueX`），缩放模式结束

### 9.2 双层手势

- 底层 Canvas 组件绑定 `PinchGesture`，处理画布上的双指缩放
- 上层透明 Column 也绑定 `PinchGesture`，通过 `zIndex` 控制层级
- 缩放期间 `index = 1`，透明层 `zIndex = 1` 位于 Canvas 之上，拦截所有触摸事件，阻止绘制
- 非缩放时 `index = -1`，透明层 `zIndex = -1` 位于 Canvas 之下，触摸事件正常传递给 Canvas

### 9.3 缩放重绘

- 缩放过程中每次手势更新都会触发全量重绘（`clearRect` + `execute`），确保画面内容在缩放时正确显示

---

## 10. 折叠屏适配

### 10.1 折叠状态监听

- 在 `aboutToAppear()` 生命周期中，通过 `display.on('foldStatusChange')` 监听设备折叠状态变化
- 使用 try-catch 包裹监听注册，失败时通过 `hilog` 记录错误日志

### 10.2 折叠状态响应

| 折叠状态 | FoldStatus 值 | X 轴缩放 | Y 轴缩放 | 说明 |
|----------|---------------|----------|----------|------|
| 展开态 | 1 | 1.0 | 1.0 | 正常全屏显示 |
| 折叠态 | 2 | 0.5 | 1.0 | X 轴缩小一半，适配折叠屏窄屏 |

- 折叠时将 `scaleValueX` 和 `pinchValueX` 设为 0.5，画布水平方向缩小为原来的一半
- 展开时恢复为 1.0，画布恢复全尺寸
- 状态切换后触发全量重绘，确保画面正确

---

## 11. 半模态设置面板

### 11.1 面板触发

- 点击底部工具栏的"画笔"按钮时，通过 `bindSheet` 绑定的半模态弹窗弹出
- 弹出状态由 `isShow` 变量控制，使用 `$$this.isShow` 双向绑定语法
- 再次点击画笔按钮切换面板的显示/隐藏

### 11.2 面板配置

- 面板高度：550vp（由 `height` 资源指定）
- 背景色：白色
- 标题：显示"画笔"文字
- 吸吸高度（detents）：[550, 600]，定义半模态弹窗可停留的高度档位
- 面板内容为 `myPaintSheet` 自定义组件

### 11.3 面板内容

半模态面板内包含四个设置区域，从上到下依次为：

1. **笔刷选择区**：5 种笔刷类型横排展示，圆珠笔和马克笔可交互
2. **颜色选择区**：8 种预设颜色色块横排展示，点击切换颜色
3. **不透明度区**：滑块 + 百分比数字，仅马克笔模式下可操作
4. **粗细区**：减号按钮 + 滑块 + 加号按钮，调节画笔粗细

---

## 12. 画笔属性同步机制

### 12.1 属性应用流程

当用户在半模态面板中修改任何画笔参数时，调用 `ToggleThicknessColor()` 方法：

1. 创建新的 `Paint` 对象（初始值：lineWidth=0, StrokeStyle='', globalAlpha=1）
2. 设置线宽：`setStrokeWidth(this.strokeWidth)`
3. 设置颜色：`setColor(this.color)`
4. 设置透明度：`setGlobalAlpha(this.alpha)`
5. 创建新的 `NormalBrush` 笔刷实例

新的 Paint 对象通过 `@Provide` / `@Consume` 装饰器自动同步到主页面和半模态面板组件。

### 12.2 数据流向

```
myPaintSheet (子组件)
  │
  │ @Link 双向绑定: isMarker, alpha, percent, color, thicknessesValue, strokeWidth
  │ @Consume 跨组件共享: mPaint, mBrush
  │
  ▼
DrawCanvas (主页面)
  │
  │ @State 单向: isDrawing, isPaint, isShow, index, ...
  │ @Provide 共享源: mPaint, mBrush
  │
  │ 用户修改参数 ──► ToggleThicknessColor() ──► new Paint + new NormalBrush
  │                                          ──► @Provide 更新 ──► @Consume 同步
  │
  └─ 下次触摸绘制时，使用最新的 mPaint 和 mBrush 创建 DrawPath
```

### 12.3 关键特性

- 画笔属性的修改**不会**影响已绘制的路径：每条 `DrawPath` 在创建时保存了当时的 `Paint` 对象快照
- 属性修改只影响后续新绘制的路径
- 这意味着同一画布上可以存在不同颜色、粗细、透明度的线条

---

## 13. 底部工具栏

### 13.1 布局结构

- 工具栏位于页面底部，使用 `Row` 水平排列
- 5 个按钮等宽分布（`justifyContent: SpaceBetween`），垂直居中对齐（`alignItems: Center`）
- 每个按钮宽度 72vp，高度 52vp
- 工具栏 `zIndex = 10`，始终位于画布之上

### 13.2 按钮结构

每个按钮采用 `Stack` 堆叠布局，包含三层：

1. **显示层**（Column）：图标 + 文字标签，根据状态切换高亮/普通图标和颜色
2. **交互层**（Button）：透明背景的全尺寸按钮，处理点击事件

### 13.3 按钮列表

| 序号 | 名称 | 图标（普通） | 图标（激活） | 功能 |
|------|------|-------------|-------------|------|
| 1 | 画笔 | paintbrush | paintbrush_active | 切换画笔模式 + 弹出设置面板 |
| 2 | 橡皮擦 | rubbers | rubbers_active | 切换橡皮擦模式 |
| 3 | 撤回 | recall | recall_active | 撤销最后一条绘制路径 |
| 4 | 重做 | redo | redo_active | 恢复被撤销的路径 |
| 5 | 清空 | clear | clear_active | 清空所有绘制内容 |

### 13.4 状态反馈

- 每个按钮的图标和文字颜色根据当前状态动态切换
- 激活态：图标切换为 `_active` 版本，文字颜色为主题蓝色（`#0A59F7`）
- 非激活态：图标为普通版本，文字颜色为系统次要遮罩色（`mask_secondary`）
- 撤回/重做按钮额外通过 `.enabled()` 控制可交互状态，不可用时按钮不响应点击

---

## 14. 画布初始化

### 14.1 画布配置

- Canvas 尺寸：750 x 750（硬编码 `CANVAS_WIDTH`）
- 背景色：系统白色（`$r('sys.color.white')`）
- 渲染上下文：`CanvasRenderingContext2D`，启用抗锯齿（`RenderingContextSettings(true)`）

### 14.2 画笔初始值

- 线宽：3（`CommonConstants.THREE`）
- 颜色：黑色（`CommonConstants.BLACK` = `'black'`）
- 透明度：1（`CommonConstants.ONE`，完全不透明）
- 笔刷：`NormalBrush`（标准直线笔刷）

---

## 15. 重绘机制

### 15.1 触发场景

全量重绘在以下场景触发：

| 场景 | 触发方式 |
|------|----------|
| 触摸移动绘制 | `onTouch` 回调中直接调用 `clearRect` + `execute` |
| 触摸抬起完成 | `onTouch` 回调中直接调用 `clearRect` + `execute` |
| 撤销/重做操作 | 按钮 `onClick` 中调用 `clearRect` + `execute` |
| 清空画布 | 按钮 `onClick` 中调用 `clearRect` + `execute` |
| 双指缩放更新 | `onActionUpdate` 中调用 `clearRect` + `execute` |
| 双指缩放结束 | `onActionEnd` 中调用 `clearRect` + `execute` |
| 折叠屏状态变化 | `foldStatusChange` 回调中调用 `clearRect` + `execute` |
| `isDrawing` 状态变化 | `@Watch('createDraw')` 回调中用 `fillRect` 填充白色 + `execute` |

### 15.2 重绘流程

```
clearRect(0, 0, width, height)     // 清空整个画布
    │
    ▼
drawInvoker.execute(context)       // 遍历所有路径
    │
    ├─ path1.draw(context)         // 设置 lineWidth, strokeStyle, globalAlpha, lineCap
│   │                               // 调用 context.stroke(path)
│   │
├─ path2.draw(context)
│   │
├─ path3.draw(context)
│   │
└─ ...pathN.draw(context)
```

每条路径的 `draw()` 方法独立设置自己的画笔属性后绘制，因此不同路径可以有不同的颜色、粗细和透明度。
