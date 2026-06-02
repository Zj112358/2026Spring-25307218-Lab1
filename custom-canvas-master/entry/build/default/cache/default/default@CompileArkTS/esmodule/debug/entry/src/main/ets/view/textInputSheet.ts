if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface textInputSheet_Params {
    textContent?: string;
    textFontSize?: number;
    textFontWeight?: FontWeight;
    textFontStyle?: FontStyle;
    textColor?: string;
    selectedFontIndex?: number;
    scroller?: Scroller;
}
import { CommonConstants } from "@bundle:com.example.customcanvas/entry/ets/common/CommonConstants";
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
export class textInputSheet extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__textContent = new SynchedPropertySimpleTwoWayPU(params.textContent, this, "textContent");
        this.__textFontSize = new SynchedPropertySimpleTwoWayPU(params.textFontSize, this, "textFontSize");
        this.__textFontWeight = new SynchedPropertySimpleTwoWayPU(params.textFontWeight, this, "textFontWeight");
        this.__textFontStyle = new SynchedPropertySimpleTwoWayPU(params.textFontStyle, this, "textFontStyle");
        this.__textColor = new SynchedPropertySimpleTwoWayPU(params.textColor, this, "textColor");
        this.__selectedFontIndex = new ObservedPropertySimplePU(9, this, "selectedFontIndex");
        this.scroller = new Scroller();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: textInputSheet_Params) {
        if (params.selectedFontIndex !== undefined) {
            this.selectedFontIndex = params.selectedFontIndex;
        }
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
    }
    updateStateVars(params: textInputSheet_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__textContent.purgeDependencyOnElmtId(rmElmtId);
        this.__textFontSize.purgeDependencyOnElmtId(rmElmtId);
        this.__textFontWeight.purgeDependencyOnElmtId(rmElmtId);
        this.__textFontStyle.purgeDependencyOnElmtId(rmElmtId);
        this.__textColor.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedFontIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__textContent.aboutToBeDeleted();
        this.__textFontSize.aboutToBeDeleted();
        this.__textFontWeight.aboutToBeDeleted();
        this.__textFontStyle.aboutToBeDeleted();
        this.__textColor.aboutToBeDeleted();
        this.__selectedFontIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __textContent: SynchedPropertySimpleTwoWayPU<string>;
    get textContent() {
        return this.__textContent.get();
    }
    set textContent(newValue: string) {
        this.__textContent.set(newValue);
    }
    private __textFontSize: SynchedPropertySimpleTwoWayPU<number>;
    get textFontSize() {
        return this.__textFontSize.get();
    }
    set textFontSize(newValue: number) {
        this.__textFontSize.set(newValue);
    }
    private __textFontWeight: SynchedPropertySimpleTwoWayPU<FontWeight>;
    get textFontWeight() {
        return this.__textFontWeight.get();
    }
    set textFontWeight(newValue: FontWeight) {
        this.__textFontWeight.set(newValue);
    }
    private __textFontStyle: SynchedPropertySimpleTwoWayPU<FontStyle>;
    get textFontStyle() {
        return this.__textFontStyle.get();
    }
    set textFontStyle(newValue: FontStyle) {
        this.__textFontStyle.set(newValue);
    }
    private __textColor: SynchedPropertySimpleTwoWayPU<string>;
    get textColor() {
        return this.__textColor.get();
    }
    set textColor(newValue: string) {
        this.__textColor.set(newValue);
    }
    private __selectedFontIndex: ObservedPropertySimplePU<number>;
    get selectedFontIndex() {
        return this.__selectedFontIndex.get();
    }
    set selectedFontIndex(newValue: number) {
        this.__selectedFontIndex.set(newValue);
    }
    private scroller: Scroller;
    aboutToAppear(): void {
        for (let i = 0; i < FONT_SIZE_LIST.length; i++) {
            if (Math.abs(FONT_SIZE_LIST[i].size - this.textFontSize) < 0.5) {
                this.selectedFontIndex = i;
                break;
            }
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ left: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }, right: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.margin({ bottom: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777252, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ bottom: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ text: this.textContent, placeholder: '请输入文字' });
            TextArea.width(CommonConstants.ONE_HUNDRED_PERCENT);
            TextArea.height({ "id": 16777337, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            TextArea.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            TextArea.onChange((value: string) => {
                this.textContent = value;
            });
            TextArea.margin({ bottom: 12 });
        }, TextArea);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ left: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }, right: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.margin({ bottom: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777234, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ bottom: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }, right: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
            Row.alignItems(VerticalAlign.Center);
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Column.borderRadius(6);
            Column.clip(true);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Row.height({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Row.justifyContent(FlexAlign.Center);
            Row.backgroundColor('#333333');
            Row.borderRadius({ topLeft: 6, topRight: 6 });
            Row.onClick(() => {
                let idx = Math.max(0, this.selectedFontIndex - 1);
                this.scroller.scrollToIndex(idx);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125830089, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.fillColor(Color.White);
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 0, scroller: this.scroller, initialIndex: this.selectedFontIndex });
            List.width(CommonConstants.ONE_HUNDRED_PERCENT);
            List.height({ "id": 16777325, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            List.backgroundColor('#333333');
            List.scrollBar(BarState.Off);
            List.edgeEffect(EdgeEffect.None);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
                            Row.height({ "id": 16777327, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                            Row.justifyContent(FlexAlign.Center);
                            Row.backgroundColor(this.selectedFontIndex === index ? '#4D4D4D' : '#333333');
                            Row.onClick(() => {
                                this.selectedFontIndex = index;
                                this.textFontSize = item.size;
                            });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.label);
                            Text.fontSize({ "id": 16777326, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                            Text.fontColor(this.selectedFontIndex === index ? '#0A59F7' : Color.White);
                            Text.fontWeight(this.selectedFontIndex === index ? FontWeight.Bold : FontWeight.Normal);
                        }, Text);
                        Text.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, FONT_SIZE_LIST, forEachItemGenFunction, (item: FontSizeItem, index: number) => `fontSize_${index}`, true, true);
        }, ForEach);
        ForEach.pop();
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Row.height({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Row.justifyContent(FlexAlign.Center);
            Row.backgroundColor('#333333');
            Row.borderRadius({ bottomLeft: 6, bottomRight: 6 });
            Row.onClick(() => {
                let idx = Math.min(FONT_SIZE_LIST.length - 1, this.selectedFontIndex + 1);
                this.scroller.scrollToIndex(idx);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125830090, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.fillColor(Color.White);
        }, Image);
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ left: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width({ "id": 16777318, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777316, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.onClick(() => {
                this.textFontWeight = this.textFontWeight === FontWeight.Bold ? FontWeight.Normal : FontWeight.Bold;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777318, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777316, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor(this.textFontWeight === FontWeight.Bold ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('B');
            Text.fontSize({ "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.textFontWeight === FontWeight.Bold ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width({ "id": 16777318, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777316, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.onClick(() => {
                this.textFontStyle = this.textFontStyle === FontStyle.Italic ? FontStyle.Normal : FontStyle.Italic;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777318, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777316, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor(this.textFontStyle === FontStyle.Italic ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('I');
            Text.fontSize({ "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontStyle(FontStyle.Italic);
            Text.fontColor(this.textFontStyle === FontStyle.Italic ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(FONT_SIZE_LIST[this.selectedFontIndex].size % 1 === 0 ?
                FONT_SIZE_LIST[this.selectedFontIndex].size.toFixed(0) :
                FONT_SIZE_LIST[this.selectedFontIndex].size.toString());
            Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ left: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }, right: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ bottom: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.width({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                    Stack.height({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                    Stack.onClick(() => {
                        this.textColor = item;
                    });
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create();
                    Text.width({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                    Text.height({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                    Text.backgroundColor(item);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.textColor === item) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create();
                                Text.width({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                                Text.height({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                                Text.borderWidth(2);
                                Text.borderColor(Color.White);
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Stack.pop();
            };
            this.forEachUpdateFunction(elmtId, CommonConstants.COLOR_GRAY_ROW, forEachItemGenFunction, (item: string, index: number) => `text_gray_${index}`, false, true);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, rowIndex: number) => {
                const row = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    ForEach.create();
                    const forEachItemGenFunction = (_item, colIndex: number) => {
                        const item = _item;
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Stack.create();
                            Stack.width({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                            Stack.height({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                            Stack.onClick(() => {
                                this.textColor = item;
                            });
                        }, Stack);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create();
                            Text.width({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                            Text.height({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                            Text.backgroundColor(item);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (this.textColor === item) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create();
                                        Text.width({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                                        Text.height({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                                        Text.borderWidth(2);
                                        Text.borderColor(Color.White);
                                    }, Text);
                                    Text.pop();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        Stack.pop();
                    };
                    this.forEachUpdateFunction(elmtId, row, forEachItemGenFunction, (item: string, colIndex: number) => `text_grid_${rowIndex}_${colIndex}`, true, true);
                }, ForEach);
                ForEach.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, CommonConstants.COLOR_GRID, forEachItemGenFunction, (row: string[], rowIndex: number) => `text_row_${rowIndex}`, true, true);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
