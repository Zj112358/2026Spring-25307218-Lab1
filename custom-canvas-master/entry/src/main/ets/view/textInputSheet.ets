import { CommonConstants } from '../common/CommonConstants';

class FontSizeItem {
  label: string;
  size: number;

  constructor(label: string, size: number) {
    this.label = label;
    this.size = size;
  }
}

const FONT_SIZE_LIST: FontSizeItem[] = [
  new FontSizeItem('初号', 42),
  new FontSizeItem('小初', 36),
  new FontSizeItem('一号', 26),
  new FontSizeItem('小一', 24),
  new FontSizeItem('二号', 22),
  new FontSizeItem('小二', 18),
  new FontSizeItem('三号', 16),
  new FontSizeItem('小三', 15),
  new FontSizeItem('四号', 14),
  new FontSizeItem('小四', 12),
  new FontSizeItem('五号', 10.5),
  new FontSizeItem('小五', 9),
  new FontSizeItem('六号', 7.5),
  new FontSizeItem('小六', 6.5),
  new FontSizeItem('七号', 5.5),
  new FontSizeItem('八号', 5),
  new FontSizeItem('5', 5),
  new FontSizeItem('5.5', 5.5),
  new FontSizeItem('6.5', 6.5),
  new FontSizeItem('7.5', 7.5),
  new FontSizeItem('8', 8),
  new FontSizeItem('9', 9),
  new FontSizeItem('10', 10),
  new FontSizeItem('10.5', 10.5),
  new FontSizeItem('11', 11),
  new FontSizeItem('12', 12),
  new FontSizeItem('14', 14),
  new FontSizeItem('16', 16),
  new FontSizeItem('18', 18),
  new FontSizeItem('20', 20),
  new FontSizeItem('22', 22),
  new FontSizeItem('24', 24),
  new FontSizeItem('26', 26),
  new FontSizeItem('28', 28),
  new FontSizeItem('36', 36),
  new FontSizeItem('48', 48),
  new FontSizeItem('72', 72),
];

@Component
export struct textInputSheet {
  @Link textContent: string;
  @Link textFontSize: number;
  @Link textFontWeight: FontWeight;
  @Link textFontStyle: FontStyle;
  @Link textColor: string;
  @State selectedFontIndex: number = 9;
  private scroller: Scroller = new Scroller();

  aboutToAppear(): void {
    for (let i = 0; i < FONT_SIZE_LIST.length; i++) {
      if (Math.abs(FONT_SIZE_LIST[i].size - this.textFontSize) < 0.5) {
        this.selectedFontIndex = i;
        break;
      }
    }
  }

  build() {
    Column() {
      Column() {
        Text($r('app.string.text_tool'))
          .textAlign(TextAlign.Start)
          .fontSize($r('app.float.font_size'))
          .fontColor($r('sys.color.mask_secondary'))
          .margin({ bottom: $r('app.float.margin_bottom') })

        TextArea({ text: this.textContent, placeholder: '请输入文字' })
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
          .height($r('app.float.text_area_height'))
          .fontSize($r('app.float.text_area_font'))
          .onChange((value: string) => {
            this.textContent = value;
          })
          .margin({ bottom: 12 })
      }
      .padding({ left: $r('app.float.padding_left'), right: $r('app.float.padding_left') })
      .alignItems(HorizontalAlign.Start)
      .width(CommonConstants.ONE_HUNDRED_PERCENT)
      .margin({ bottom: $r('app.float.margin_bottom') })

      Column() {
        Text($r('app.string.font_size_label'))
          .textAlign(TextAlign.Start)
          .fontSize($r('app.float.font_size'))
          .fontColor($r('sys.color.mask_secondary'))
          .margin({ bottom: $r('app.float.margin_top') })
        Row() {
          Column() {
            Row() {
              Image($r('sys.media.ohos_ic_public_arrow_up'))
                .width($r('app.float.rgb_label_width'))
                .height($r('app.float.rgb_label_width'))
                .fillColor(Color.White)
            }
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .height($r('app.float.rgb_value_width'))
            .justifyContent(FlexAlign.Center)
            .backgroundColor('#333333')
            .borderRadius({ topLeft: 6, topRight: 6 })
            .onClick(() => {
              let idx = Math.max(0, this.selectedFontIndex - 1);
              this.scroller.scrollToIndex(idx);
            })

            List({ space: 0, scroller: this.scroller, initialIndex: this.selectedFontIndex }) {
              ForEach(FONT_SIZE_LIST, (item: FontSizeItem, index: number) => {
                ListItem() {
                  Row() {
                    Text(item.label)
                      .fontSize($r('app.float.font_list_item_font'))
                      .fontColor(this.selectedFontIndex === index ? '#0A59F7' : Color.White)
                      .fontWeight(this.selectedFontIndex === index ? FontWeight.Bold : FontWeight.Normal)
                  }
                  .width(CommonConstants.ONE_HUNDRED_PERCENT)
                  .height($r('app.float.font_list_item_height'))
                  .justifyContent(FlexAlign.Center)
                  .backgroundColor(this.selectedFontIndex === index ? '#4D4D4D' : '#333333')
                  .onClick(() => {
                    this.selectedFontIndex = index;
                    this.textFontSize = item.size;
                  })
                }
              }, (item: FontSizeItem, index: number) => `fontSize_${index}`)
            }
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .height($r('app.float.font_list_height'))
            .backgroundColor('#333333')
            .scrollBar(BarState.Off)
            .edgeEffect(EdgeEffect.None)

            Row() {
              Image($r('sys.media.ohos_ic_public_arrow_down'))
                .width($r('app.float.rgb_label_width'))
                .height($r('app.float.rgb_label_width'))
                .fillColor(Color.White)
            }
            .width(CommonConstants.ONE_HUNDRED_PERCENT)
            .height($r('app.float.rgb_value_width'))
            .justifyContent(FlexAlign.Center)
            .backgroundColor('#333333')
            .borderRadius({ bottomLeft: 6, bottomRight: 6 })
            .onClick(() => {
              let idx = Math.min(FONT_SIZE_LIST.length - 1, this.selectedFontIndex + 1);
              this.scroller.scrollToIndex(idx);
            })
          }
          .width($r('app.float.font_list_width'))
          .borderRadius(6)
          .clip(true)

          Column() {
            Stack() {
              Text()
                .width($r('app.float.bold_btn_width'))
                .height($r('app.float.bold_btn_height'))
                .borderRadius($r('app.float.bold_btn_radius'))
                .backgroundColor(this.textFontWeight === FontWeight.Bold ? $r('app.color.theme_color') : '#F1F3F5')
              Text('B')
                .fontSize($r('app.float.bold_btn_font'))
                .fontWeight(FontWeight.Bold)
                .fontColor(this.textFontWeight === FontWeight.Bold ? Color.White : Color.Black)
            }
            .width($r('app.float.bold_btn_width'))
            .height($r('app.float.bold_btn_height'))
            .onClick(() => {
              this.textFontWeight = this.textFontWeight === FontWeight.Bold ? FontWeight.Normal : FontWeight.Bold;
            })
          }
          .margin({ left: 16 })

          Column() {
            Stack() {
              Text()
                .width($r('app.float.bold_btn_width'))
                .height($r('app.float.bold_btn_height'))
                .borderRadius($r('app.float.bold_btn_radius'))
                .backgroundColor(this.textFontStyle === FontStyle.Italic ? $r('app.color.theme_color') : '#F1F3F5')
              Text('I')
                .fontSize($r('app.float.bold_btn_font'))
                .fontStyle(FontStyle.Italic)
                .fontColor(this.textFontStyle === FontStyle.Italic ? Color.White : Color.Black)
            }
            .width($r('app.float.bold_btn_width'))
            .height($r('app.float.bold_btn_height'))
            .onClick(() => {
              this.textFontStyle = this.textFontStyle === FontStyle.Italic ? FontStyle.Normal : FontStyle.Italic;
            })
          }
          .margin({ left: 12 })

          Text(FONT_SIZE_LIST[this.selectedFontIndex].size % 1 === 0 ?
            FONT_SIZE_LIST[this.selectedFontIndex].size.toFixed(0) :
            FONT_SIZE_LIST[this.selectedFontIndex].size.toString())
            .fontSize($r('app.float.rgb_value_font'))
            .fontColor($r('sys.color.mask_secondary'))
            .margin({ left: 8 })
        }
        .padding({ left: $r('app.float.margin_top'), right: $r('app.float.margin_top') })
        .alignItems(VerticalAlign.Center)
        .width(CommonConstants.ONE_HUNDRED_PERCENT)
      }
      .padding({ left: $r('app.float.padding_left'), right: $r('app.float.padding_left') })
      .alignItems(HorizontalAlign.Start)
      .width(CommonConstants.ONE_HUNDRED_PERCENT)
      .margin({ bottom: $r('app.float.margin_bottom') })

      Column() {
        Row() {
          Text($r('app.string.color'))
            .fontSize($r('app.float.font_size'))
            .fontColor($r('sys.color.mask_secondary'))
        }
        .margin({ bottom: $r('app.float.margin_bottom') })

        Row() {
          ForEach(CommonConstants.COLOR_GRAY_ROW, (item: string) => {
            Stack() {
              Text()
                .width($r('app.float.color_grid_width'))
                .height($r('app.float.color_grid_height'))
                .backgroundColor(item)
              if (this.textColor === item) {
                Text()
                  .width($r('app.float.color_grid_width'))
                  .height($r('app.float.color_grid_height'))
                  .borderWidth(2)
                  .borderColor(Color.White)
              }
            }
            .width($r('app.float.color_grid_width'))
            .height($r('app.float.color_grid_height'))
            .onClick(() => {
              this.textColor = item;
            })
          }, (item: string, index: number) => `text_gray_${index}`)
        }
        .width(CommonConstants.ONE_HUNDRED_PERCENT)

        ForEach(CommonConstants.COLOR_GRID, (row: string[], rowIndex: number) => {
          Row() {
            ForEach(row, (item: string, colIndex: number) => {
              Stack() {
                Text()
                  .width($r('app.float.color_grid_width'))
                  .height($r('app.float.color_grid_height'))
                  .backgroundColor(item)
                if (this.textColor === item) {
                  Text()
                    .width($r('app.float.color_grid_width'))
                    .height($r('app.float.color_grid_height'))
                    .borderWidth(2)
                    .borderColor(Color.White)
                }
              }
              .width($r('app.float.color_grid_width'))
              .height($r('app.float.color_grid_height'))
              .onClick(() => {
                this.textColor = item;
              })
            }, (item: string, colIndex: number) => `text_grid_${rowIndex}_${colIndex}`)
          }
          .width(CommonConstants.ONE_HUNDRED_PERCENT)
        }, (row: string[], rowIndex: number) => `text_row_${rowIndex}`)
      }
      .padding({ left: $r('app.float.padding_left'), right: $r('app.float.padding_left') })
      .alignItems(HorizontalAlign.Start)
      .width(CommonConstants.ONE_HUNDRED_PERCENT)
    }
    .width(CommonConstants.ONE_HUNDRED_PERCENT)
    .height(CommonConstants.ONE_HUNDRED_PERCENT)
  }
}
