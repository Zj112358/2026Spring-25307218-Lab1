if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface myPaintSheet_Params {
    isMarker?: boolean;
    isFountainPen?: boolean;
    shapeTool?: string;
    alpha?: number;
    percent?: string;
    color?: string;
    strokeWidth?: number;
    colorMode?: number;
    redValue?: number;
    greenValue?: number;
    blueValue?: number;
    mPaint?: Paint;
    mBrush?: IBrush;
}
import { CommonConstants } from "@bundle:com.example.customcanvas/entry/ets/common/CommonConstants";
import type { IBrush } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import NormalBrush from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import { FountainPenBrush } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import Paint from "@bundle:com.example.customcanvas/entry/ets/viewmodel/Paint";
export class myPaintSheet extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isMarker = new SynchedPropertySimpleTwoWayPU(params.isMarker, this, "isMarker");
        this.__isFountainPen = new SynchedPropertySimpleTwoWayPU(params.isFountainPen, this, "isFountainPen");
        this.__shapeTool = new SynchedPropertySimpleTwoWayPU(params.shapeTool, this, "shapeTool");
        this.__alpha = new SynchedPropertySimpleTwoWayPU(params.alpha, this, "alpha");
        this.__percent = new SynchedPropertySimpleTwoWayPU(params.percent, this, "percent");
        this.__color = new SynchedPropertySimpleTwoWayPU(params.color, this, "color");
        this.__strokeWidth = new SynchedPropertySimpleTwoWayPU(params.strokeWidth, this, "strokeWidth");
        this.__colorMode = new ObservedPropertySimplePU(0, this, "colorMode");
        this.__redValue = new ObservedPropertySimplePU(0, this, "redValue");
        this.__greenValue = new ObservedPropertySimplePU(0, this, "greenValue");
        this.__blueValue = new ObservedPropertySimplePU(0, this, "blueValue");
        this.__mPaint = this.initializeConsume("mPaint", "mPaint");
        this.__mBrush = this.initializeConsume("mBrush", "mBrush");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: myPaintSheet_Params) {
        if (params.colorMode !== undefined) {
            this.colorMode = params.colorMode;
        }
        if (params.redValue !== undefined) {
            this.redValue = params.redValue;
        }
        if (params.greenValue !== undefined) {
            this.greenValue = params.greenValue;
        }
        if (params.blueValue !== undefined) {
            this.blueValue = params.blueValue;
        }
    }
    updateStateVars(params: myPaintSheet_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isMarker.purgeDependencyOnElmtId(rmElmtId);
        this.__isFountainPen.purgeDependencyOnElmtId(rmElmtId);
        this.__shapeTool.purgeDependencyOnElmtId(rmElmtId);
        this.__alpha.purgeDependencyOnElmtId(rmElmtId);
        this.__percent.purgeDependencyOnElmtId(rmElmtId);
        this.__color.purgeDependencyOnElmtId(rmElmtId);
        this.__strokeWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__colorMode.purgeDependencyOnElmtId(rmElmtId);
        this.__redValue.purgeDependencyOnElmtId(rmElmtId);
        this.__greenValue.purgeDependencyOnElmtId(rmElmtId);
        this.__blueValue.purgeDependencyOnElmtId(rmElmtId);
        this.__mPaint.purgeDependencyOnElmtId(rmElmtId);
        this.__mBrush.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isMarker.aboutToBeDeleted();
        this.__isFountainPen.aboutToBeDeleted();
        this.__shapeTool.aboutToBeDeleted();
        this.__alpha.aboutToBeDeleted();
        this.__percent.aboutToBeDeleted();
        this.__color.aboutToBeDeleted();
        this.__strokeWidth.aboutToBeDeleted();
        this.__colorMode.aboutToBeDeleted();
        this.__redValue.aboutToBeDeleted();
        this.__greenValue.aboutToBeDeleted();
        this.__blueValue.aboutToBeDeleted();
        this.__mPaint.aboutToBeDeleted();
        this.__mBrush.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isMarker: SynchedPropertySimpleTwoWayPU<boolean>;
    get isMarker() {
        return this.__isMarker.get();
    }
    set isMarker(newValue: boolean) {
        this.__isMarker.set(newValue);
    }
    private __isFountainPen: SynchedPropertySimpleTwoWayPU<boolean>;
    get isFountainPen() {
        return this.__isFountainPen.get();
    }
    set isFountainPen(newValue: boolean) {
        this.__isFountainPen.set(newValue);
    }
    private __shapeTool: SynchedPropertySimpleTwoWayPU<string>;
    get shapeTool() {
        return this.__shapeTool.get();
    }
    set shapeTool(newValue: string) {
        this.__shapeTool.set(newValue);
    }
    private __alpha: SynchedPropertySimpleTwoWayPU<number>;
    get alpha() {
        return this.__alpha.get();
    }
    set alpha(newValue: number) {
        this.__alpha.set(newValue);
    }
    private __percent: SynchedPropertySimpleTwoWayPU<string>;
    get percent() {
        return this.__percent.get();
    }
    set percent(newValue: string) {
        this.__percent.set(newValue);
    }
    private __color: SynchedPropertySimpleTwoWayPU<string>;
    get color() {
        return this.__color.get();
    }
    set color(newValue: string) {
        this.__color.set(newValue);
    }
    private __strokeWidth: SynchedPropertySimpleTwoWayPU<number>;
    get strokeWidth() {
        return this.__strokeWidth.get();
    }
    set strokeWidth(newValue: number) {
        this.__strokeWidth.set(newValue);
    }
    private __colorMode: ObservedPropertySimplePU<number>;
    get colorMode() {
        return this.__colorMode.get();
    }
    set colorMode(newValue: number) {
        this.__colorMode.set(newValue);
    }
    private __redValue: ObservedPropertySimplePU<number>;
    get redValue() {
        return this.__redValue.get();
    }
    set redValue(newValue: number) {
        this.__redValue.set(newValue);
    }
    private __greenValue: ObservedPropertySimplePU<number>;
    get greenValue() {
        return this.__greenValue.get();
    }
    set greenValue(newValue: number) {
        this.__greenValue.set(newValue);
    }
    private __blueValue: ObservedPropertySimplePU<number>;
    get blueValue() {
        return this.__blueValue.get();
    }
    set blueValue(newValue: number) {
        this.__blueValue.set(newValue);
    }
    private __mPaint: ObservedPropertyAbstractPU<Paint>;
    get mPaint() {
        return this.__mPaint.get();
    }
    set mPaint(newValue: Paint) {
        this.__mPaint.set(newValue);
    }
    private __mBrush: ObservedPropertyAbstractPU<IBrush>;
    get mBrush() {
        return this.__mBrush.get();
    }
    set mBrush(newValue: IBrush) {
        this.__mBrush.set(newValue);
    }
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
        }
        else {
            this.mBrush = new NormalBrush();
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
            Column.padding({
                left: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                top: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.margin({ bottom: { "id": 16777280, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ bottom: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                left: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777267, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Column.height({ "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor(this.isMarker || this.isFountainPen ? { "id": 16777259, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777263, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isMarker || this.isFountainPen ? { "id": 16777281, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777282, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.width({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.height({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.borderRadius({ "id": 16777263, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.isMarker = false;
                this.isFountainPen = false;
                this.alpha = 1;
                this.percent = '100';
                this.ToggleThicknessColor();
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.isMarker || this.isFountainPen ? { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777267, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Column.height({ "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor(this.isMarker && !this.isFountainPen ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777259, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777263, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isMarker && !this.isFountainPen ? { "id": 16777296, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777295, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.width({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.height({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.borderRadius({ "id": 16777263, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.isMarker = true;
                this.isFountainPen = false;
                this.alpha = 0.5;
                this.percent = '50';
                this.ToggleThicknessColor();
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777237, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.isMarker && !this.isFountainPen ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777267, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Column.height({ "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor(this.isFountainPen ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777259, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777263, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isFountainPen ? { "id": 16777292, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777291, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.width({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.height({ "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.borderRadius({ "id": 16777263, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.isFountainPen = true;
                this.isMarker = false;
                this.alpha = 1;
                this.percent = '100';
                this.ToggleThicknessColor();
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.isFountainPen ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({
                left: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.margin({ bottom: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.colorMode === 0 ? { "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777244, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777329, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ left: 12 });
            Text.onClick(() => {
                this.colorMode = (this.colorMode + 1) % 2;
            });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.colorMode === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.padding({
                            left: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                            right: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
                        });
                        Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
                    }, Column);
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
                                    this.color = item;
                                    this.syncRgbFromColor();
                                    this.ToggleThicknessColor();
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
                                if (this.color === item) {
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
                        this.forEachUpdateFunction(elmtId, CommonConstants.COLOR_GRAY_ROW, forEachItemGenFunction, (item: string, index: number) => `gray_${index}`, false, true);
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
                                            this.color = item;
                                            this.syncRgbFromColor();
                                            this.ToggleThicknessColor();
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
                                        if (this.color === item) {
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
                                this.forEachUpdateFunction(elmtId, row, forEachItemGenFunction, (item: string, colIndex: number) => `grid_${rowIndex}_${colIndex}`, true, true);
                            }, ForEach);
                            ForEach.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, CommonConstants.COLOR_GRID, forEachItemGenFunction, (row: string[], rowIndex: number) => `row_${rowIndex}`, true, true);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
                        Column.padding({
                            left: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                            right: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('R');
                        Text.fontSize({ "id": 16777329, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.fontColor('#E90808');
                        Text.width({ "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Slider.create({ value: this.redValue, min: 0, max: 255 });
                        Slider.width({ "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Slider.selectedColor('#E90808');
                        Slider.trackColor(Color.Black);
                        Slider.blockColor('#E90808');
                        Slider.minResponsiveDistance(CommonConstants.ONE);
                        Slider.onChange((value: number) => {
                            this.redValue = value;
                            this.updateColorFromRgb();
                            this.ToggleThicknessColor();
                        });
                    }, Slider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(Math.round(this.redValue).toString());
                        Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.width({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.alignItems(VerticalAlign.Center);
                        Row.margin({ top: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('G');
                        Text.fontSize({ "id": 16777329, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.fontColor('#63B959');
                        Text.width({ "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Slider.create({ value: this.greenValue, min: 0, max: 255 });
                        Slider.width({ "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Slider.selectedColor('#63B959');
                        Slider.trackColor(Color.Black);
                        Slider.blockColor('#63B959');
                        Slider.minResponsiveDistance(CommonConstants.ONE);
                        Slider.onChange((value: number) => {
                            this.greenValue = value;
                            this.updateColorFromRgb();
                            this.ToggleThicknessColor();
                        });
                    }, Slider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(Math.round(this.greenValue).toString());
                        Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.width({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.alignItems(VerticalAlign.Center);
                        Row.margin({ top: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('B');
                        Text.fontSize({ "id": 16777329, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.fontColor('#0A59F7');
                        Text.width({ "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Slider.create({ value: this.blueValue, min: 0, max: 255 });
                        Slider.width({ "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Slider.selectedColor('#0A59F7');
                        Slider.trackColor(Color.Black);
                        Slider.blockColor('#0A59F7');
                        Slider.minResponsiveDistance(CommonConstants.ONE);
                        Slider.onChange((value: number) => {
                            this.blueValue = value;
                            this.updateColorFromRgb();
                            this.ToggleThicknessColor();
                        });
                    }, Slider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(Math.round(this.blueValue).toString());
                        Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.width({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ top: 6 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777229, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777329, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777322, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777322, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777321, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor(this.color);
            Text.borderWidth(1);
            Text.borderColor('#D9D9D9');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({
                left: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.margin({ bottom: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777239, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ bottom: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                left: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                style: SliderStyle.InSet,
                value: this.alpha * CommonConstants.ONE_HUNDRED
            });
            Slider.height({ "id": 16777267, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Slider.width({ "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Slider.selectedColor(Color.Transparent);
            Slider.minResponsiveDistance(CommonConstants.ONE);
            Slider.trackColor(new LinearGradient([
                { color: { "id": 16777257, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }, offset: CommonConstants.ZERO },
                { color: { "id": 16777256, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }, offset: CommonConstants.ONE }
            ]));
            Slider.onChange((value: number) => {
                this.alpha = value / 100;
                this.percent = value.toFixed(0);
                this.ToggleThicknessColor();
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.percent + CommonConstants.SIGN);
            Text.width({ "id": 16777275, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777269, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
            Text.backgroundColor({ "id": 16777258, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({
                left: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777253, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ bottom: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                left: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                value: this.strokeWidth,
                min: CommonConstants.THREE,
                max: CommonConstants.TWENTY_ONE,
                step: 1
            });
            Slider.width({ "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Slider.minResponsiveDistance(CommonConstants.ONE);
            Slider.onChange((value: number, _mode: SliderChangeMode) => {
                this.strokeWidth = value;
                this.ToggleThicknessColor();
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.strokeWidth.toFixed(0));
            Text.width({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
