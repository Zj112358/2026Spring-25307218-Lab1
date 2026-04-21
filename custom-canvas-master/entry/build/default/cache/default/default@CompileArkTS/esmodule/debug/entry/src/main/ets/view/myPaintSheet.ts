if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface myPaintSheet_Params {
    isMarker?: boolean;
    alpha?: number;
    percent?: string;
    color?: string;
    thicknessesValue?: number;
    strokeWidth?: number;
    mPaint?: Paint;
    mBrush?: IBrush;
}
import { CommonConstants } from "@bundle:com.example.customcanvas/entry/ets/common/CommonConstants";
import type { IBrush } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import NormalBrush from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import Paint from "@bundle:com.example.customcanvas/entry/ets/viewmodel/Paint";
export class myPaintSheet extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isMarker = new SynchedPropertySimpleTwoWayPU(params.isMarker, this, "isMarker");
        this.__alpha = new SynchedPropertySimpleTwoWayPU(params.alpha, this, "alpha");
        this.__percent = new SynchedPropertySimpleTwoWayPU(params.percent, this, "percent");
        this.__color = new SynchedPropertySimpleTwoWayPU(params.color, this, "color");
        this.__thicknessesValue = new SynchedPropertySimpleTwoWayPU(params.thicknessesValue, this, "thicknessesValue");
        this.__strokeWidth = new SynchedPropertySimpleTwoWayPU(params.strokeWidth, this, "strokeWidth");
        this.__mPaint = this.initializeConsume("mPaint", "mPaint");
        this.__mBrush = this.initializeConsume("mBrush", "mBrush");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: myPaintSheet_Params) {
    }
    updateStateVars(params: myPaintSheet_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isMarker.purgeDependencyOnElmtId(rmElmtId);
        this.__alpha.purgeDependencyOnElmtId(rmElmtId);
        this.__percent.purgeDependencyOnElmtId(rmElmtId);
        this.__color.purgeDependencyOnElmtId(rmElmtId);
        this.__thicknessesValue.purgeDependencyOnElmtId(rmElmtId);
        this.__strokeWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__mPaint.purgeDependencyOnElmtId(rmElmtId);
        this.__mBrush.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isMarker.aboutToBeDeleted();
        this.__alpha.aboutToBeDeleted();
        this.__percent.aboutToBeDeleted();
        this.__color.aboutToBeDeleted();
        this.__thicknessesValue.aboutToBeDeleted();
        this.__strokeWidth.aboutToBeDeleted();
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
    private __thicknessesValue: SynchedPropertySimpleTwoWayPU<number>;
    get thicknessesValue() {
        return this.__thicknessesValue.get();
    }
    set thicknessesValue(newValue: number) {
        this.__thicknessesValue.set(newValue);
    }
    private __strokeWidth: SynchedPropertySimpleTwoWayPU<number>;
    get strokeWidth() {
        return this.__strokeWidth.get();
    }
    set strokeWidth(newValue: number) {
        this.__strokeWidth.set(newValue);
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
    ToggleThicknessColor() {
        this.mPaint = new Paint(CommonConstants.ZERO, CommonConstants.COLOR_STRING, CommonConstants.ONE);
        this.mPaint.setStrokeWidth(this.strokeWidth);
        this.mPaint.setColor(this.color);
        this.mPaint.setGlobalAlpha(this.alpha);
        this.mBrush = new NormalBrush();
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
                left: { "id": 16777255, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777255, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                top: { "id": 16777252, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.margin({ bottom: { "id": 16777259, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontSize({ "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ bottom: { "id": 16777252, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                left: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777246, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Column.height({ "id": 16777245, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor(this.isMarker ? { "id": 16777238, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777242, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isMarker ? { "id": 16777260, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777261, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.width({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.height({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.borderRadius({ "id": 16777242, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.isMarker = false;
                this.alpha = 1;
                this.percent = '100';
                this.ToggleThicknessColor();
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777220, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.isMarker ? { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777246, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Column.height({ "id": 16777245, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor(this.isMarker ? { "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777238, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777242, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isMarker ? { "id": 16777271, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777270, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.width({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.height({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.borderRadius({ "id": 16777242, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.isMarker = true;
                this.alpha = 0.5;
                this.percent = '50';
                this.ToggleThicknessColor();
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.isMarker ? { "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777246, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Column.height({ "id": 16777245, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor({ "id": 16777238, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777242, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777275, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Image);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777230, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777246, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Column.height({ "id": 16777245, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor({ "id": 16777238, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777242, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777267, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Image);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777224, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777246, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Column.height({ "id": 16777245, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.backgroundColor({ "id": 16777238, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777242, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777268, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Image);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({
                left: { "id": 16777255, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777255, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.margin({ bottom: { "id": 16777252, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontSize({ "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ bottom: { "id": 16777252, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                left: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create();
                    Text.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                    Text.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                    Text.borderRadius({ "id": 16777243, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                    Text.backgroundColor(item);
                    Text.onClick(() => {
                        this.color = item;
                        this.ToggleThicknessColor();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, CommonConstants.COLOR_ARR, forEachItemGenFunction, (item: string) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({
                left: { "id": 16777255, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777255, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.margin({ bottom: { "id": 16777252, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777228, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontSize({ "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ bottom: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                left: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                style: SliderStyle.InSet,
                value: this.alpha * CommonConstants.ONE_HUNDRED
            });
            Slider.height({ "id": 16777246, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Slider.width({ "id": 16777258, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Slider.selectedColor(Color.Transparent);
            Slider.minResponsiveDistance(CommonConstants.ONE);
            Slider.trackColor(new LinearGradient([
                { color: { "id": 16777236, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }, offset: CommonConstants.ZERO },
                { color: { "id": 16777235, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }, offset: CommonConstants.ONE }
            ]));
            Slider.onChange((value: number) => {
                if (this.isMarker) {
                    this.alpha = value / 100;
                    this.percent = value.toFixed(0);
                    this.ToggleThicknessColor();
                }
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isMarker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.backgroundColor(Color.Transparent);
                        Row.width({ "id": 16777258, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                        Row.height({ "id": 16777246, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
                    }, Row);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.percent + CommonConstants.SIGN);
            Text.width({ "id": 16777254, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777248, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.borderRadius({ "id": 16777243, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
            Text.backgroundColor({ "id": 16777237, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({
                left: { "id": 16777255, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777255, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Column.alignItems(HorizontalAlign.Start);
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777233, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Start);
            Text.fontSize({ "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ bottom: { "id": 16777252, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                left: { "id": 16777252, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                right: { "id": 16777252, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
            });
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777272, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.onClick(() => {
                this.thicknessesValue -= 1;
                this.strokeWidth = this.thicknessesValue;
                this.ToggleThicknessColor();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                value: this.thicknessesValue,
                min: CommonConstants.THREE,
                max: CommonConstants.TWENTY_ONE
            });
            Slider.width({ "id": 16777258, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Slider.minResponsiveDistance(CommonConstants.ONE);
            Slider.onChange((value: number, _mode: SliderChangeMode) => {
                this.thicknessesValue = value;
                this.strokeWidth = value;
                this.ToggleThicknessColor();
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777262, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.onClick(() => {
                this.thicknessesValue += 1;
                this.strokeWidth = this.thicknessesValue;
                this.ToggleThicknessColor();
            });
        }, Image);
        Row.pop();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
