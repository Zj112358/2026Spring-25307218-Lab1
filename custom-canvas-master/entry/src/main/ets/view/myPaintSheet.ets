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

import { CommonConstants } from '../common/CommonConstants';
import { IBrush } from '../viewmodel/IBrush';
import NormalBrush from '../viewmodel/IBrush';
import { FountainPenBrush } from '../viewmodel/IBrush';
import Paint from '../viewmodel/Paint';

@Component
export struct myPaintSheet {
  @Link isMarker: boolean;
  @Link isFountainPen: boolean;
  @Link shapeTool: string;
  @Link alpha: number;
  @Link percent: string;
  @Link color: string;
  @Link strokeWidth: number;
  @State colorMode: number = 0;
  @State redValue: number = 0;
  @State greenValue: number = 0;
  @State blueValue: number = 0;
  @Consume mPaint: Paint;
  @Consume mBrush: IBrush;

  aboutToAppear(): void {
    this.syncRgbFromColor();
  }

  updateColorFromRgb(): void {
    let r = Math.round(this.redValue).toString(16).padStart(2, '0');
    let g = Math.round(this.greenValue).toString(16).padStart(2, '0');
    let b = Math.round(this.blueValue).toString(16).padStart(2, '0');
    this.color = ('#' + r + g + b).toUpperCase();
  }

  syncRgbFromColor(): void {
    let hex = this.color.replace('#', '');
    if (hex.length === 6) {
      this.redValue = parseInt(hex.substring(0, 2), 16);
      this.greenValue = parseInt(hex.substring(2, 4), 16);
      this.blueValue = parseInt(hex.substring(4, 6), 16);
    }
  }

  ToggleThicknessColor() {
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

  build() {
    Column() {
      Column() {
        Text($r('app.string.brash'))
          .textAlign(TextAlign.Start)
          .fontSize($r('app.float.font_size'))
          .fontColor($r('sys.color.mask_secondary'))
          .margin({ bottom: $r('app.float.margin_bottom') })
        Row() {
          Column() {
            Stack() {
              Text()
                .width($r('app.float.back_width'))
                .height($r('app.float.back_width'))
                .backgroundColor(this.isMarker || this.isFountainPen ? $r('app.color.paint_color') : $r('app.color.theme_color'))
                .borderRadius($r('app.float.border_radius'))
              Image(this.isMarker || this.isFountainPen ? $r('app.media.Ballpoint') : $r('app.media.Ballpoint_active'))
                .width($r('app.float.image_width'))
                .height($r('app.float.image_width'))
              Button({ type: ButtonType.Normal })
                .width($r('app.float.back_width'))
                .height($r('app.float.back_width'))
                .borderRadius($r('app.float.border_radius'))
                .backgroundColor(Color.Transparent)
                .onClick(() => {
                  this.isMarker = false;
                  this.isFountainPen = false;
                  this.alpha = 1;
                  this.percent = '100';
                  this.ToggleThicknessColor();
                })
            }

            Text($r('app.string.ballpoint'))
              .fontSize($r('app.float.font_size'))
              .fontColor(this.isMarker || this.isFountainPen ? $r('sys.color.mask_secondary') : $r('app.color.theme_color'))
              .margin({ top: $r('app.float.margin_top') })
          }
          .width($r('app.float.brash_width'))
          .height($r('app.float.brash_height'))

          Column() {
            Stack() {
              Text()
                .width($r('app.float.back_width'))
                .height($r('app.float.back_width'))
                .backgroundColor(this.isMarker && !this.isFountainPen ? $r('app.color.theme_color') : $r('app.color.paint_color'))
                .borderRadius($r('app.float.border_radius'))
              Image(this.isMarker && !this.isFountainPen ? $r('app.media.marker_active') : $r('app.media.marker'))
                .width($r('app.float.image_width'))
                .height($r('app.float.image_width'))
              Button({ type: ButtonType.Normal })
                .width($r('app.float.back_width'))
                .height($r('app.float.back_width'))
                .borderRadius($r('app.float.border_radius'))
                .backgroundColor(Color.Transparent)
                .onClick(() => {
                  this.isMarker = true;
                  this.isFountainPen = false;
                  this.alpha = 0.5;
                  this.percent = '50';
                  this.ToggleThicknessColor();
                })
            }

            Text($r('app.string.marker'))
              .fontSize($r('app.float.font_size'))
              .fontColor(this.isMarker && !this.isFountainPen ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
              .margin({ top: $r('app.float.margin_top') })
          }
          .width($r('app.float.brash_width'))
          .height($r('app.float.brash_height'))

          Column() {
            Stack() {
              Text()
                .width($r('app.float.back_width'))
                .height($r('app.float.back_width'))
                .backgroundColor(this.isFountainPen ? $r('app.color.theme_color') : $r('app.color.paint_color'))
                .borderRadius($r('app.float.border_radius'))
              Image(this.isFountainPen ? $r('app.media.fountain_active') : $r('app.media.fountain'))
                .width($r('app.float.image_width'))
                .height($r('app.float.image_width'))
              Button({ type: ButtonType.Normal })
                .width($r('app.float.back_width'))
                .height($r('app.float.back_width'))
                .borderRadius($r('app.float.border_radius'))
                .backgroundColor(Color.Transparent)
                .onClick(() => {
                  this.isFountainPen = true;
                  this.isMarker = false;
                  this.alpha = 1;
                  this.percent = '100';
                  this.ToggleThicknessColor();
                })
            }

            Text($r('app.string.fountain_pen'))
              .fontSize($r('app.float.font_size'))
              .fontColor(this.isFountainPen ? $r('app.color.theme_color') : $r('sys.color.mask_secondary'))
              .margin({ top: $r('app.float.margin_top') })
          }
          .width($r('app.float.brash_width'))
          .height($r('app.float.brash_height'))
        }
        .padding({
          left: $r('app.float.margin_top'),
          right: $r('app.float.margin_top')
        })
        .width(CommonConstants.ONE_HUNDRED_PERCENT)
        .justifyContent(FlexAlign.SpaceBetween)
      }
      .padding({
        left: $r('app.float.padding_left'),
        right: $r('app.float.padding_left'),
        top: $r('app.float.margin_bottom')
      })
      .alignItems(HorizontalAlign.Start)
      .width(CommonConstants.ONE_HUNDRED_PERCENT)
      .margin({ bottom: $r('app.float.title_bottom') })

      Column() {
        Row() {
          Text($r('app.string.color'))
            .fontSize($r('app.float.font_size'))
            .fontColor($r('sys.color.mask_secondary'))
          Text(this.colorMode === 0 ? $r('app.string.color_grid') : $r('app.string.rgb_slider'))
            .fontSize(12)
            .fontColor($r('app.color.theme_color'))
            .margin({ left: 12 })
            .onClick(() => {
              this.colorMode = (this.colorMode + 1) % 2;
            })
        }
        .margin({ bottom: $r('app.float.margin_bottom') })

        if (this.colorMode === 0) {
          Column() {
            Row() {
              ForEach(CommonConstants.COLOR_GRAY_ROW, (item: string) => {
                Stack() {
                  Text()
                    .width(26)
                    .height(20)
                    .backgroundColor(item)
                  if (this.color === item) {
                    Text()
                      .width(26)
                      .height(20)
                      .borderWidth(2)
                      .borderColor(Color.White)
                  }
                }
                .width(26)
                .height(20)
                .onClick(() => {
                  this.color = item;
                  this.syncRgbFromColor();
                  this.ToggleThicknessColor();
                })
              }, (item: string, index: number) => `gray_${index}`)
            }
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .justifyContent(FlexAlign.SpaceEvenly)

            ForEach(CommonConstants.COLOR_GRID, (row: string[], rowIndex: number) => {
              Row() {
                ForEach(row, (item: string, colIndex: number) => {
                  Stack() {
                    Text()
                      .width(26)
                      .height(20)
                      .backgroundColor(item)
                    if (this.color === item) {
                      Text()
                        .width(26)
                        .height(20)
                        .borderWidth(2)
                        .borderColor(Color.White)
                    }
                  }
                  .width(26)
                  .height(20)
                  .onClick(() => {
                    this.color = item;
                    this.syncRgbFromColor();
                    this.ToggleThicknessColor();
                  })
                }, (item: string, colIndex: number) => `grid_${rowIndex}_${colIndex}`)
              }
              .width(CommonConstants.ONE_HUNDRED_PERCENT)
              .justifyContent(FlexAlign.SpaceEvenly)
              .margin({ top: 1 })
            }, (row: string[], rowIndex: number) => `row_${rowIndex}`)
          }
          .padding({
            left: $r('app.float.margin_top'),
            right: $r('app.float.margin_top')
          })
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
        } else {
          Column() {
            Row() {
              Text('R')
                .fontSize(12)
                .fontColor('#E90808')
                .width(16)
                .textAlign(TextAlign.Center)
              Slider({ value: this.redValue, min: 0, max: 255 })
                .width($r('app.float.slider_width'))
                .selectedColor('#E90808')
                .trackColor(Color.Black)
                .blockColor('#E90808')
                .minResponsiveDistance(CommonConstants.ONE)
                .onChange((value: number) => {
                  this.redValue = value;
                  this.updateColorFromRgb();
                  this.ToggleThicknessColor();
                })
              Text(Math.round(this.redValue).toString())
                .fontSize(11)
                .fontColor($r('sys.color.mask_secondary'))
                .width(28)
                .textAlign(TextAlign.Center)
            }
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .justifyContent(FlexAlign.SpaceBetween)
            .alignItems(VerticalAlign.Center)

            Row() {
              Text('G')
                .fontSize(12)
                .fontColor('#63B959')
                .width(16)
                .textAlign(TextAlign.Center)
              Slider({ value: this.greenValue, min: 0, max: 255 })
                .width($r('app.float.slider_width'))
                .selectedColor('#63B959')
                .trackColor(Color.Black)
                .blockColor('#63B959')
                .minResponsiveDistance(CommonConstants.ONE)
                .onChange((value: number) => {
                  this.greenValue = value;
                  this.updateColorFromRgb();
                  this.ToggleThicknessColor();
                })
              Text(Math.round(this.greenValue).toString())
                .fontSize(11)
                .fontColor($r('sys.color.mask_secondary'))
                .width(28)
                .textAlign(TextAlign.Center)
            }
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .justifyContent(FlexAlign.SpaceBetween)
            .alignItems(VerticalAlign.Center)
            .margin({ top: 4 })

            Row() {
              Text('B')
                .fontSize(12)
                .fontColor('#0A59F7')
                .width(16)
                .textAlign(TextAlign.Center)
              Slider({ value: this.blueValue, min: 0, max: 255 })
                .width($r('app.float.slider_width'))
                .selectedColor('#0A59F7')
                .trackColor(Color.Black)
                .blockColor('#0A59F7')
                .minResponsiveDistance(CommonConstants.ONE)
                .onChange((value: number) => {
                  this.blueValue = value;
                  this.updateColorFromRgb();
                  this.ToggleThicknessColor();
                })
              Text(Math.round(this.blueValue).toString())
                .fontSize(11)
                .fontColor($r('sys.color.mask_secondary'))
                .width(28)
                .textAlign(TextAlign.Center)
            }
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .justifyContent(FlexAlign.SpaceBetween)
            .alignItems(VerticalAlign.Center)
            .margin({ top: 4 })
          }
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
          .padding({
            left: $r('app.float.margin_top'),
            right: $r('app.float.margin_top')
          })
        }

        Row() {
          Text($r('app.string.current_color'))
            .fontSize(12)
            .fontColor($r('sys.color.mask_secondary'))
          Text()
            .width(18)
            .height(18)
            .borderRadius(9)
            .backgroundColor(this.color)
            .borderWidth(1)
            .borderColor('#D9D9D9')
            .margin({ left: 8 })
        }
        .margin({ top: 6 })
      }
      .padding({
        left: $r('app.float.padding_left'),
        right: $r('app.float.padding_left')
      })
      .alignItems(HorizontalAlign.Start)
      .width(CommonConstants.ONE_HUNDRED_PERCENT)
      .margin({ bottom: $r('app.float.margin_bottom') })

      Column() {
        Text($r('app.string.opacity'))
          .textAlign(TextAlign.Start)
          .fontSize($r('app.float.font_size'))
          .fontColor($r('sys.color.mask_secondary'))
          .margin({ bottom: $r('app.float.margin_top') })
        Row() {
          Slider({
            style: SliderStyle.InSet,
            value: this.alpha * CommonConstants.ONE_HUNDRED
          })
            .height($r('app.float.brash_width'))
            .width($r('app.float.slider_width'))
            .selectedColor(Color.Transparent)
            .minResponsiveDistance(CommonConstants.ONE)
            .trackColor(new LinearGradient([
              { color: $r('app.color.linear_start'), offset: CommonConstants.ZERO },
              { color: $r('app.color.linear_end'), offset: CommonConstants.ONE }
            ]))
            .onChange((value: number) => {
              this.alpha = value / 100;
              this.percent = value.toFixed(0);
              this.ToggleThicknessColor();
            })

          Text(this.percent + CommonConstants.SIGN)
            .width($r('app.float.number'))
            .height($r('app.float.image_width'))
            .fontSize($r('app.float.font_size_l'))
            .borderRadius($r('app.float.border_radius_m'))
            .textAlign(TextAlign.Center)
            .backgroundColor($r('app.color.number_color'))
        }
        .padding({
          left: $r('app.float.margin_top'),
          right: $r('app.float.margin_top')
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
      .margin({ bottom: $r('app.float.margin_bottom') })

      Column() {
        Text($r('app.string.thicknesses'))
          .textAlign(TextAlign.Start)
          .fontSize($r('app.float.font_size'))
          .fontColor($r('sys.color.mask_secondary'))
          .margin({ bottom: $r('app.float.margin_bottom') })
        Row() {
          Slider({
            value: this.strokeWidth,
            min: CommonConstants.THREE,
            max: CommonConstants.TWENTY_ONE,
            step: 1
          })
            .width($r('app.float.slider_width'))
            .minResponsiveDistance(CommonConstants.ONE)
            .onChange((value: number, _mode: SliderChangeMode) => {
              this.strokeWidth = value;
              this.ToggleThicknessColor();
            })
          Text(this.strokeWidth.toFixed(0))
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
}