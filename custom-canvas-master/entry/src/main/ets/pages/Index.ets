/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { display } from '@kit.ArkUI';
import DrawInvoker from '../viewmodel/DrawInvoker';
import DrawPath, { ShapeDraw, TextDraw } from '../viewmodel/IDraw';
import { IBrush } from '../viewmodel/IBrush';
import NormalBrush from '../viewmodel/IBrush';
import { FountainPenBrush } from '../viewmodel/IBrush';
import Paint from '../viewmodel/Paint';
import { CommonConstants } from '../common/CommonConstants';
import { myPaintSheet } from '../view/myPaintSheet';
import { textInputSheet } from '../view/textInputSheet';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';

@Entry
@Component
struct DrawCanvas {
  @State @Watch('createDraw') isDrawing: boolean = false;
  @State unDoDraw: boolean = false;
  @State redoDraw: boolean = false;
  @State isPaint: boolean = false;
  @State isShow: boolean = false;
  @State isShapeShow: boolean = false;
  @State isMarker: boolean = false;
  @State isFountainPen: boolean = false;
  @State shapeTool: string = '';
  @State scaleValueX: number = 1;
  @State scaleValueY: number = 1;
  @State pinchValueX: number = 1;
  @State pinchValueY: number = 1;
  @State strokeWidth: number = 3;
  @State alpha: number = 1;
  @State color: string = '#000000';
  @State thicknessesValue: number = 3;
  @State index: number = -1;
  @State clean: boolean = false;
  @State percent: string = '100';
  @State eraserWidth: number = 10;
  @State isEraserShow: boolean = false;
  @State isEraser: boolean = false;
  @State selectedIndex: number = -1;
  @State selectDragStartX: number = 0;
  @State selectDragStartY: number = 0;
  @State selectAction: string = '';
  @State showShapeMenu: boolean = false;
  @State shapeMenuX: number = 0;
  @State shapeMenuY: number = 0;
  @State isTextShow: boolean = false;
  @State textContent: string = '';
  @State textFontSize: number = 24;
  @State textFontWeight: FontWeight = FontWeight.Normal;
  @State textFontStyle: FontStyle = FontStyle.Normal;
  @State textColor: string = '#000000';
  private textPlaceX: number = 0;
  private textPlaceY: number = 0;
  private isTextEdit: boolean = false;
  private lastTextClickTime: number = 0;
  private lastTextClickX: number = 0;
  private lastTextClickY: number = 0;
  @Provide mPaint: Paint = new Paint(0, '', 1);
  @Provide mBrush: IBrush = new NormalBrush();
  private setting: RenderingContextSettings = new RenderingContextSettings(true);
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.setting);
  private offSetting: RenderingContextSettings = new RenderingContextSettings(true);
  private offContext: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.offSetting);
  private drawInvoker: DrawInvoker = new DrawInvoker();
  private path2Db: Path2D = new Path2D();
  private mPath: DrawPath = new DrawPath(this.mPaint, this.path2Db);
  private arr: number[] = [];
  private offCanvasReady: boolean = false;
  private shapeStartX: number = 0;
  private shapeStartY: number = 0;


  aboutToAppear(): void {
    this.mPaint = new Paint(CommonConstants.ZERO, CommonConstants.COLOR_STRING, CommonConstants.ONE);
    this.mPaint.setStrokeWidth(CommonConstants.THREE);
    this.mPaint.setColor(CommonConstants.BLACK);
    this.mPaint.setGlobalAlpha(CommonConstants.ONE);
    this.mBrush = new NormalBrush();
    try {
      display.on('foldStatusChange', (data: display.FoldStatus) => {
        if (data === 2) {
          this.scaleValueX = 0.5;
          this.pinchValueX = 0.5;
          this.scaleValueY = 1;
          this.pinchValueY = 1;
          this.refreshOffCanvas();
          this.clearTopCanvas();
        } else if (data === 1) {
          this.scaleValueX = 1;
          this.scaleValueY = 1;
          this.pinchValueX = 1;
          this.pinchValueY = 1;
          this.refreshOffCanvas();
          this.clearTopCanvas();
        }
      })
    } catch (error) {
      let err = error as BusinessError;
      hilog.error(0x0000, 'Index', `listen foldStatusChange failed. code=${err.code}, message=${err.message}`);
    }
  }

  createDraw() {
    if (this.isDrawing) {
      this.clearTopCanvas();
      this.isDrawing = false;
    }
  }

  refreshOffCanvas(): void {
    if (!this.offCanvasReady) return;
    this.offContext.clearRect(0, 0, this.offContext.width, this.offContext.height);
    this.offContext.fillStyle = Color.White;
    this.offContext.fillRect(0, 0, this.offContext.width, this.offContext.height);
    this.drawInvoker.execute(this.offContext);
  }

  appendToOffCanvas(path: DrawPath): void {
    if (!this.offCanvasReady) return;
    path.draw(this.offContext);
  }

  clearTopCanvas(): void {
    this.context.clearRect(0, 0, this.context.width, this.context.height);
  }

  drawShapePreview(x: number, y: number): void {
    this.clearTopCanvas();
    let shape = new ShapeDraw(this.mPaint, this.shapeTool, this.shapeStartX, this.shapeStartY, x, y);
    shape.draw(this.context);
  }

  updateShapeMenuPos(): void {
    if (this.selectedIndex < 0) return;
    let element = this.drawInvoker.getAt(this.selectedIndex);
    if (element === null) return;
    let bounds = element.getBounds();
    let m = Math.max(element.paint.lineWidth / 2 + 4, 8);
    this.shapeMenuX = bounds[2] + m;
    this.shapeMenuY = bounds[1] - m;
  }

  drawSelectionBox(): void {
    if (this.selectedIndex < 0) return;
    let element = this.drawInvoker.getAt(this.selectedIndex);
    if (element === null) return;
    let bounds = element.getBounds();
    let margin = Math.max(element.paint.lineWidth / 2 + 4, 8);
    let x = bounds[0] - margin;
    let y = bounds[1] - margin;
    let w = bounds[2] - bounds[0] + margin * 2;
    let h = bounds[3] - bounds[1] + margin * 2;
    this.clearTopCanvas();
    let ctx = this.context;
    ctx.strokeStyle = '#0A59F7';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    ctx.fillStyle = '#0A59F7';
    let handleSize = 6;
    ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x + w - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x + w - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize);
    let cx = x + w / 2;
    let topY = y;
    let rotLineLen = 20;
    let rotHandleY = topY - rotLineLen;
    ctx.strokeStyle = '#0A59F7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(cx, rotHandleY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, rotHandleY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#0A59F7';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, rotHandleY, 4, -Math.PI * 0.75, Math.PI * 0.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 4 * Math.cos(Math.PI * 0.25), rotHandleY + 4 * Math.sin(Math.PI * 0.25));
    ctx.lineTo(cx + 4 * Math.cos(Math.PI * 0.25) - 3, rotHandleY + 4 * Math.sin(Math.PI * 0.25) - 2);
    ctx.stroke();
    let delR = 11;
    let delCx = x + w;
    let delCy = y;
    ctx.beginPath();
    ctx.arc(delCx, delCy, delR, 0, 2 * Math.PI);
    ctx.fillStyle = '#E84026';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(delCx - 4, delCy - 4);
    ctx.lineTo(delCx + 4, delCy + 4);
    ctx.moveTo(delCx + 4, delCy - 4);
    ctx.lineTo(delCx - 4, delCy + 4);
    ctx.stroke();
    this.updateShapeMenuPos();
  }

  isRotateHandleHit(tx: number, ty: number): boolean {
    if (this.selectedIndex < 0) return false;
    let element = this.drawInvoker.getAt(this.selectedIndex);
    if (element === null) return false;
    let bounds = element.getBounds();
    let margin = Math.max(element.paint.lineWidth / 2 + 4, 8);
    let cx = (bounds[0] + bounds[2]) / 2;
    let rotHandleY = bounds[1] - margin - 20;
    return tx >= cx - 15 && tx <= cx + 15 && ty >= rotHandleY - 15 && ty <= rotHandleY + 15;
  }

  isDeleteHandleHit(tx: number, ty: number): boolean {
    if (this.selectedIndex < 0) return false;
    let element = this.drawInvoker.getAt(this.selectedIndex);
    if (element === null) return false;
    let bounds = element.getBounds();
    let margin = Math.max(element.paint.lineWidth / 2 + 4, 8);
    let boxRight = bounds[2] + margin;
    let boxTop = bounds[1] - margin;
    return tx >= boxRight - 20 && tx <= boxRight + 20 && ty >= boxTop - 20 && ty <= boxTop + 20;
  }

  getSelectionCenter(): number[] {
    if (this.selectedIndex < 0) return [0, 0];
    let element = this.drawInvoker.getAt(this.selectedIndex);
    if (element === null) return [0, 0];
    let bounds = element.getBounds();
    return [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];
  }

  deleteSelected(): void {
    if (this.selectedIndex >= 0) {
      this.drawInvoker.removeAt(this.selectedIndex);
      this.selectedIndex = -1;
      this.showShapeMenu = false;
      this.selectAction = '';
      this.path2Db = new Path2D();
      this.mPath = new DrawPath(this.mPaint, this.path2Db);
      this.arr = [];
      this.refreshOffCanvas();
      this.clearTopCanvas();
      this.redoDraw = false;
      this.unDoDraw = this.drawInvoker.canUndo();
    }
  }

  rotateSelected(): void {
    if (this.selectedIndex >= 0) {
      let element = this.drawInvoker.getAt(this.selectedIndex);
      if (element !== null) {
        element.rotateBy(Math.PI / 12);
        this.refreshOffCanvas();
        this.drawSelectionBox();
      }
    }
  }

  /**
   * Add a sketch path.
   */
  add(path: DrawPath): void {
    this.drawInvoker.add(path);
  }

  /**
   * Toggle weight, color, transparency.
   */
  ToggleThicknessColor(): void {
    this.mPaint = new Paint(CommonConstants.ZERO, CommonConstants.COLOR_STRING, CommonConstants.ONE);
    this.mPaint.setStrokeWidth(this.strokeWidth);
    this.mPaint.setColor(this.color);
    this.mPaint.setGlobalAlpha(this.alpha);
    if (this.isFountainPen) {
      this.mBrush = new FountainPenBrush();
    } else {
      this.mBrush = new NormalBrush();
    }
  }

  /**
   * Undo operation.
   */
  drawOperateUndo(): void {
    this.drawInvoker.undo();
    this.refreshOffCanvas();
    if (!this.drawInvoker.canUndo()) {
      this.unDoDraw = false;
    }
    this.redoDraw = true;
  }

  /**
   * Redo operation.
   */
  drawOperateRedo(): void {
    this.drawInvoker.redo();
    this.refreshOffCanvas();
    if (!this.drawInvoker.canRedo()) {
      this.redoDraw = false;
    }
    this.unDoDraw = true;
  }

  /**
   * Clear operation.
   */
  clear(): void {
    this.drawInvoker.clear();
    this.selectedIndex = -1;
    this.showShapeMenu = false;
    this.selectAction = '';
    this.path2Db = new Path2D();
    this.mPath = new DrawPath(this.mPaint, this.path2Db);
    this.arr = [];
    this.refreshOffCanvas();
    this.clearTopCanvas();
    this.redoDraw = false;
    this.unDoDraw = false;
  }

  commitText(): void {
    if (this.isTextEdit && this.selectedIndex >= 0) {
      let element = this.drawInvoker.getAt(this.selectedIndex);
      if (element instanceof TextDraw) {
        if (this.textContent.trim().length === 0) {
          this.deleteSelected();
          this.isTextEdit = false;
          return;
        }
        element.text = this.textContent;
        element.fontSize = this.textFontSize;
        element.fontWeight = this.textFontWeight;
        element.fontStyle = this.textFontStyle;
        element.paint.StrokeStyle = this.textColor;
        element.resetBounds();
        element.computeTextBounds();
        this.refreshOffCanvas();
        this.drawSelectionBox();
        this.isTextEdit = false;
        return;
      }
      this.isTextEdit = false;
    }
    if (this.textContent.trim().length === 0) {
      return;
    }
    let textPaint = new Paint(CommonConstants.ZERO, CommonConstants.COLOR_STRING, CommonConstants.ONE);
    textPaint.setColor(this.textColor);
    textPaint.setGlobalAlpha(CommonConstants.ONE);
    let textDraw = new TextDraw(textPaint, this.textContent, this.textPlaceX, this.textPlaceY,
      this.textFontSize, this.textFontWeight, this.textFontStyle);
    this.add(textDraw);
    this.appendToOffCanvas(textDraw);
    this.clearTopCanvas();
    this.selectedIndex = this.drawInvoker.getCount() - 1;
    this.selectDragStartX = this.textPlaceX;
    this.selectDragStartY = this.textPlaceY;
    this.selectAction = '';
    this.showShapeMenu = true;
    this.drawSelectionBox();
    this.redoDraw = false;
    this.unDoDraw = true;
  }

  @Builder
  myTextInputSheet() {
    Column() {
      textInputSheet({
        textContent: this.textContent,
        textFontSize: this.textFontSize,
        textFontWeight: this.textFontWeight,
        textFontStyle: this.textFontStyle,
        textColor: this.textColor
      })
    }
    .width(CommonConstants.ONE_HUNDRED_PERCENT)
    .height(CommonConstants.ONE_HUNDRED_PERCENT)
  }

  @Builder
  myPaintSheet() {
    Column() {
      myPaintSheet({
        isMarker: this.isMarker,
        isFountainPen: this.isFountainPen,
        shapeTool: this.shapeTool,
        alpha: this.alpha,
        percent: this.percent,
        color: this.color,
        strokeWidth: $strokeWidth
      })
    }
  }

  @Builder
  myEraserSheet() {
    Column() {
      Column() {
        Text($r('app.string.thicknesses'))
          .textAlign(TextAlign.Start)
          .fontSize($r('app.float.font_size'))
          .fontColor($r('sys.color.mask_secondary'))
          .margin({ bottom: $r('app.float.margin_bottom') })
        Row() {
          Slider({
            value: this.eraserWidth,
            min: CommonConstants.THREE,
            max: CommonConstants.TWENTY_ONE,
            step: 1
          })
            .width($r('app.float.slider_width'))
            .minResponsiveDistance(CommonConstants.ONE)
            .onChange((value: number, _mode: SliderChangeMode) => {
              this.eraserWidth = value;
              this.mPaint.setStrokeWidth(this.eraserWidth);
            })
          Text(this.eraserWidth.toFixed(0))
            .width(28)
            .fontSize(11)
            .fontColor($r('sys.color.mask_secondary'))
            .textAlign(TextAlign.Center)
        }
        .padding({
          left: $r('app.float.margin_bottom'),
          right: $r('app.float.margin_bottom')
        })
        .justifyContent(FlexAlign.SpaceBetween)
        .width(CommonConstants.ONE_HUNDRED_PERCENT)
      }
      .padding({
        left: $r('app.float.padding_left'),
        right: $r('app.float.padding_left')
      })
      .alignItems(HorizontalAlign.Start)
      .width(CommonConstants.ONE_HUNDRED_PERCENT)
    }
    .width(CommonConstants.ONE_HUNDRED_PERCENT)
    .height(CommonConstants.ONE_HUNDRED_PERCENT)
  }

  @Builder
  shapeToolSheet() {
    Column() {
      Text($r('app.string.shape_tools'))
        .fontSize(16)
        .fontColor($r('sys.color.mask_secondary'))
        .margin({ top: 16, bottom: 12 })
      Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceEvenly }) {
        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'line' ? $r('app.color.theme_color') : '#F1F3F5')
            Text('/')
              .fontSize(22)
              .fontColor(this.shapeTool === 'line' ? Color.White : Color.Black)
              .fontWeight(FontWeight.Bold)
              .rotate({ angle: -30 })
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'line';
            this.isShapeShow = false;
          })
          Text($r('app.string.ruler'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'line' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'circle' ? $r('app.color.theme_color') : '#F1F3F5')
            Text('○')
              .fontSize(22)
              .fontColor(this.shapeTool === 'circle' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'circle';
            this.isShapeShow = false;
          })
          Text($r('app.string.circle_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'circle' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'rect' ? $r('app.color.theme_color') : '#F1F3F5')
            Text('□')
              .fontSize(22)
              .fontColor(this.shapeTool === 'rect' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'rect';
            this.isShapeShow = false;
          })
          Text($r('app.string.rect_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'rect' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'ellipse' ? $r('app.color.theme_color') : '#F1F3F5')
            Text('⬭')
              .fontSize(22)
              .fontColor(this.shapeTool === 'ellipse' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'ellipse';
            this.isShapeShow = false;
          })
          Text($r('app.string.ellipse_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'ellipse' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'triangle' ? $r('app.color.theme_color') : '#F1F3F5')
            Text('△')
              .fontSize(22)
              .fontColor(this.shapeTool === 'triangle' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'triangle';
            this.isShapeShow = false;
          })
          Text($r('app.string.triangle_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'triangle' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'diamond' ? $r('app.color.theme_color') : '#F1F3F5')
            Text('◇')
              .fontSize(22)
              .fontColor(this.shapeTool === 'diamond' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'diamond';
            this.isShapeShow = false;
          })
          Text($r('app.string.diamond_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'diamond' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'star' ? $r('app.color.theme_color') : '#F1F3F5')
            Text('☆')
              .fontSize(22)
              .fontColor(this.shapeTool === 'star' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'star';
            this.isShapeShow = false;
          })
          Text($r('app.string.star_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'star' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'arrow' ? $r('app.color.theme_color') : '#F1F3F5')
            Text('→')
              .fontSize(22)
              .fontColor(this.shapeTool === 'arrow' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'arrow';
            this.isShapeShow = false;
          })
          Text($r('app.string.arrow_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'arrow' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'cube' ? $r('app.color.theme_color') : '#F1F3F5')
            Image($r('app.media.cube'))
              .width(24)
              .height(24)
              .fillColor(this.shapeTool === 'cube' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'cube';
            this.isShapeShow = false;
          })
          Text($r('app.string.cube_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'cube' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'cylinder' ? $r('app.color.theme_color') : '#F1F3F5')
            Image($r('app.media.cylinder'))
              .width(24)
              .height(24)
              .fillColor(this.shapeTool === 'cylinder' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'cylinder';
            this.isShapeShow = false;
          })
          Text($r('app.string.cylinder_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'cylinder' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'cone' ? $r('app.color.theme_color') : '#F1F3F5')
            Image($r('app.media.cone'))
              .width(24)
              .height(24)
              .fillColor(this.shapeTool === 'cone' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'cone';
            this.isShapeShow = false;
          })
          Text($r('app.string.cone_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'cone' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'pyramid' ? $r('app.color.theme_color') : '#F1F3F5')
            Image($r('app.media.pyramid'))
              .width(24)
              .height(24)
              .fillColor(this.shapeTool === 'pyramid' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'pyramid';
            this.isShapeShow = false;
          })
          Text($r('app.string.pyramid_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'pyramid' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'sphere' ? $r('app.color.theme_color') : '#F1F3F5')
            Image($r('app.media.sphere'))
              .width(24)
              .height(24)
              .fillColor(this.shapeTool === 'sphere' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'sphere';
            this.isShapeShow = false;
          })
          Text($r('app.string.sphere_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'sphere' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)

        Column() {
          Stack() {
            Text()
              .width(48)
              .height(48)
              .borderRadius(24)
              .backgroundColor(this.shapeTool === 'text' ? $r('app.color.theme_color') : '#F1F3F5')
            Text('A')
              .fontSize(22)
              .fontWeight(FontWeight.Bold)
              .fontColor(this.shapeTool === 'text' ? Color.White : Color.Black)
          }
          .width(48)
          .height(48)
          .onClick(() => {
            this.shapeTool = 'text';
            this.isShapeShow = false;
          })
          Text($r('app.string.text_tool'))
            .fontSize(12)
            .fontColor(this.shapeTool === 'text' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
            .margin({ top: 6 })
        }
        .width(80)
        .alignItems(HorizontalAlign.Center)
      }
      .width(CommonConstants.ONE_HUNDRED_PERCENT)
      .padding({ left: 16, right: 16, bottom: 20 })
    }
    .width(CommonConstants.ONE_HUNDRED_PERCENT)
    .backgroundColor(Color.White)
  }

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      Canvas(this.offContext)
        .width(CommonConstants.CANVAS_WIDTH)
        .height(CommonConstants.CANVAS_WIDTH)
        .backgroundColor($r('sys.color.white'))
        .onReady(() => {
          this.offCanvasReady = true;
          this.offContext.fillStyle = Color.White;
          this.offContext.fillRect(0, 0, this.offContext.width, this.offContext.height);
        })

      Canvas(this.context)
        .width(CommonConstants.CANVAS_WIDTH)
        .height(CommonConstants.CANVAS_WIDTH)
        .onTouch((event: TouchEvent) => {
          this.clean = false;
          if (this.index === 1) {
            return;
          }
          if (this.shapeTool !== '' && this.shapeTool !== 'select') {
            if (this.shapeTool === 'text') {
              if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Down) {
                let touch = event.touches[0];
                if (this.selectedIndex >= 0 && this.isDeleteHandleHit(touch.x, touch.y)) {
                  this.deleteSelected();
                  return;
                }
                if (this.selectedIndex >= 0 && this.isRotateHandleHit(touch.x, touch.y)) {
                  this.selectAction = 'rotate';
                  let center = this.getSelectionCenter();
                  this.selectDragStartX = center[0];
                  this.selectDragStartY = center[1];
                  return;
                }
                if (this.selectedIndex >= 0 && this.showShapeMenu) {
                  let dx = touch.x - this.shapeMenuX;
                  let dy = touch.y - this.shapeMenuY;
                  if (dx * dx + dy * dy <= 625) {
                    this.deleteSelected();
                    return;
                  }
                }
                let hitIndex = this.drawInvoker.findShapeAt(touch.x, touch.y);
                if (hitIndex >= 0) {
                  let hitElement = this.drawInvoker.getAt(hitIndex);
                  let now = Date.now();
                  let dx = touch.x - this.lastTextClickX;
                  let dy = touch.y - this.lastTextClickY;
                  if (hitElement instanceof TextDraw && hitIndex === this.selectedIndex &&
                    now - this.lastTextClickTime < 400 && dx * dx + dy * dy < 900) {
                    this.isTextEdit = true;
                    this.textContent = hitElement.text;
                    this.textFontSize = hitElement.fontSize;
                    this.textFontWeight = hitElement.fontWeight;
                    this.textFontStyle = hitElement.fontStyle;
                    this.textColor = hitElement.paint.StrokeStyle;
                    this.isTextShow = true;
                    this.lastTextClickTime = 0;
                    return;
                  }
                  this.lastTextClickTime = now;
                  this.lastTextClickX = touch.x;
                  this.lastTextClickY = touch.y;
                  this.selectedIndex = hitIndex;
                  this.selectDragStartX = touch.x;
                  this.selectDragStartY = touch.y;
                  this.selectAction = 'move';
                  this.drawSelectionBox();
                  this.showShapeMenu = true;
                } else {
                  this.lastTextClickTime = 0;
                  if (this.selectedIndex >= 0) {
                    this.selectedIndex = -1;
                    this.showShapeMenu = false;
                    this.clearTopCanvas();
                  }
                  this.isTextEdit = false;
                  this.textPlaceX = touch.x;
                  this.textPlaceY = touch.y;
                  this.textContent = '';
                  this.isTextShow = true;
                }
              }
              if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Move) {
                if (this.selectAction === 'rotate' && this.selectedIndex >= 0) {
                  let touch = event.touches[0];
                  let center = this.getSelectionCenter();
                  let prevAngle = Math.atan2(this.selectDragStartY - center[1], this.selectDragStartX - center[0]);
                  let curAngle = Math.atan2(touch.y - center[1], touch.x - center[0]);
                  let deltaAngle = curAngle - prevAngle;
                  let element = this.drawInvoker.getAt(this.selectedIndex);
                  if (element !== null) {
                    element.rotateBy(deltaAngle);
                    this.selectDragStartX = touch.x;
                    this.selectDragStartY = touch.y;
                    this.refreshOffCanvas();
                    this.drawSelectionBox();
                  }
                  return;
                }
                if (this.selectedIndex >= 0 && this.selectAction === 'move') {
                  let touch = event.touches[0];
                  let dx = touch.x - this.selectDragStartX;
                  let dy = touch.y - this.selectDragStartY;
                  let element = this.drawInvoker.getAt(this.selectedIndex);
                  if (element !== null) {
                    element.moveBy(dx, dy);
                    this.selectDragStartX = touch.x;
                    this.selectDragStartY = touch.y;
                    this.refreshOffCanvas();
                    this.drawSelectionBox();
                  }
                  return;
                }
              }
              if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Up) {
                if (this.selectAction === 'move' || this.selectAction === 'rotate') {
                  this.selectAction = '';
                  return;
                }
              }
              return;
            }
            if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Down) {
              this.shapeStartX = event.touches[0].x;
              this.shapeStartY = event.touches[0].y;
            }
            if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Move) {
              this.drawShapePreview(event.touches[0].x, event.touches[0].y);
            }
            if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Up) {
              let shape = new ShapeDraw(this.mPaint, this.shapeTool, this.shapeStartX, this.shapeStartY,
                event.touches[0].x, event.touches[0].y);
              this.add(shape);
              this.appendToOffCanvas(shape);
              this.clearTopCanvas();
              this.redoDraw = false;
              this.unDoDraw = true;
            }
            return;
          }
          if (event.touches.length > 1) {
            return;
          }
          if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Down) {
            let touch = event.touches[0];
            if (this.selectedIndex >= 0 && this.isRotateHandleHit(touch.x, touch.y)) {
              this.selectAction = 'rotate';
              let center = this.getSelectionCenter();
              this.selectDragStartX = center[0];
              this.selectDragStartY = center[1];
              return;
            }
            if (this.selectedIndex >= 0 && this.isDeleteHandleHit(touch.x, touch.y)) {
              this.deleteSelected();
              return;
            }
            if (this.selectedIndex >= 0 && this.showShapeMenu) {
              let dx = touch.x - this.shapeMenuX;
              let dy = touch.y - this.shapeMenuY;
              if (dx * dx + dy * dy <= 625) {
                this.deleteSelected();
                return;
              }
            }
            if (this.isPaint && this.shapeTool === '') {
              let hitIndex = this.drawInvoker.findShapeAt(touch.x, touch.y);
              if (hitIndex >= 0) {
                let hitElement = this.drawInvoker.getAt(hitIndex);
                let now = Date.now();
                let dx2 = touch.x - this.lastTextClickX;
                let dy2 = touch.y - this.lastTextClickY;
                if (hitElement instanceof TextDraw && hitIndex === this.selectedIndex &&
                  now - this.lastTextClickTime < 400 && dx2 * dx2 + dy2 * dy2 < 900) {
                  this.isTextEdit = true;
                  this.textContent = hitElement.text;
                  this.textFontSize = hitElement.fontSize;
                  this.textFontWeight = hitElement.fontWeight;
                  this.textFontStyle = hitElement.fontStyle;
                  this.textColor = hitElement.paint.StrokeStyle;
                  this.isTextShow = true;
                  this.lastTextClickTime = 0;
                  return;
                }
                this.lastTextClickTime = now;
                this.lastTextClickX = touch.x;
                this.lastTextClickY = touch.y;
                this.selectedIndex = hitIndex;
                this.selectDragStartX = touch.x;
                this.selectDragStartY = touch.y;
                this.selectAction = 'move';
                this.drawSelectionBox();
                this.showShapeMenu = true;
                return;
              } else {
                this.lastTextClickTime = 0;
                if (this.selectedIndex >= 0) {
                  this.selectedIndex = -1;
                  this.showShapeMenu = false;
                  this.clearTopCanvas();
                }
              }
            } else if (!this.isPaint && !this.isEraser && this.shapeTool === '') {
              let hitIndex = this.drawInvoker.findShapeAt(touch.x, touch.y);
              if (hitIndex >= 0) {
                let hitElement = this.drawInvoker.getAt(hitIndex);
                let now = Date.now();
                let dx2 = touch.x - this.lastTextClickX;
                let dy2 = touch.y - this.lastTextClickY;
                if (hitElement instanceof TextDraw && hitIndex === this.selectedIndex &&
                  now - this.lastTextClickTime < 400 && dx2 * dx2 + dy2 * dy2 < 900) {
                  this.isTextEdit = true;
                  this.textContent = hitElement.text;
                  this.textFontSize = hitElement.fontSize;
                  this.textFontWeight = hitElement.fontWeight;
                  this.textFontStyle = hitElement.fontStyle;
                  this.textColor = hitElement.paint.StrokeStyle;
                  this.isTextShow = true;
                  this.lastTextClickTime = 0;
                  return;
                }
                this.lastTextClickTime = now;
                this.lastTextClickX = touch.x;
                this.lastTextClickY = touch.y;
                this.selectedIndex = hitIndex;
                this.selectDragStartX = touch.x;
                this.selectDragStartY = touch.y;
                this.selectAction = 'move';
                this.drawSelectionBox();
                this.showShapeMenu = true;
              } else {
                this.lastTextClickTime = 0;
                this.selectedIndex = -1;
                this.showShapeMenu = false;
                this.clearTopCanvas();
              }
              return;
            }
            this.mPath = new DrawPath(this.mPaint, this.path2Db);
            this.mPath.paint = this.mPaint;
            this.mPath.path = new Path2D();
            this.mBrush.down(this.mPath.path, touch.x, touch.y);
            this.mPath.updateBounds(touch.x, touch.y);
          }
          if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Move) {
            if (this.selectAction === 'rotate' && this.selectedIndex >= 0) {
              let touch = event.touches[0];
              let center = this.getSelectionCenter();
              let prevAngle = Math.atan2(this.selectDragStartY - center[1], this.selectDragStartX - center[0]);
              let curAngle = Math.atan2(touch.y - center[1], touch.x - center[0]);
              let deltaAngle = curAngle - prevAngle;
              let element = this.drawInvoker.getAt(this.selectedIndex);
              if (element !== null) {
                element.rotateBy(deltaAngle);
                this.selectDragStartX = touch.x;
                this.selectDragStartY = touch.y;
                this.refreshOffCanvas();
                this.drawSelectionBox();
              }
              return;
            }
            if (!this.isPaint && !this.isEraser && this.shapeTool === '') {
              if (this.selectedIndex >= 0 && this.selectAction === 'move') {
                let touch = event.touches[0];
                let dx = touch.x - this.selectDragStartX;
                let dy = touch.y - this.selectDragStartY;
                let element = this.drawInvoker.getAt(this.selectedIndex);
                if (element !== null) {
                  element.moveBy(dx, dy);
                  this.selectDragStartX = touch.x;
                  this.selectDragStartY = touch.y;
                  this.refreshOffCanvas();
                  this.drawSelectionBox();
                }
              }
              return;
            }
            this.arr.push(event.touches[0].x + event.touches[0].y);
            if (this.selectedIndex >= 0 && this.selectAction === 'move') {
              let touch = event.touches[0];
              let dx = touch.x - this.selectDragStartX;
              let dy = touch.y - this.selectDragStartY;
              let element = this.drawInvoker.getAt(this.selectedIndex);
              if (element !== null) {
                element.moveBy(dx, dy);
                this.selectDragStartX = touch.x;
                this.selectDragStartY = touch.y;
                this.refreshOffCanvas();
                this.drawSelectionBox();
              }
              return;
            }
            this.mBrush.move(this.mPath.path, event.touches[0].x, event.touches[0].y);
            this.mPath.updateBounds(event.touches[0].x, event.touches[0].y);
            if (this.isFountainPen && this.mBrush instanceof FountainPenBrush) {
              this.mPath.isFountainPen = true;
              this.mPath.fountainPenPoints = (this.mBrush as FountainPenBrush).points;
            }
            this.clearTopCanvas();
            if (this.isFountainPen || this.arr.length > 4) {
              this.mPath.draw(this.context);
            }
          }
          if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Up) {
            if (this.selectAction === 'move' || this.selectAction === 'rotate') {
              this.selectAction = '';
              return;
            }
            if (this.isFountainPen && this.mBrush instanceof FountainPenBrush) {
              this.mPath.isFountainPen = true;
              this.mPath.fountainPenPoints = (this.mBrush as FountainPenBrush).points.slice();
            }
            this.add(this.mPath);
            this.appendToOffCanvas(this.mPath);
            this.clearTopCanvas();
            this.arr = [];
            this.redoDraw = false;
            this.unDoDraw = true;
          }
        })
        .scale({
          x: this.scaleValueX,
          y: this.scaleValueY,
          z: CommonConstants.ONE
        })
        .gesture(
          PinchGesture()
            .onActionStart(() => {
              this.index = 1;
            })
            .onActionUpdate((event: GestureEvent) => {
              this.clearTopCanvas();
              if (event) {
                this.scaleValueX = this.pinchValueX * event.scale;
                this.scaleValueY = this.pinchValueY * event.scale;
              }
            })
            .onActionEnd(() => {
              this.pinchValueX = this.scaleValueX;
              this.pinchValueY = this.scaleValueY;
              this.clearTopCanvas();
            })
        )
      Column()
        .width(CommonConstants.ONE_HUNDRED_PERCENT)
        .height(CommonConstants.ONE_HUNDRED_PERCENT)
        .backgroundColor(Color.Transparent)
        .zIndex(this.index)
        .gesture(
          PinchGesture()
            .onActionStart(() => {
              this.index = 1;
            })
            .onActionUpdate((event: GestureEvent) => {
              this.clearTopCanvas();
              if (event) {
                this.scaleValueX = this.pinchValueX * event.scale;
                this.scaleValueY = this.pinchValueY * event.scale;
              }
            })
            .onActionEnd(() => {
              this.clearTopCanvas();
              this.pinchValueX = this.scaleValueX;
              this.pinchValueY = this.scaleValueY;
            })
        )
      Column()
        .width(1)
        .height(1)
        .bindSheet($$this.isTextShow, this.myTextInputSheet(), {
          height: 500,
          backgroundColor: Color.White,
          title: {
            title: $r('app.string.text_tool')
          },
          detents: CommonConstants.DETENTS,
          onWillDisappear: () => {
            this.commitText();
          }
        })
      Row() {
        Stack() {
          Column() {
            Image(this.isPaint && this.index === CommonConstants.NEGATIVE_ONE ? $r('app.media.paintbrush_active') :
            $r('app.media.paintbrush'))
              .width($r('app.float.image_width'))
              .height($r('app.float.image_width'))
              .margin({ bottom: $r('app.float.bottom') })
            Text($r('app.string.paint'))
              .fontSize($r('app.float.font_size_m'))
              .fontColor(this.isPaint && this.index === CommonConstants.NEGATIVE_ONE ? $r('app.color.theme_color') :
              $r('sys.color.mask_secondary'))
          }
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
          .height(CommonConstants.ONE_HUNDRED_PERCENT)

          Button({ type: ButtonType.Normal })
            .backgroundColor(Color.Transparent)
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .height(CommonConstants.ONE_HUNDRED_PERCENT)
            .onClick(() => {
              if (this.isPaint) {
                this.isPaint = false;
                this.isEraser = false;
                this.isShow = false;
                this.selectedIndex = -1;
                this.showShapeMenu = false;
                this.clearTopCanvas();
              } else {
                this.ToggleThicknessColor();
                this.isPaint = true;
                this.isEraser = false;
                this.isShow = !this.isShow;
                this.selectedIndex = -1;
                this.showShapeMenu = false;
                this.clearTopCanvas();
              }
              this.index = -1;
              this.arr = [];
            })
        }
        .bindSheet($$this.isShow, this.myPaintSheet(), {
          height: $r('app.float.height'),
          backgroundColor: Color.White,
          title: {
            title: $r('app.string.paint')
          },
          detents: CommonConstants.DETENTS
        })
        .width($r('app.float.paint_width'))
        .height($r('app.float.paint_height'))

        Stack() {
          Column() {
            Image(this.shapeTool !== '' ? $r('app.media.paintbrush_active') : $r('app.media.paintbrush'))
              .width($r('app.float.image_width'))
              .height($r('app.float.image_width'))
              .margin({ bottom: $r('app.float.bottom') })
            Text($r('app.string.shape_tools'))
              .fontSize($r('app.float.font_size_m'))
              .fontColor(this.shapeTool !== '' ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
          }
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
          .height(CommonConstants.ONE_HUNDRED_PERCENT)

          Button({ type: ButtonType.Normal })
            .backgroundColor(Color.Transparent)
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .height(CommonConstants.ONE_HUNDRED_PERCENT)
            .onClick(() => {
              this.isEraser = false;
              if (this.shapeTool !== '') {
                this.shapeTool = '';
              } else {
                this.isShapeShow = !this.isShapeShow;
              }
            })
        }
        .bindSheet($$this.isShapeShow, this.shapeToolSheet(), {
          height: 300,
          backgroundColor: Color.White,
          detents: CommonConstants.DETENTS
        })
        .width($r('app.float.paint_width'))
        .height($r('app.float.paint_height'))

        Stack() {
          Column() {
            Image(!this.isEraser ? $r('app.media.rubbers') :
            $r('app.media.rubbers_active'))
              .width($r('app.float.image_width'))
              .height($r('app.float.image_width'))
              .margin({ bottom: $r('app.float.bottom') })
            Text($r('app.string.rubber'))
              .fontSize($r('app.float.font_size_m'))
              .fontColor(!this.isEraser ? $r('sys.color.mask_secondary') :
              $r('app.color.theme_color'))

          }
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
          .height(CommonConstants.ONE_HUNDRED_PERCENT)

          Button({ type: ButtonType.Normal })
            .backgroundColor(Color.Transparent)
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .height(CommonConstants.ONE_HUNDRED_PERCENT)
            .onClick(() => {
              this.mPaint = new Paint(CommonConstants.ZERO, CommonConstants.COLOR_STRING, CommonConstants.ONE);
              this.mPaint.setStrokeWidth(this.eraserWidth);
              this.mPaint.setColor(CommonConstants.WHITE);
              this.mPaint.setGlobalAlpha(CommonConstants.ONE);
              this.isPaint = false;
              this.isEraser = true;
              this.isEraserShow = !this.isEraserShow;
            })
        }
        .bindSheet($$this.isEraserShow, this.myEraserSheet(), {
          height: 120,
          backgroundColor: Color.White,
          title: {
            title: $r('app.string.rubber')
          },
          detents: CommonConstants.DETENTS
        })
        .width($r('app.float.paint_width'))
        .height($r('app.float.paint_height'))

        Stack() {
          Column() {
            Image(this.unDoDraw ? $r('app.media.recall_active') : $r('app.media.recall'))
              .width($r('app.float.image_width'))
              .height($r('app.float.image_width'))
              .margin({ bottom: $r('app.float.bottom') })
            Text($r('app.string.redo'))
              .fontSize($r('app.float.font_size_m'))
              .fontColor(this.unDoDraw ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
          }
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
          .height(CommonConstants.ONE_HUNDRED_PERCENT)

          Button({ type: ButtonType.Normal })
            .backgroundColor(Color.Transparent)
            .enabled(this.unDoDraw)
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .height(CommonConstants.ONE_HUNDRED_PERCENT)
            .onClick(() => {
              this.drawOperateUndo();
            })
        }
        .width($r('app.float.paint_width'))
        .height($r('app.float.paint_height'))

        Stack() {
          Column() {
            Image(this.redoDraw ? $r('app.media.redo_active') : $r('app.media.redo'))
              .width($r('app.float.image_width'))
              .height($r('app.float.image_width'))
              .margin({ bottom: $r('app.float.bottom') })
            Text($r('app.string.undo'))
              .fontSize($r('app.float.font_size_m'))
              .fontColor(this.redoDraw ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
          }
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
          .height(CommonConstants.ONE_HUNDRED_PERCENT)

          Button({ type: ButtonType.Normal })
            .backgroundColor(Color.Transparent)
            .enabled(this.redoDraw)
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .height(CommonConstants.ONE_HUNDRED_PERCENT)
            .onClick(() => {
              this.drawOperateRedo();
            })
        }
        .width($r('app.float.paint_width'))
        .height($r('app.float.paint_height'))

        Stack() {
          Column() {
            Image(this.clean ? $r('app.media.clear_active') : $r('app.media.clear'))
              .width($r('app.float.image_width'))
              .height($r('app.float.image_width'))
              .margin({ bottom: $r('app.float.bottom') })
            Text($r('app.string.clear'))
              .fontSize($r('app.float.font_size_m'))
              .fontColor(this.clean ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
          }
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
          .height(CommonConstants.ONE_HUNDRED_PERCENT)

          Button({ type: ButtonType.Normal })
            .backgroundColor(Color.Transparent)
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .height(CommonConstants.ONE_HUNDRED_PERCENT)
            .onClick(() => {
              this.clear();
              this.clean = true;
            })
        }
        .width($r('app.float.paint_width'))
        .height($r('app.float.paint_height'))
      }
      .justifyContent(FlexAlign.SpaceEvenly)
      .alignItems(VerticalAlign.Center)
      .zIndex(CommonConstants.TEN)
    }
    .backgroundColor($r('sys.color.comp_background_focus'))
    .width(CommonConstants.ONE_HUNDRED_PERCENT)
    .height(CommonConstants.ONE_HUNDRED_PERCENT)
  }
}