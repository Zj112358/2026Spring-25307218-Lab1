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
import DrawPath, { ShapeDraw } from '../viewmodel/IDraw';
import { IBrush } from '../viewmodel/IBrush';
import NormalBrush from '../viewmodel/IBrush';
import { FountainPenBrush } from '../viewmodel/IBrush';
import Paint from '../viewmodel/Paint';
import { CommonConstants } from '../common/CommonConstants';
import { myPaintSheet } from '../view/myPaintSheet';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';

@Entry
@Component
struct DrawCanvas {
  @State @Watch('createDraw') isDrawing: boolean = false;
  @State unDoDraw: boolean = false;
  @State redoDraw: boolean = false;
  @State isPaint: boolean = true;
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
  private compassCenterFixed: boolean = false;
  private compassCenterX: number = 0;
  private compassCenterY: number = 0;
  private compassStartAngle: number = 0;
  private compassDrawing: boolean = false;

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
    this.refreshOffCanvas();
    this.redoDraw = false;
    this.unDoDraw = false;
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
  shapeToolSheet() {
    Column() {
      Text($r('app.string.shape_tools'))
        .fontSize(16)
        .fontColor($r('sys.color.mask_secondary'))
        .margin({ top: 16, bottom: 12 })
      Row() {
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
          Text($r('app.string.compass'))
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
      }
      .justifyContent(FlexAlign.SpaceEvenly)
      .width(CommonConstants.ONE_HUNDRED_PERCENT)
      .padding({ left: 24, right: 24, bottom: 20 })
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
          if (this.shapeTool !== '') {
            if (this.shapeTool === 'circle') {
              if (event.type === TouchType.Down && event.touches.length > 0) {
                let touch = event.touches[0];
                if (!this.compassCenterFixed) {
                  this.compassCenterX = touch.x;
                  this.compassCenterY = touch.y;
                  this.compassCenterFixed = true;
                  this.compassDrawing = false;
                } else {
                  let dx = touch.x - this.compassCenterX;
                  let dy = touch.y - this.compassCenterY;
                  this.compassStartAngle = Math.atan2(dy, dx);
                  this.compassDrawing = true;
                }
              }
              if (event.type === TouchType.Move && event.touches.length > 0) {
                let touch = event.touches[0];
                if (this.compassDrawing) {
                  this.clearTopCanvas();
                  let ctx = this.context;
                  let dx = touch.x - this.compassCenterX;
                  let dy = touch.y - this.compassCenterY;
                  let radius = Math.sqrt(dx * dx + dy * dy);
                  let currentAngle = Math.atan2(dy, dx);
                  ctx.lineWidth = this.mPaint.lineWidth;
                  ctx.strokeStyle = this.mPaint.StrokeStyle;
                  ctx.globalAlpha = this.mPaint.globalAlpha;
                  ctx.lineCap = 'round';
                  ctx.beginPath();
                  ctx.arc(this.compassCenterX, this.compassCenterY, radius, this.compassStartAngle, currentAngle);
                  ctx.stroke();
                  ctx.beginPath();
                  ctx.arc(this.compassCenterX, this.compassCenterY, 5, 0, 2 * Math.PI);
                  ctx.fillStyle = this.mPaint.StrokeStyle;
                  ctx.fill();
                } else if (this.compassCenterFixed) {
                  this.compassDrawing = true;
                  this.compassStartAngle = 0;
                  this.clearTopCanvas();
                  let ctx = this.context;
                  let dx = touch.x - this.compassCenterX;
                  let dy = touch.y - this.compassCenterY;
                  let radius = Math.sqrt(dx * dx + dy * dy);
                  ctx.lineWidth = this.mPaint.lineWidth;
                  ctx.strokeStyle = this.mPaint.StrokeStyle;
                  ctx.globalAlpha = this.mPaint.globalAlpha;
                  ctx.lineCap = 'round';
                  ctx.beginPath();
                  ctx.arc(this.compassCenterX, this.compassCenterY, radius, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              }
              if (event.type === TouchType.Up && event.touches.length > 0) {
                let touch = event.touches[0];
                if (this.compassDrawing) {
                  let dx = touch.x - this.compassCenterX;
                  let dy = touch.y - this.compassCenterY;
                  let radius = Math.sqrt(dx * dx + dy * dy);
                  if (radius < 1) {
                    this.compassDrawing = false;
                    this.compassCenterFixed = false;
                    this.clearTopCanvas();
                    return;
                  }
                  let endAngle = Math.atan2(dy, dx);
                  let shape: ShapeDraw;
                  if (this.compassStartAngle === 0) {
                    shape = new ShapeDraw(this.mPaint, 'circle',
                      this.compassCenterX, this.compassCenterY, touch.x, touch.y,
                      0, 2 * Math.PI);
                  } else {
                    shape = new ShapeDraw(this.mPaint, 'circle',
                      this.compassCenterX, this.compassCenterY, touch.x, touch.y,
                      this.compassStartAngle, endAngle);
                  }
                  this.add(shape);
                  this.appendToOffCanvas(shape);
                  this.clearTopCanvas();
                  this.compassDrawing = false;
                  this.compassCenterFixed = false;
                  this.redoDraw = false;
                  this.unDoDraw = true;
                } else {
                  this.compassCenterFixed = true;
                  let ctx = this.context;
                  ctx.beginPath();
                  ctx.arc(this.compassCenterX, this.compassCenterY, 5, 0, 2 * Math.PI);
                  ctx.fillStyle = this.mPaint.StrokeStyle;
                  ctx.globalAlpha = this.mPaint.globalAlpha;
                  ctx.fill();
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
          this.arr.push(event.touches[0].x + event.touches[0].y);
          if (event.touches.length > 1) {
            return;
          }
          if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Down) {
            this.mPath = new DrawPath(this.mPaint, this.path2Db);
            this.mPath.paint = this.mPaint;
            this.mPath.path = new Path2D();
            this.mBrush.down(this.mPath.path, event.touches[0].x, event.touches[0].y);
          }
          if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Move) {
            this.mBrush.move(this.mPath.path, event.touches[0].x, event.touches[0].y);
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
              this.ToggleThicknessColor();
              this.isPaint = true;
              this.isShow = !this.isShow;
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
              if (this.shapeTool !== '') {
                this.shapeTool = '';
              } else {
                this.isShapeShow = !this.isShapeShow;
              }
            })
        }
        .bindSheet($$this.isShapeShow, this.shapeToolSheet(), {
          height: 140,
          backgroundColor: Color.White,
          detents: CommonConstants.DETENTS
        })
        .width($r('app.float.paint_width'))
        .height($r('app.float.paint_height'))

        Stack() {
          Column() {
            Image(this.isPaint || this.index === CommonConstants.ONE ? $r('app.media.rubbers') :
            $r('app.media.rubbers_active'))
              .width($r('app.float.image_width'))
              .height($r('app.float.image_width'))
              .margin({ bottom: $r('app.float.bottom') })
            Text($r('app.string.rubber'))
              .fontSize($r('app.float.font_size_m'))
              .fontColor(this.isPaint || this.index === CommonConstants.ONE ? $r('sys.color.mask_secondary') :
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
              this.mPaint.setStrokeWidth(CommonConstants.TEN);
              this.mPaint.setColor(CommonConstants.WHITE);
              this.mPaint.setGlobalAlpha(CommonConstants.ONE);
              this.isPaint = false;
            })
        }
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