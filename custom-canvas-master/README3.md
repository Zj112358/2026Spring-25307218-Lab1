# 基于Canvas实现画布的功能

### 介绍

本示例通过Canvas实现了一个功能丰富的画布应用，支持多种笔刷（圆珠笔、马克笔、钢笔）、网格选色/RGB三色滑块选色切换、作图工具（直尺、圆、矩形、椭圆、三角形、菱形、星形、箭头、3D形体、文字）、画笔粗细和不透明度调节、撤销/重做、清空、双指缩放、文字输入/编辑、跨设备流转与分布式实时同步、一次开发多端部署（手机/平板/2in1桌面）、断点自适应布局与资源限定目录等功能。采用双层Canvas增量渲染架构，确保大量笔画下依然流畅。应用图标采用精美SVG矢量设计（钢笔+调色板）。

### 效果图预览

![](./screenshots/device/canvas.gif)

##### 使用说明

1. 进入首页后，下方有按钮栏：画笔、作图工具、橡皮擦、撤回、重做、清空。画笔默认选中，可以在空白部分进行绘画，默认粗细是3，颜色是黑色不透明。
2. 点击画笔按钮，弹出半模态弹窗，可选择笔刷类型（圆珠笔、马克笔、钢笔）、颜色（网格选色/RGB滑块切换）、不透明度和粗细。
3. 圆珠笔为默认笔刷，不透明度固定100%；马克笔默认不透明度50%，可自由调节；钢笔支持速度感知的变宽笔锋效果。
4. 颜色选择支持两种模式切换：**网格选色**（10列灰度条 + 9×10色彩网格）和**RGB滑块**（R/G/B三色滑块0-255），点击"颜色"标题旁的蓝色文字即可切换，两种模式双向同步。
5. 点击作图工具按钮，弹出作图工具面板，可选择：直尺（画直线）、圆（画圆）、矩形、椭圆、三角形、菱形、星形、箭头、3D形体（立方体/圆柱/圆锥/棱锥/球体）、文字输入。
   - 选择作图工具后拖动画布即可绘制对应形状，再次点击按钮取消作图工具恢复自由绘画。
6. **文字输入**：选择文字工具后，弹出文字输入面板，可输入内容、选择字号（中文字号/磅值列表）、粗体/斜体/颜色。点击画布放置文字，双击已有文字可重新编辑，拖拽可移动位置。
7. 粗细调节使用滑块拖动，范围3~21，右侧显示当前数值。
8. 进行绘制后，撤回按钮高亮可点击，点击后撤回上一步笔画；重做按钮高亮可点击，点击后还原上一步撤销的笔画。
9. 点击橡皮擦按钮后，手指绘画实现擦除效果；点击清空按钮清空整个画布所有绘制。
10. 双指捏合画布缩小，双指外扩画布放大，缩放时不响应绘制操作。
11. **跨设备流转**：支持HarmonyOS流转能力，可将画布状态（所有绘制路径+画笔属性）无缝流转到其他设备继续编辑。
12. **分布式实时同步**：多设备协同绘制，实时同步笔画变更，显示远程设备光标和设备名，支持冲突解决和版本历史。
13. **多端适配**：支持手机、平板、2in1桌面设备，Canvas尺寸100%自适应，工具栏/面板通过断点系统(SM/MD/LG)响应式布局，资源限定目录(sm/md/lg)提供不同断点下的图标尺寸/字号/间距值。

### 工程目录

```
├──entry/src/main/ets/
│  ├──common
│  │  ├──CommonConstants.ets         // 公共常量类 + 色彩网格生成函数
│  │  ├──ScreenInfo.ets              // 屏幕信息工具类
│  │  └──BreakpointSystem.ets        // 断点系统（SM/MD/LG + 折叠缩放）
│  ├──entryability
│  │  └──EntryAbility.ets            // 程序入口类（onContinue/onCreate/onNewWant + 窗口尺寸监听）
│  ├──pages                  
│  │  └──Index.ets                   // 首页（双层Canvas + 工具栏 + 作图面板 + 流转 + 分布式 + 断点 + 键盘）
│  ├──view   
│  │  ├──myPaintSheet.ets            // 半模态页面（笔刷/网格选色/RGB滑块/不透明度/粗细）
│  │  └──textInputSheet.ets          // 文字输入面板（字号列表/粗体/斜体/颜色）
│  └──viewmodel
│     ├──DrawInvoker.ets             // 绘制方法（撤销/重做/执行 + 序列化toJSON/fromJSON）
│     ├──IBrush.ets                  // 笔刷接口 + NormalBrush + FountainPenBrush
│     ├──IDraw.ets                   // 绘制接口 + DrawPath + ShapeDraw + TextDraw + DrawPathData
│     ├──Paint.ets                   // 绘制属性类 + PaintData
│     ├──DistributedCanvas.ets       // 分布式数据对象 + 增量同步
│     ├──RemoteCursorManager.ets     // 多用户光标管理
│     ├──ConflictResolver.ets        // OT冲突解决
│     ├──VersionHistory.ets          // 版本历史快照
│     └──DistributedFileManager.ets  // 文件保存/加载/SVG导出
├──entry/src/main/resources
│  ├──base/element/
│  │  ├──string.json                 // 字符串资源
│  │  └──float.json                  // 基础尺寸资源（所有断点资源名定义）
│  ├──sm/element/float.json          // 手机断点资源（48vp/80vp/22fp/12fp等）
│  ├──md/element/float.json          // 平板断点资源（56vp/96vp/26fp/14fp等）
│  ├──lg/element/float.json          // 桌面断点资源（64vp/112vp/30fp/16fp等）
│  └──base/media
│     ├──foreground.svg              // 应用图标前景（钢笔+调色板）
│     ├──background.svg              // 应用图标背景（蓝色渐变）
│     ├──startIcon.svg               // 启动图标（完整合成）
│     └──layered_image.json          // 分层图标配置
├──PLAN.md                            // 主演进计划
├──plan1.md                           // 多端部署计划
└──plan2.md                           // 跨设备投送计划
```

### 具体实现

1. **双层Canvas架构**：底层Canvas显示已提交路径快照（白色背景），顶层Canvas仅绘制当前笔画预览（透明背景），Move时无需遍历历史路径，性能从O(N)降到O(1)。
2. **增量渲染**：TouchUp时只将新路径追加到底层Canvas，不重绘全部历史，仅undo/redo/clear时才全量重绘。
3. **钢笔变宽渲染**：FountainPenBrush追踪触摸速度，慢速→粗笔、快速→细笔，使用二次贝塞尔曲线平滑笔触，首尾渐细。
4. **作图工具**：ShapeDraw支持直线、圆、矩形、椭圆、三角形、菱形、星形、箭头、3D形体（立方体/圆柱/圆锥/棱锥/球体），通过底部独立按钮弹出选择面板。
5. **文字输入**：TextDraw类存储文字内容/字号/粗体/斜体/颜色/位置，textInputSheet组件提供字号滚动列表（中文字号+磅值）、粗体/斜体切换、颜色选择。Canvas上双击已有文字可重新编辑，拖拽可移动。
6. **颜色选择双模式**：colorMode状态控制网格选色与RGB滑块切换，网格选色包含灰度条和HSL色彩网格，RGB滑块实时合成HEX颜色，两种模式通过syncRgbFromColor/updateColorFromRgb双向同步。
7. **橡皮擦**通过修改strokeStyle为白色实现；每条路径保存独立的Paint快照，修改画笔属性不影响已绘制路径。
8. 撤回功能将drawPathList最后一项移入redoList，重做功能移回drawPathList，清空功能清空两个列表后重绘。
9. **跨设备流转**：module.json5声明continuable:true，EntryAbility实现onContinue（序列化画布数据≤100KB）和onCreate（反序列化恢复），优雅降级超限返回REJECT。
10. **分布式实时同步**：DistributedCanvas.ets基于@ohos.data.distributedDataObject实现增量变更同步，RemoteCursorManager管理多用户光标显示，ConflictResolver基于OT算法解决并发冲突，VersionHistory维护快照历史。
11. **多端部署**：deviceTypes声明phone/tablet/2in1，Canvas尺寸100%自适应，BreakpointSystem提供SM/MD/LG三断点，@StorageProp驱动响应式布局。
12. **资源限定目录**：resources/sm/、resources/md/、resources/lg/分别提供手机/平板/桌面的尺寸值（图标48/56/64vp、按钮80/96/112vp、字号12/14/16fp等），所有硬编码数值替换为$r('app.float.xxx')引用。
13. **SVG矢量图标**：应用图标采用SVG矢量设计，前景为钢笔+调色板，背景为蓝色渐变圆角矩形，支持任意缩放不失真。

### 相关权限

不涉及。

### 约束与限制

1. 本示例仅支持标准系统上运行，支持设备：华为手机、华为平板、2in1设备。

2. HarmonyOS系统：HarmonyOS 5.0.5 Release及以上。

3. DevEco Studio版本：DevEco Studio 5.0.5 Release及以上。

4. HarmonyOS SDK版本：HarmonyOS 5.0.5 Release SDK及以上。
