# Custom Canvas 跨设备投送计划

> 最后更新：2026-05-30 | 版本：v1.0.0

---

## 一、项目现状分析

| 维度 | 现状 | 问题 |
|------|------|------|
| 流转能力 | 未声明 `continuable` | 无法触发系统级分布式流转 |
| 数据序列化 | DrawPath/ShapeDraw/TextDraw 无 toJSON/fromJSON | Path2D 对象不可直接序列化 |
| 分布式数据同步 | 未接入 | 无法实时同步画布状态 |
| 设备发现 | 未配置 | 无法被超级终端发现 |
| 状态恢复 | 无 onContinue/onRestore 实现 | 迁移后画布空白 |

---

## 二、HarmonyOS 跨设备投送技术体系

```
┌───────────────────────────────────────────────────────┐
│  层级 1 — 系统级流转（零代码触发）                       │
│  ├── 超级终端：设备靠近自动发现                          │
│  ├── 流转入口：右上角下滑 → 选择设备 → 流转              │
│  └── 前提：module.json5 中 continuable: true           │
├───────────────────────────────────────────────────────┤
│  层级 2 — UIAbility 流转（状态迁移）                     │
│  ├── onContinue：迁出端序列化状态                        │
│  ├── onCreate/onRestore：迁入端反序列化恢复              │
│  └── 核心：DrawPath 全量序列化/反序列化                  │
├───────────────────────────────────────────────────────┤
│  层级 3 — 分布式数据同步（实时协作）                      │
│  ├── distributedDataObject：画布数据实时同步              │
│  ├── 数据变更回调：远端变更自动更新本地画布                │
│  └── 冲突解决：Last-Write-Wins 策略                     │
├───────────────────────────────────────────────────────┤
│  层级 4 — 分布式文件（大文件共享）                        │
│  ├── 用户保存画布为文件后跨设备访问                       │
│  └── 分布式文件系统自动同步                              │
└───────────────────────────────────────────────────────┘
```

---

## 三、路线图总览

```
Phase 1 (序列化基础)  ──►  Phase 2 (UIAbility流转)  ──►  Phase 3 (实时同步)  ──►  Phase 4 (协作增强)
   ▲ 当前阶段                 近期目标                   中期目标               远期目标
```

---

## 四、Phase 1 — 序列化基础（优先级：🔴 高）

> 目标：让 DrawPath/ShapeDraw/TextDraw 可序列化，为所有跨设备功能提供数据基础

### 4.1 DrawPath 序列化
- **现状**：DrawPath 包含 Path2D 对象，Path2D 不可直接 JSON.stringify
- **任务**：
  - [ ] 在 DrawPath 中新增 `points: Array<{x, y}>` 存储原始触摸点
  - [ ] 在 TouchDown/TouchMove 中记录触摸点到 DrawPath.points
  - [ ] 实现 `toJSON(): Record<string, Object>` 方法，序列化 points/paint/offsetX/Y/rotation
  - [ ] 实现 `static fromJSON(data): DrawPath` 方法，反序列化重建 Path2D
- **涉及文件**：`IDraw.ets`（DrawPath 类）、`Index.ets`（触摸记录）
- **预估工作量**：1.5天

### 4.2 ShapeDraw 序列化
- **任务**：
  - [ ] 实现 `toJSON()` 包含 shapeType/startX/startY/endX/endY/paint/offsetX/Y/rotation
  - [ ] 实现 `static fromJSON()` 重建 ShapeDraw 并调用 computeBounds
- **涉及文件**：`IDraw.ets`（ShapeDraw 类）
- **预估工作量**：0.5天

### 4.3 TextDraw 序列化
- **任务**：
  - [ ] 实现 `toJSON()` 包含 text/x/y/fontSize/fontWeight/fontStyle/paint/offsetX/Y/rotation
  - [ ] 实现 `static fromJSON()` 重建 TextDraw 并调用 computeTextBounds
- **涉及文件**：`IDraw.ets`（TextDraw 类）
- **预估工作量**：0.5天

### 4.4 DrawInvoker 批量序列化
- **任务**：
  - [ ] 实现 `serializeAll(): string` — 遍历 drawPathList，按类型调用 toJSON，返回 JSON 字符串
  - [ ] 实现 `deserializeAll(json: string)` — 解析 JSON，按类型字段调用对应 fromJSON，重建 drawPathList
  - [ ] 每个 DrawPath 的 toJSON 中增加 `type` 字段（'drawpath'/'shapedraw'/'textdraw'）用于反序列化分发
- **涉及文件**：`DrawInvoker.ets`
- **预估工作量**：1天

### 4.5 Paint 序列化
- **任务**：
  - [ ] 实现 `toJSON()` 包含 StrokeStyle/lineWidth/globalAlpha/fillStyle
  - [ ] 实现 `static fromJSON()`
- **涉及文件**：`Paint.ets`
- **预估工作量**：0.5天

---

## 五、Phase 2 — UIAbility 流转（优先级：🔴 高）

> 目标：实现系统级分布式流转，用户在设备A画完，流转到设备B继续编辑

### 5.1 声明流转能力
- **任务**：
  - [ ] `module.json5` 中为 EntryAbility 添加 `"continuable": true`
  - [ ] 验证超级终端中可发现本应用
- **涉及文件**：`module.json5`
- **预估工作量**：0.5天

### 5.2 实现 onContinue（迁出端）
- **任务**：
  - [ ] 在 `EntryAbility.ets` 中重写 `onContinue(wantParam)` 方法
  - [ ] 从 DrawCanvas 组件获取当前画布状态（通过 AppStorage 或全局变量）
  - [ ] 将画布状态序列化后写入 `wantParam`
  - [ ] 序列化内容包括：
    - `drawData`：DrawInvoker.serializeAll() 的结果
    - `selectedIndex`：当前选中索引
    - `scaleValueX/Y`：当前缩放
    - `offsetX/Y`：画布偏移
    - `shapeTool`：当前工具
    - `isPaint/isEraser/isMarker/isFountainPen`：工具状态
    - `mPaint`：当前画笔属性
  - [ ] 返回 `AbilityConstant.OnContinueResult.AGREE`
- **涉及文件**：`EntryAbility.ets`、`Index.ets`
- **预估工作量**：1.5天

### 5.3 实现 onRestore（迁入端）
- **任务**：
  - [ ] 在 `EntryAbility.ets` 中重写 `onRestoreData(wantParam)` 方法
  - [ ] 从 `wantParam` 中读取序列化数据
  - [ ] 调用 `DrawInvoker.deserializeAll()` 恢复画布内容
  - [ ] 恢复所有 UI 状态（选中索引、缩放、工具等）
  - [ ] 触发 `refreshOffCanvas()` 重绘底层画布
- **涉及文件**：`EntryAbility.ets`、`Index.ets`
- **预估工作量**：1.5天

### 5.4 状态共享机制
- **任务**：
  - [ ] 使用 `AppStorage` 或 `GlobalThis` 在 DrawCanvas 和 EntryAbility 间共享状态
  - [ ] DrawCanvas 中通过 `@StorageLink` 连接关键状态
  - [ ] 确保 onContinue 时能读取最新画布状态
  - [ ] 确保 onRestore 后 DrawCanvas 能响应状态变化并重绘
- **涉及文件**：`Index.ets`、`EntryAbility.ets`
- **预估工作量**：1天

### 5.5 流转生命周期处理
- **任务**：
  - [ ] `onContinue` 中校验数据大小（wantParam 有 100KB 限制），超大时截断或压缩
  - [ ] `onNewWant` 处理流转后再次接收的场景
  - [ ] 流转失败时优雅降级（不崩溃，提示用户）
- **涉及文件**：`EntryAbility.ets`
- **预估工作量**：1天

---

## 六、Phase 3 — 分布式数据实时同步（优先级：🟡 中）

> 目标：多设备实时同步画布变更，支持"你画我看"场景

### 6.1 分布式数据对象创建
- **任务**：
  - [ ] 引入 `@kit.DistributedDataObject`
  - [ ] 创建分布式数据对象，包含画布变更增量数据
  - [ ] 设置 sessionId 建立同步通道
  - [ ] 设备上线/下线监听
- **涉及文件**：新增 `viewmodel/DistributedCanvas.ets`
- **预估工作量**：1.5天

### 6.2 增量同步策略
- **任务**：
  - [ ] 每次 add/delete/move/rotate 操作后，将增量变更写入分布式对象
  - [ ] 增量数据格式：`{type: 'add'/'delete'/'move'/'rotate', index, data}`
  - [ ] 远端收到变更回调后，应用增量到本地 DrawInvoker
  - [ ] 冲突解决：Last-Write-Wins（最后写入者胜出）
- **涉及文件**：`DistributedCanvas.ets`、`DrawInvoker.ets`、`Index.ets`
- **预估工作量**：2天

### 6.3 同步状态 UI 反馈
- **任务**：
  - [ ] 顶部显示同步状态指示器（同步中/已同步/离线）
  - [ ] 远端设备列表显示（哪些设备在同步）
  - [ ] 同步延迟提示
- **涉及文件**：`Index.ets`
- **预估工作量**：1天

---

## 七、Phase 4 — 协作增强（优先级：🟢 低）

> 目标：多人实时协作绘制，对标 Figma/Sketch 协作体验

### 7.1 多用户光标显示
- [ ] 每个远端用户维护独立的光标位置
- [ ] 光标颜色按用户区分
- [ ] 光标移动实时同步
- [ ] 显示用户名标签

### 7.2 操作冲突解决升级
- [ ] 从 Last-Write-Wins 升级为 OT（Operational Transformation）算法
- [ ] 同一路径被两人同时编辑时的合并策略
- [ ] 冲突提示与手动解决 UI

### 7.3 评论与批注
- [ ] 画布上添加评论锚点
- [ ] 评论内容分布式同步
- [ ] 评论列表面板
- [ ] @提及通知

### 7.4 版本历史与回溯
- [ ] 每次操作生成版本快照
- [ ] 版本时间线面板
- [ ] 回溯到任意历史版本
- [ ] 版本对比（双画布 diff）

### 7.5 分布式文件共享
- [ ] 保存画布到分布式文件系统
- [ ] 其他设备自动获取文件
- [ ] 支持导出 PNG/SVG/PDF 后跨设备访问

---

## 八、需序列化的数据清单

| 数据项 | 类型 | 来源 | 序列化方式 |
|--------|------|------|-----------|
| DrawPath.points | Array<{x,y}> | 触摸记录 | JSON 数组 |
| DrawPath.paint | Paint | 画笔属性 | Paint.toJSON() |
| DrawPath.offsetX/Y | number | 移动偏移 | 直接序列化 |
| DrawPath.rotation | number | 旋转角度 | 直接序列化 |
| ShapeDraw.shapeType | string | 图形类型 | 直接序列化 |
| ShapeDraw.startX/Y/endX/Y | number | 图形坐标 | 直接序列化 |
| TextDraw.text | string | 文字内容 | 直接序列化 |
| TextDraw.fontSize | number | 字号 | 直接序列化 |
| TextDraw.fontWeight | FontWeight | 加粗 | 枚举转数字 |
| TextDraw.fontStyle | FontStyle | 斜体 | 枚举转数字 |
| Paint.StrokeStyle | string | 颜色 | 直接序列化 |
| Paint.lineWidth | number | 线宽 | 直接序列化 |
| Paint.globalAlpha | number | 不透明度 | 直接序列化 |
| selectedIndex | number | 当前选中 | 直接序列化 |
| scaleValueX/Y | number | 缩放比例 | 直接序列化 |
| shapeTool | string | 当前工具 | 直接序列化 |

---

## 九、序列化格式设计

```json
{
  "version": 1,
  "drawPathList": [
    {
      "type": "drawpath",
      "points": [{"x": 100, "y": 200}, {"x": 105, "y": 210}],
      "paint": {"strokeStyle": "#000000", "lineWidth": 3, "globalAlpha": 1},
      "isFountainPen": false,
      "offsetX": 0, "offsetY": 0, "rotation": 0
    },
    {
      "type": "shapedraw",
      "shapeType": "circle",
      "startX": 100, "startY": 100,
      "endX": 200, "endY": 200,
      "paint": {"strokeStyle": "#FF0000", "lineWidth": 2, "globalAlpha": 1},
      "offsetX": 0, "offsetY": 0, "rotation": 0
    },
    {
      "type": "textdraw",
      "text": "Hello",
      "x": 50, "y": 50,
      "fontSize": 14,
      "fontWeight": 1,
      "fontStyle": 0,
      "paint": {"strokeStyle": "#000000", "lineWidth": 0, "globalAlpha": 1},
      "offsetX": 0, "offsetY": 0, "rotation": 0
    }
  ],
  "selectedIndex": -1,
  "scaleValueX": 1, "scaleValueY": 1,
  "shapeTool": "",
  "isPaint": false, "isEraser": false
}
```

---

## 十、配置变更清单

### module.json5

```json5
{
  "module": {
    "abilities": [{
      "name": "EntryAbility",
      "continuable": true
    }],
    "requestPermissions": [
      {
        "name": "ohos.permission.DISTRIBUTED_DATASYNC",
        "reason": "$string:distributed_permission_reason",
        "usedScene": {"abilities": ["EntryAbility"], "when": "inuse"}
      }
    ]
  }
}
```

### string.json 新增

```json
{
  "name": "distributed_permission_reason",
  "value": "用于跨设备同步画布数据"
}
```

---

## 十一、改造优先级矩阵

| 任务 | 工作量 | 优先级 | 依赖 |
|------|--------|--------|------|
| 4.1 DrawPath 序列化 | 1.5天 | 🔴 P0 | 无 |
| 4.2 ShapeDraw 序列化 | 0.5天 | 🔴 P0 | 无 |
| 4.3 TextDraw 序列化 | 0.5天 | 🔴 P0 | 无 |
| 4.4 DrawInvoker 批量序列化 | 1天 | 🔴 P0 | 4.1+4.2+4.3 |
| 4.5 Paint 序列化 | 0.5天 | 🔴 P0 | 无 |
| 5.1 声明流转能力 | 0.5天 | 🔴 P1 | 无 |
| 5.2 onContinue 实现 | 1.5天 | 🔴 P1 | 4.4+5.1 |
| 5.3 onRestore 实现 | 1.5天 | 🔴 P1 | 5.2 |
| 5.4 状态共享机制 | 1天 | 🟡 P2 | 5.2 |
| 5.5 流转生命周期 | 1天 | 🟡 P2 | 5.3 |
| 6.1 分布式数据对象 | 1.5天 | 🟡 P3 | 4.4 |
| 6.2 增量同步策略 | 2天 | 🟡 P3 | 6.1 |
| 6.3 同步状态 UI | 1天 | 🟢 P4 | 6.2 |
| 7.1 多用户光标 | 2天 | 🟢 P5 | 6.2 |
| 7.2 冲突解决升级 | 3天 | 🟢 P5 | 6.2 |
| 7.3 评论批注 | 2天 | 🟢 P5 | 6.1 |
| 7.4 版本历史 | 2天 | 🟢 P5 | 4.4 |
| 7.5 分布式文件 | 1.5天 | 🟢 P5 | 5.3 |

---

## 十二、版本里程碑

| 版本 | 阶段 | 核心交付 | 目标日期 |
|------|------|----------|----------|
| **v1.1.0** | Phase 1 | DrawPath/ShapeDraw/TextDraw/Paint 可序列化 + DrawInvoker 批量序列化 | - |
| **v1.2.0** | Phase 2 | UIAbility 流转：设备A画 → 流转到设备B继续 | - |
| **v1.3.0** | Phase 3 | 分布式数据实时同步：你画我看 | - |
| **v2.0.0** | Phase 4 | 多人协作+光标+冲突解决+评论+版本历史 | - |

---

## 十三、验证清单

每完成一个 Phase，需验证以下场景：

| 验证项 | 同设备流转 | 跨手机流转 | 跨平板流转 | 手机→平板 | 平板→手机 |
|--------|-----------|-----------|-----------|----------|----------|
| 流转触发 | ☐ | ☐ | ☐ | ☐ | ☐ |
| 画布内容恢复 | ☐ | ☐ | ☐ | ☐ | ☐ |
| 图形完整 | ☐ | ☐ | ☐ | ☐ | ☐ |
| 文字完整 | ☐ | ☐ | ☐ | ☐ | ☐ |
| 缩放比例恢复 | ☐ | ☐ | ☐ | ☐ | ☐ |
| 当前工具恢复 | ☐ | ☐ | ☐ | ☐ | ☐ |
| 可继续编辑 | ☐ | ☐ | ☐ | ☐ | ☐ |
| 撤销/重做正常 | ☐ | ☐ | ☐ | ☐ | ☐ |
| 大数据量(100+路径) | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## 十四、数据大小限制与优化

| 场景 | 数据量估算 | wantParam 限制(100KB) | 策略 |
|------|-----------|---------------------|------|
| 10条自由路径 | ~2KB | ✅ 直接传输 | 无需优化 |
| 50条路径+文字 | ~10KB | ✅ 直接传输 | 无需优化 |
| 100条路径 | ~20KB | ✅ 直接传输 | 无需优化 |
| 500条路径 | ~100KB | ⚠️ 临界 | 压缩或分布式文件 |
| 1000+条路径 | >100KB | ❌ 超限 | 必须走分布式文件 |

优化策略：
- **Phase 2**：直接传输，限制最大路径数 500
- **Phase 3**：增量同步，每次只传操作增量（<1KB）
- **Phase 4**：超大数据走分布式文件共享

---

## 十五、更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-05-30 | 初始版本：基于项目现状制定四阶段跨设备投送计划，识别18项改造任务 |

---

## 十六、如何使用本计划

1. **按 Phase 顺序推进**：每个 Phase 内按优先级矩阵（P0→P5）执行
2. **勾选任务**：完成一项后将 `[ ]` 改为 `[x]`，并更新"最后更新"日期
3. **验证清单**：每完成一个 Phase 后，按验证清单在多设备上逐项检查
4. **数据量监控**：关注序列化后数据大小，接近 100KB 时提前优化
5. **新增任务**：在对应 Phase 下新增条目，标注优先级
6. **定期回顾**：建议每两周回顾一次，调整优先级和里程碑
7. **版本发布**：完成一个 Phase 后，更新版本号和更新日志
