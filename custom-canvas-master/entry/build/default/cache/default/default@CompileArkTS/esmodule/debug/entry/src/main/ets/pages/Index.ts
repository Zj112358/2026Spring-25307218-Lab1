if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DrawCanvas_Params {
    isDrawing?: boolean;
    unDoDraw?: boolean;
    redoDraw?: boolean;
    isPaint?: boolean;
    isShow?: boolean;
    isMarker?: boolean;
    scaleValueX?: number;
    scaleValueY?: number;
    pinchValueX?: number;
    pinchValueY?: number;
    strokeWidth?: number;
    alpha?: number;
    color?: string;
    thicknessesValue?: number;
    index?: number;
    clean?: boolean;
    percent?: string;
    mPaint?: Paint;
    mBrush?: IBrush;
    setting?: RenderingContextSettings;
    context?: CanvasRenderingContext2D;
    drawInvoker?: DrawInvoker;
    path2Db?: Path2D;
    mPath?: DrawPath;
    arr?: number[];
}
import display from "@ohos:display";
import DrawInvoker from "@bundle:com.example.customcanvas/entry/ets/viewmodel/DrawInvoker";
import DrawPath from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IDraw";
import type { IBrush } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import NormalBrush from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import Paint from "@bundle:com.example.customcanvas/entry/ets/viewmodel/Paint";
import { CommonConstants } from "@bundle:com.example.customcanvas/entry/ets/common/CommonConstants";
import { myPaintSheet } from "@bundle:com.example.customcanvas/entry/ets/view/myPaintSheet";
import hilog from "@ohos:hilog";
import type { BusinessError } from "@ohos:base";
class DrawCanvas extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isDrawing = new ObservedPropertySimplePU(false, this, "isDrawing");
        this.__unDoDraw = new ObservedPropertySimplePU(false, this, "unDoDraw");
        this.__redoDraw = new ObservedPropertySimplePU(false, this, "redoDraw");
        this.__isPaint = new ObservedPropertySimplePU(true, this, "isPaint");
        this.__isShow = new ObservedPropertySimplePU(false, this, "isShow");
        this.__isMarker = new ObservedPropertySimplePU(false, this, "isMarker");
        this.__scaleValueX = new ObservedPropertySimplePU(1, this, "scaleValueX");
        this.__scaleValueY = new ObservedPropertySimplePU(1, this, "scaleValueY");
        this.__pinchValueX = new ObservedPropertySimplePU(1, this, "pinchValueX");
        this.__pinchValueY = new ObservedPropertySimplePU(1, this, "pinchValueY");
        this.__strokeWidth = new ObservedPropertySimplePU(3, this, "strokeWidth");
        this.__alpha = new ObservedPropertySimplePU(1, this, "alpha");
        this.__color = new ObservedPropertySimplePU('#000000', this, "color");
        this.__thicknessesValue = new ObservedPropertySimplePU(3, this, "thicknessesValue");
        this.__index = new ObservedPropertySimplePU(-1, this, "index");
        this.__clean = new ObservedPropertySimplePU(false, this, "clean");
        this.__percent = new ObservedPropertySimplePU('100', this, "percent");
        this.__mPaint = new ObservedPropertyObjectPU(new Paint(0, '', 1), this, "mPaint");
        this.addProvidedVar("mPaint", this.__mPaint, false);
        this.__mBrush = new ObservedPropertyObjectPU(new NormalBrush(), this, "mBrush");
        this.addProvidedVar("mBrush", this.__mBrush, false);
        this.setting = new RenderingContextSettings(true);
        this.context = new CanvasRenderingContext2D(this.setting);
        this.drawInvoker = new DrawInvoker();
        this.path2Db = new Path2D();
        this.mPath = new DrawPath(this.mPaint, this.path2Db);
        this.arr = [];
        this.setInitiallyProvidedValue(params);
        this.declareWatch("isDrawing", this.createDraw);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DrawCanvas_Params) {
        if (params.isDrawing !== undefined) {
            this.isDrawing = params.isDrawing;
        }
        if (params.unDoDraw !== undefined) {
            this.unDoDraw = params.unDoDraw;
        }
        if (params.redoDraw !== undefined) {
            this.redoDraw = params.redoDraw;
        }
        if (params.isPaint !== undefined) {
            this.isPaint = params.isPaint;
        }
        if (params.isShow !== undefined) {
            this.isShow = params.isShow;
        }
        if (params.isMarker !== undefined) {
            this.isMarker = params.isMarker;
        }
        if (params.scaleValueX !== undefined) {
            this.scaleValueX = params.scaleValueX;
        }
        if (params.scaleValueY !== undefined) {
            this.scaleValueY = params.scaleValueY;
        }
        if (params.pinchValueX !== undefined) {
            this.pinchValueX = params.pinchValueX;
        }
        if (params.pinchValueY !== undefined) {
            this.pinchValueY = params.pinchValueY;
        }
        if (params.strokeWidth !== undefined) {
            this.strokeWidth = params.strokeWidth;
        }
        if (params.alpha !== undefined) {
            this.alpha = params.alpha;
        }
        if (params.color !== undefined) {
            this.color = params.color;
        }
        if (params.thicknessesValue !== undefined) {
            this.thicknessesValue = params.thicknessesValue;
        }
        if (params.index !== undefined) {
            this.index = params.index;
        }
        if (params.clean !== undefined) {
            this.clean = params.clean;
        }
        if (params.percent !== undefined) {
            this.percent = params.percent;
        }
        if (params.mPaint !== undefined) {
            this.mPaint = params.mPaint;
        }
        if (params.mBrush !== undefined) {
            this.mBrush = params.mBrush;
        }
        if (params.setting !== undefined) {
            this.setting = params.setting;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.drawInvoker !== undefined) {
            this.drawInvoker = params.drawInvoker;
        }
        if (params.path2Db !== undefined) {
            this.path2Db = params.path2Db;
        }
        if (params.mPath !== undefined) {
            this.mPath = params.mPath;
        }
        if (params.arr !== undefined) {
            this.arr = params.arr;
        }
    }
    updateStateVars(params: DrawCanvas_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isDrawing.purgeDependencyOnElmtId(rmElmtId);
        this.__unDoDraw.purgeDependencyOnElmtId(rmElmtId);
        this.__redoDraw.purgeDependencyOnElmtId(rmElmtId);
        this.__isPaint.purgeDependencyOnElmtId(rmElmtId);
        this.__isShow.purgeDependencyOnElmtId(rmElmtId);
        this.__isMarker.purgeDependencyOnElmtId(rmElmtId);
        this.__scaleValueX.purgeDependencyOnElmtId(rmElmtId);
        this.__scaleValueY.purgeDependencyOnElmtId(rmElmtId);
        this.__pinchValueX.purgeDependencyOnElmtId(rmElmtId);
        this.__pinchValueY.purgeDependencyOnElmtId(rmElmtId);
        this.__strokeWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__alpha.purgeDependencyOnElmtId(rmElmtId);
        this.__color.purgeDependencyOnElmtId(rmElmtId);
        this.__thicknessesValue.purgeDependencyOnElmtId(rmElmtId);
        this.__index.purgeDependencyOnElmtId(rmElmtId);
        this.__clean.purgeDependencyOnElmtId(rmElmtId);
        this.__percent.purgeDependencyOnElmtId(rmElmtId);
        this.__mPaint.purgeDependencyOnElmtId(rmElmtId);
        this.__mBrush.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isDrawing.aboutToBeDeleted();
        this.__unDoDraw.aboutToBeDeleted();
        this.__redoDraw.aboutToBeDeleted();
        this.__isPaint.aboutToBeDeleted();
        this.__isShow.aboutToBeDeleted();
        this.__isMarker.aboutToBeDeleted();
        this.__scaleValueX.aboutToBeDeleted();
        this.__scaleValueY.aboutToBeDeleted();
        this.__pinchValueX.aboutToBeDeleted();
        this.__pinchValueY.aboutToBeDeleted();
        this.__strokeWidth.aboutToBeDeleted();
        this.__alpha.aboutToBeDeleted();
        this.__color.aboutToBeDeleted();
        this.__thicknessesValue.aboutToBeDeleted();
        this.__index.aboutToBeDeleted();
        this.__clean.aboutToBeDeleted();
        this.__percent.aboutToBeDeleted();
        this.__mPaint.aboutToBeDeleted();
        this.__mBrush.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isDrawing: ObservedPropertySimplePU<boolean>;
    get isDrawing() {
        return this.__isDrawing.get();
    }
    set isDrawing(newValue: boolean) {
        this.__isDrawing.set(newValue);
    }
    private __unDoDraw: ObservedPropertySimplePU<boolean>;
    get unDoDraw() {
        return this.__unDoDraw.get();
    }
    set unDoDraw(newValue: boolean) {
        this.__unDoDraw.set(newValue);
    }
    private __redoDraw: ObservedPropertySimplePU<boolean>;
    get redoDraw() {
        return this.__redoDraw.get();
    }
    set redoDraw(newValue: boolean) {
        this.__redoDraw.set(newValue);
    }
    private __isPaint: ObservedPropertySimplePU<boolean>;
    get isPaint() {
        return this.__isPaint.get();
    }
    set isPaint(newValue: boolean) {
        this.__isPaint.set(newValue);
    }
    private __isShow: ObservedPropertySimplePU<boolean>;
    get isShow() {
        return this.__isShow.get();
    }
    set isShow(newValue: boolean) {
        this.__isShow.set(newValue);
    }
    private __isMarker: ObservedPropertySimplePU<boolean>;
    get isMarker() {
        return this.__isMarker.get();
    }
    set isMarker(newValue: boolean) {
        this.__isMarker.set(newValue);
    }
    private __scaleValueX: ObservedPropertySimplePU<number>;
    get scaleValueX() {
        return this.__scaleValueX.get();
    }
    set scaleValueX(newValue: number) {
        this.__scaleValueX.set(newValue);
    }
    private __scaleValueY: ObservedPropertySimplePU<number>;
    get scaleValueY() {
        return this.__scaleValueY.get();
    }
    set scaleValueY(newValue: number) {
        this.__scaleValueY.set(newValue);
    }
    private __pinchValueX: ObservedPropertySimplePU<number>;
    get pinchValueX() {
        return this.__pinchValueX.get();
    }
    set pinchValueX(newValue: number) {
        this.__pinchValueX.set(newValue);
    }
    private __pinchValueY: ObservedPropertySimplePU<number>;
    get pinchValueY() {
        return this.__pinchValueY.get();
    }
    set pinchValueY(newValue: number) {
        this.__pinchValueY.set(newValue);
    }
    private __strokeWidth: ObservedPropertySimplePU<number>;
    get strokeWidth() {
        return this.__strokeWidth.get();
    }
    set strokeWidth(newValue: number) {
        this.__strokeWidth.set(newValue);
    }
    private __alpha: ObservedPropertySimplePU<number>;
    get alpha() {
        return this.__alpha.get();
    }
    set alpha(newValue: number) {
        this.__alpha.set(newValue);
    }
    private __color: ObservedPropertySimplePU<string>;
    get color() {
        return this.__color.get();
    }
    set color(newValue: string) {
        this.__color.set(newValue);
    }
    private __thicknessesValue: ObservedPropertySimplePU<number>;
    get thicknessesValue() {
        return this.__thicknessesValue.get();
    }
    set thicknessesValue(newValue: number) {
        this.__thicknessesValue.set(newValue);
    }
    private __index: ObservedPropertySimplePU<number>;
    get index() {
        return this.__index.get();
    }
    set index(newValue: number) {
        this.__index.set(newValue);
    }
    private __clean: ObservedPropertySimplePU<boolean>;
    get clean() {
        return this.__clean.get();
    }
    set clean(newValue: boolean) {
        this.__clean.set(newValue);
    }
    private __percent: ObservedPropertySimplePU<string>;
    get percent() {
        return this.__percent.get();
    }
    set percent(newValue: string) {
        this.__percent.set(newValue);
    }
    private __mPaint: ObservedPropertyObjectPU<Paint>;
    get mPaint() {
        return this.__mPaint.get();
    }
    set mPaint(newValue: Paint) {
        this.__mPaint.set(newValue);
    }
    private __mBrush: ObservedPropertyObjectPU<IBrush>;
    get mBrush() {
        return this.__mBrush.get();
    }
    set mBrush(newValue: IBrush) {
        this.__mBrush.set(newValue);
    }
    private setting: RenderingContextSettings;
    private context: CanvasRenderingContext2D;
    private drawInvoker: DrawInvoker;
    private path2Db: Path2D;
    private mPath: DrawPath;
    private arr: number[];
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
                    this.context.clearRect(0, 0, this.context.width, this.context.height);
                    this.drawInvoker.execute(this.context);
                }
                else if (data === 1) {
                    this.scaleValueX = 1;
                    this.scaleValueY = 1;
                    this.pinchValueX = 1;
                    this.pinchValueY = 1;
                    this.context.clearRect(0, 0, this.context.width, this.context.height);
                    this.drawInvoker.execute(this.context);
                }
            });
        }
        catch (error) {
            let err = error as BusinessError;
            hilog.error(0x0000, 'Index', `listen foldStatusChange failed. code=${err.code}, message=${err.message}`);
        }
    }
    createDraw() {
        if (this.isDrawing) {
            this.context.fillStyle = Color.White;
            this.context.fillRect(CommonConstants.ZERO, CommonConstants.ZERO, this.context.width, this.context.height);
            this.drawInvoker.execute(this.context);
            this.isDrawing = false;
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
        this.mBrush = new NormalBrush();
    }
    /**
     * Undo operation.
     */
    drawOperateUndo(): void {
        this.drawInvoker.undo();
        this.isDrawing = true;
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
        this.isDrawing = true;
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
        this.isDrawing = true;
        this.redoDraw = false;
        this.unDoDraw = false;
    }
    myPaintSheet(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new myPaintSheet(this, {
                        isMarker: this.__isMarker,
                        alpha: this.__alpha,
                        percent: this.__percent,
                        color: this.__color,
                        thicknessesValue: this.__thicknessesValue,
                        strokeWidth: this.__strokeWidth
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 150, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            isMarker: this.isMarker,
                            alpha: this.alpha,
                            percent: this.percent,
                            color: this.color,
                            thicknessesValue: this.thicknessesValue,
                            strokeWidth: this.strokeWidth
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "myPaintSheet" });
        }
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.backgroundColor({ "id": 125831015, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Stack.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.width(CommonConstants.CANVAS_WIDTH);
            Canvas.height(CommonConstants.CANVAS_WIDTH);
            Canvas.backgroundColor({ "id": 125831026, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Canvas.onTouch((event: TouchEvent) => {
                this.clean = false;
                if (this.index === 1 || event.touches.length > 1) {
                    return;
                }
                this.arr.push(event.touches[0].x + event.touches[0].y);
                if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Down) {
                    this.mPath = new DrawPath(this.mPaint, this.path2Db);
                    this.mPath.paint = this.mPaint;
                    this.mPath.path = new Path2D();
                    this.mBrush.down(this.mPath.path, event.touches[0].x, event.touches[0].y);
                }
                if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Move) {
                    this.mBrush.move(this.mPath.path, event.touches[0].x, event.touches[0].y);
                    this.context.clearRect(0, 0, this.context.width, this.context.height);
                    this.drawInvoker.execute(this.context);
                    if (this.arr.length > 4) {
                        this.mPath.draw(this.context);
                    }
                }
                if (event.touches.length === 1 && event.touches[0].id === 0 && event.type === TouchType.Up) {
                    this.add(this.mPath);
                    this.arr = [];
                    this.redoDraw = false;
                    this.unDoDraw = true;
                    this.isDrawing = true;
                    this.context.clearRect(0, 0, this.context.width, this.context.height);
                    this.drawInvoker.execute(this.context);
                }
            });
            Canvas.scale({
                x: this.scaleValueX,
                y: this.scaleValueY,
                z: CommonConstants.ONE
            });
            Gesture.create(GesturePriority.Low);
            PinchGesture.create();
            PinchGesture.onActionStart(() => {
                this.index = 1;
            });
            PinchGesture.onActionUpdate((event: GestureEvent) => {
                this.context.clearRect(0, 0, this.context.width, this.context.height);
                this.drawInvoker.execute(this.context);
                if (event) {
                    this.scaleValueX = this.pinchValueX * event.scale;
                    this.scaleValueY = this.pinchValueY * event.scale;
                }
            });
            PinchGesture.onActionEnd(() => {
                this.pinchValueX = this.scaleValueX;
                this.pinchValueY = this.scaleValueY;
                this.context.clearRect(0, 0, this.context.width, this.context.height);
                this.drawInvoker.execute(this.context);
            });
            PinchGesture.pop();
            Gesture.pop();
        }, Canvas);
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.backgroundColor(Color.Transparent);
            Column.zIndex(this.index);
            Gesture.create(GesturePriority.Low);
            PinchGesture.create();
            PinchGesture.onActionStart(() => {
                this.index = 1;
            });
            PinchGesture.onActionUpdate((event: GestureEvent) => {
                this.context.clearRect(0, 0, this.context.width, this.context.height);
                this.drawInvoker.execute(this.context);
                if (event) {
                    this.scaleValueX = this.pinchValueX * event.scale;
                    this.scaleValueY = this.pinchValueY * event.scale;
                }
            });
            PinchGesture.onActionEnd(() => {
                this.context.clearRect(0, 0, this.context.width, this.context.height);
                this.drawInvoker.execute(this.context);
                this.pinchValueX = this.scaleValueX;
                this.pinchValueY = this.scaleValueY;
            });
            PinchGesture.pop();
            Gesture.pop();
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.alignItems(VerticalAlign.Center);
            Row.zIndex(CommonConstants.TEN);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.bindSheet({ value: this.isShow, changeEvent: newValue => { this.isShow = newValue; } }, { builder: () => {
                    this.myPaintSheet.call(this);
                } }, {
                height: { "id": 16777250, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                backgroundColor: Color.White,
                title: {
                    title: { "id": 16777229, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
                },
                detents: CommonConstants.DETENTS
            });
            Stack.width({ "id": 16777257, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777256, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isPaint && this.index === CommonConstants.NEGATIVE_ONE ? { "id": 16777274, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777273, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777244, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777229, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777249, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.isPaint && this.index === CommonConstants.NEGATIVE_ONE ? { "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(() => {
                this.ToggleThicknessColor();
                this.isPaint = true;
                this.isShow = !this.isShow;
                this.index = -1;
                this.arr = [];
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width({ "id": 16777257, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777256, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isPaint || this.index === CommonConstants.ONE ? { "id": 16777280, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777281, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777244, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777232, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777249, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.isPaint || this.index === CommonConstants.ONE ? { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(() => {
                this.mPaint = new Paint(CommonConstants.ZERO, CommonConstants.COLOR_STRING, CommonConstants.ONE);
                this.mPaint.setStrokeWidth(CommonConstants.TEN);
                this.mPaint.setColor(CommonConstants.WHITE);
                this.mPaint.setGlobalAlpha(CommonConstants.ONE);
                this.isPaint = false;
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width({ "id": 16777257, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777256, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.unDoDraw ? { "id": 16777277, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777276, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777244, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777231, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777249, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.unDoDraw ? { "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.enabled(this.unDoDraw);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(async () => {
                this.drawOperateUndo();
                this.context.clearRect(0, 0, this.context.width, this.context.height);
                this.drawInvoker.execute(this.context);
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width({ "id": 16777257, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777256, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.redoDraw ? { "id": 16777279, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777278, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777244, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777234, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777249, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.redoDraw ? { "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.enabled(this.redoDraw);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(async () => {
                this.drawOperateRedo();
                this.context.clearRect(0, 0, this.context.width, this.context.height);
                this.drawInvoker.execute(this.context);
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width({ "id": 16777257, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777256, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.clean ? { "id": 16777265, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777264, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777244, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777249, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.clean ? { "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(async () => {
                this.clear();
                this.context.clearRect(0, 0, this.context.width, this.context.height);
                this.drawInvoker.execute(this.context);
                this.clean = true;
            });
        }, Button);
        Button.pop();
        Stack.pop();
        Row.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "DrawCanvas";
    }
}
registerNamedRoute(() => new DrawCanvas(undefined, {}), "", { bundleName: "com.example.customcanvas", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
