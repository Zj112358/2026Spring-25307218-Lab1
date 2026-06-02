if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DrawCanvas_Params {
    isDrawing?: boolean;
    unDoDraw?: boolean;
    redoDraw?: boolean;
    isPaint?: boolean;
    isShow?: boolean;
    isShapeShow?: boolean;
    isMarker?: boolean;
    isFountainPen?: boolean;
    shapeTool?: string;
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
    eraserWidth?: number;
    isEraserShow?: boolean;
    isEraser?: boolean;
    selectedIndex?: number;
    selectDragStartX?: number;
    selectDragStartY?: number;
    selectAction?: string;
    showShapeMenu?: boolean;
    shapeMenuX?: number;
    shapeMenuY?: number;
    isTextShow?: boolean;
    textContent?: string;
    textFontSize?: number;
    textFontWeight?: FontWeight;
    textFontStyle?: FontStyle;
    textColor?: string;
    textPlaceX?: number;
    textPlaceY?: number;
    isTextEdit?: boolean;
    lastTextClickTime?: number;
    lastTextClickX?: number;
    lastTextClickY?: number;
    mPaint?: Paint;
    mBrush?: IBrush;
    setting?: RenderingContextSettings;
    context?: CanvasRenderingContext2D;
    offSetting?: RenderingContextSettings;
    offContext?: CanvasRenderingContext2D;
    drawInvoker?: DrawInvoker;
    path2Db?: Path2D;
    mPath?: DrawPath;
    arr?: number[];
    offCanvasReady?: boolean;
    shapeStartX?: number;
    shapeStartY?: number;
    distributedCanvas?: DistributedCanvas;
}
import display from "@ohos:display";
import DrawInvoker from "@bundle:com.example.customcanvas/entry/ets/viewmodel/DrawInvoker";
import DrawPath, { ShapeDraw, TextDraw, TouchPointData } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IDraw";
import type { IBrush } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import NormalBrush from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import { FountainPenBrush } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
import Paint from "@bundle:com.example.customcanvas/entry/ets/viewmodel/Paint";
import { CommonConstants } from "@bundle:com.example.customcanvas/entry/ets/common/CommonConstants";
import { myPaintSheet } from "@bundle:com.example.customcanvas/entry/ets/view/myPaintSheet";
import { textInputSheet } from "@bundle:com.example.customcanvas/entry/ets/view/textInputSheet";
import hilog from "@ohos:hilog";
import type { BusinessError } from "@ohos:base";
import DistributedCanvas from "@bundle:com.example.customcanvas/entry/ets/viewmodel/DistributedCanvas";
import { CONTINUE_DRAW_DATA, CONTINUE_SELECTED_INDEX, CONTINUE_SCALE_X, CONTINUE_SCALE_Y, CONTINUE_SHAPE_TOOL, CONTINUE_IS_PAINT, CONTINUE_IS_ERASER, CONTINUE_ERROR } from "@bundle:com.example.customcanvas/entry/ets/entryability/EntryAbility";
import type { Context } from "@ohos:abilityAccessCtrl";
class DrawCanvas extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isDrawing = new ObservedPropertySimplePU(false, this, "isDrawing");
        this.__unDoDraw = new ObservedPropertySimplePU(false, this, "unDoDraw");
        this.__redoDraw = new ObservedPropertySimplePU(false, this, "redoDraw");
        this.__isPaint = new ObservedPropertySimplePU(false, this, "isPaint");
        this.__isShow = new ObservedPropertySimplePU(false, this, "isShow");
        this.__isShapeShow = new ObservedPropertySimplePU(false, this, "isShapeShow");
        this.__isMarker = new ObservedPropertySimplePU(false, this, "isMarker");
        this.__isFountainPen = new ObservedPropertySimplePU(false, this, "isFountainPen");
        this.__shapeTool = new ObservedPropertySimplePU('', this, "shapeTool");
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
        this.__eraserWidth = new ObservedPropertySimplePU(10, this, "eraserWidth");
        this.__isEraserShow = new ObservedPropertySimplePU(false, this, "isEraserShow");
        this.__isEraser = new ObservedPropertySimplePU(false, this, "isEraser");
        this.__selectedIndex = new ObservedPropertySimplePU(-1, this, "selectedIndex");
        this.__selectDragStartX = new ObservedPropertySimplePU(0, this, "selectDragStartX");
        this.__selectDragStartY = new ObservedPropertySimplePU(0, this, "selectDragStartY");
        this.__selectAction = new ObservedPropertySimplePU('', this, "selectAction");
        this.__showShapeMenu = new ObservedPropertySimplePU(false, this, "showShapeMenu");
        this.__shapeMenuX = new ObservedPropertySimplePU(0, this, "shapeMenuX");
        this.__shapeMenuY = new ObservedPropertySimplePU(0, this, "shapeMenuY");
        this.__isTextShow = new ObservedPropertySimplePU(false, this, "isTextShow");
        this.__textContent = new ObservedPropertySimplePU('', this, "textContent");
        this.__textFontSize = new ObservedPropertySimplePU(24, this, "textFontSize");
        this.__textFontWeight = new ObservedPropertySimplePU(FontWeight.Normal, this, "textFontWeight");
        this.__textFontStyle = new ObservedPropertySimplePU(FontStyle.Normal, this, "textFontStyle");
        this.__textColor = new ObservedPropertySimplePU('#000000', this, "textColor");
        this.textPlaceX = 0;
        this.textPlaceY = 0;
        this.isTextEdit = false;
        this.lastTextClickTime = 0;
        this.lastTextClickX = 0;
        this.lastTextClickY = 0;
        this.__mPaint = new ObservedPropertyObjectPU(new Paint(0, '', 1), this, "mPaint");
        this.addProvidedVar("mPaint", this.__mPaint, false);
        this.__mBrush = new ObservedPropertyObjectPU(new NormalBrush(), this, "mBrush");
        this.addProvidedVar("mBrush", this.__mBrush, false);
        this.setting = new RenderingContextSettings(true);
        this.context = new CanvasRenderingContext2D(this.setting);
        this.offSetting = new RenderingContextSettings(true);
        this.offContext = new CanvasRenderingContext2D(this.offSetting);
        this.drawInvoker = new DrawInvoker();
        this.path2Db = new Path2D();
        this.mPath = new DrawPath(this.mPaint, this.path2Db);
        this.arr = [];
        this.offCanvasReady = false;
        this.shapeStartX = 0;
        this.shapeStartY = 0;
        this.distributedCanvas = new DistributedCanvas();
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
        if (params.isShapeShow !== undefined) {
            this.isShapeShow = params.isShapeShow;
        }
        if (params.isMarker !== undefined) {
            this.isMarker = params.isMarker;
        }
        if (params.isFountainPen !== undefined) {
            this.isFountainPen = params.isFountainPen;
        }
        if (params.shapeTool !== undefined) {
            this.shapeTool = params.shapeTool;
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
        if (params.eraserWidth !== undefined) {
            this.eraserWidth = params.eraserWidth;
        }
        if (params.isEraserShow !== undefined) {
            this.isEraserShow = params.isEraserShow;
        }
        if (params.isEraser !== undefined) {
            this.isEraser = params.isEraser;
        }
        if (params.selectedIndex !== undefined) {
            this.selectedIndex = params.selectedIndex;
        }
        if (params.selectDragStartX !== undefined) {
            this.selectDragStartX = params.selectDragStartX;
        }
        if (params.selectDragStartY !== undefined) {
            this.selectDragStartY = params.selectDragStartY;
        }
        if (params.selectAction !== undefined) {
            this.selectAction = params.selectAction;
        }
        if (params.showShapeMenu !== undefined) {
            this.showShapeMenu = params.showShapeMenu;
        }
        if (params.shapeMenuX !== undefined) {
            this.shapeMenuX = params.shapeMenuX;
        }
        if (params.shapeMenuY !== undefined) {
            this.shapeMenuY = params.shapeMenuY;
        }
        if (params.isTextShow !== undefined) {
            this.isTextShow = params.isTextShow;
        }
        if (params.textContent !== undefined) {
            this.textContent = params.textContent;
        }
        if (params.textFontSize !== undefined) {
            this.textFontSize = params.textFontSize;
        }
        if (params.textFontWeight !== undefined) {
            this.textFontWeight = params.textFontWeight;
        }
        if (params.textFontStyle !== undefined) {
            this.textFontStyle = params.textFontStyle;
        }
        if (params.textColor !== undefined) {
            this.textColor = params.textColor;
        }
        if (params.textPlaceX !== undefined) {
            this.textPlaceX = params.textPlaceX;
        }
        if (params.textPlaceY !== undefined) {
            this.textPlaceY = params.textPlaceY;
        }
        if (params.isTextEdit !== undefined) {
            this.isTextEdit = params.isTextEdit;
        }
        if (params.lastTextClickTime !== undefined) {
            this.lastTextClickTime = params.lastTextClickTime;
        }
        if (params.lastTextClickX !== undefined) {
            this.lastTextClickX = params.lastTextClickX;
        }
        if (params.lastTextClickY !== undefined) {
            this.lastTextClickY = params.lastTextClickY;
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
        if (params.offSetting !== undefined) {
            this.offSetting = params.offSetting;
        }
        if (params.offContext !== undefined) {
            this.offContext = params.offContext;
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
        if (params.offCanvasReady !== undefined) {
            this.offCanvasReady = params.offCanvasReady;
        }
        if (params.shapeStartX !== undefined) {
            this.shapeStartX = params.shapeStartX;
        }
        if (params.shapeStartY !== undefined) {
            this.shapeStartY = params.shapeStartY;
        }
        if (params.distributedCanvas !== undefined) {
            this.distributedCanvas = params.distributedCanvas;
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
        this.__isShapeShow.purgeDependencyOnElmtId(rmElmtId);
        this.__isMarker.purgeDependencyOnElmtId(rmElmtId);
        this.__isFountainPen.purgeDependencyOnElmtId(rmElmtId);
        this.__shapeTool.purgeDependencyOnElmtId(rmElmtId);
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
        this.__eraserWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__isEraserShow.purgeDependencyOnElmtId(rmElmtId);
        this.__isEraser.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectDragStartX.purgeDependencyOnElmtId(rmElmtId);
        this.__selectDragStartY.purgeDependencyOnElmtId(rmElmtId);
        this.__selectAction.purgeDependencyOnElmtId(rmElmtId);
        this.__showShapeMenu.purgeDependencyOnElmtId(rmElmtId);
        this.__shapeMenuX.purgeDependencyOnElmtId(rmElmtId);
        this.__shapeMenuY.purgeDependencyOnElmtId(rmElmtId);
        this.__isTextShow.purgeDependencyOnElmtId(rmElmtId);
        this.__textContent.purgeDependencyOnElmtId(rmElmtId);
        this.__textFontSize.purgeDependencyOnElmtId(rmElmtId);
        this.__textFontWeight.purgeDependencyOnElmtId(rmElmtId);
        this.__textFontStyle.purgeDependencyOnElmtId(rmElmtId);
        this.__textColor.purgeDependencyOnElmtId(rmElmtId);
        this.__mPaint.purgeDependencyOnElmtId(rmElmtId);
        this.__mBrush.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isDrawing.aboutToBeDeleted();
        this.__unDoDraw.aboutToBeDeleted();
        this.__redoDraw.aboutToBeDeleted();
        this.__isPaint.aboutToBeDeleted();
        this.__isShow.aboutToBeDeleted();
        this.__isShapeShow.aboutToBeDeleted();
        this.__isMarker.aboutToBeDeleted();
        this.__isFountainPen.aboutToBeDeleted();
        this.__shapeTool.aboutToBeDeleted();
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
        this.__eraserWidth.aboutToBeDeleted();
        this.__isEraserShow.aboutToBeDeleted();
        this.__isEraser.aboutToBeDeleted();
        this.__selectedIndex.aboutToBeDeleted();
        this.__selectDragStartX.aboutToBeDeleted();
        this.__selectDragStartY.aboutToBeDeleted();
        this.__selectAction.aboutToBeDeleted();
        this.__showShapeMenu.aboutToBeDeleted();
        this.__shapeMenuX.aboutToBeDeleted();
        this.__shapeMenuY.aboutToBeDeleted();
        this.__isTextShow.aboutToBeDeleted();
        this.__textContent.aboutToBeDeleted();
        this.__textFontSize.aboutToBeDeleted();
        this.__textFontWeight.aboutToBeDeleted();
        this.__textFontStyle.aboutToBeDeleted();
        this.__textColor.aboutToBeDeleted();
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
    private __isShapeShow: ObservedPropertySimplePU<boolean>;
    get isShapeShow() {
        return this.__isShapeShow.get();
    }
    set isShapeShow(newValue: boolean) {
        this.__isShapeShow.set(newValue);
    }
    private __isMarker: ObservedPropertySimplePU<boolean>;
    get isMarker() {
        return this.__isMarker.get();
    }
    set isMarker(newValue: boolean) {
        this.__isMarker.set(newValue);
    }
    private __isFountainPen: ObservedPropertySimplePU<boolean>;
    get isFountainPen() {
        return this.__isFountainPen.get();
    }
    set isFountainPen(newValue: boolean) {
        this.__isFountainPen.set(newValue);
    }
    private __shapeTool: ObservedPropertySimplePU<string>;
    get shapeTool() {
        return this.__shapeTool.get();
    }
    set shapeTool(newValue: string) {
        this.__shapeTool.set(newValue);
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
    private __eraserWidth: ObservedPropertySimplePU<number>;
    get eraserWidth() {
        return this.__eraserWidth.get();
    }
    set eraserWidth(newValue: number) {
        this.__eraserWidth.set(newValue);
    }
    private __isEraserShow: ObservedPropertySimplePU<boolean>;
    get isEraserShow() {
        return this.__isEraserShow.get();
    }
    set isEraserShow(newValue: boolean) {
        this.__isEraserShow.set(newValue);
    }
    private __isEraser: ObservedPropertySimplePU<boolean>;
    get isEraser() {
        return this.__isEraser.get();
    }
    set isEraser(newValue: boolean) {
        this.__isEraser.set(newValue);
    }
    private __selectedIndex: ObservedPropertySimplePU<number>;
    get selectedIndex() {
        return this.__selectedIndex.get();
    }
    set selectedIndex(newValue: number) {
        this.__selectedIndex.set(newValue);
    }
    private __selectDragStartX: ObservedPropertySimplePU<number>;
    get selectDragStartX() {
        return this.__selectDragStartX.get();
    }
    set selectDragStartX(newValue: number) {
        this.__selectDragStartX.set(newValue);
    }
    private __selectDragStartY: ObservedPropertySimplePU<number>;
    get selectDragStartY() {
        return this.__selectDragStartY.get();
    }
    set selectDragStartY(newValue: number) {
        this.__selectDragStartY.set(newValue);
    }
    private __selectAction: ObservedPropertySimplePU<string>;
    get selectAction() {
        return this.__selectAction.get();
    }
    set selectAction(newValue: string) {
        this.__selectAction.set(newValue);
    }
    private __showShapeMenu: ObservedPropertySimplePU<boolean>;
    get showShapeMenu() {
        return this.__showShapeMenu.get();
    }
    set showShapeMenu(newValue: boolean) {
        this.__showShapeMenu.set(newValue);
    }
    private __shapeMenuX: ObservedPropertySimplePU<number>;
    get shapeMenuX() {
        return this.__shapeMenuX.get();
    }
    set shapeMenuX(newValue: number) {
        this.__shapeMenuX.set(newValue);
    }
    private __shapeMenuY: ObservedPropertySimplePU<number>;
    get shapeMenuY() {
        return this.__shapeMenuY.get();
    }
    set shapeMenuY(newValue: number) {
        this.__shapeMenuY.set(newValue);
    }
    private __isTextShow: ObservedPropertySimplePU<boolean>;
    get isTextShow() {
        return this.__isTextShow.get();
    }
    set isTextShow(newValue: boolean) {
        this.__isTextShow.set(newValue);
    }
    private __textContent: ObservedPropertySimplePU<string>;
    get textContent() {
        return this.__textContent.get();
    }
    set textContent(newValue: string) {
        this.__textContent.set(newValue);
    }
    private __textFontSize: ObservedPropertySimplePU<number>;
    get textFontSize() {
        return this.__textFontSize.get();
    }
    set textFontSize(newValue: number) {
        this.__textFontSize.set(newValue);
    }
    private __textFontWeight: ObservedPropertySimplePU<FontWeight>;
    get textFontWeight() {
        return this.__textFontWeight.get();
    }
    set textFontWeight(newValue: FontWeight) {
        this.__textFontWeight.set(newValue);
    }
    private __textFontStyle: ObservedPropertySimplePU<FontStyle>;
    get textFontStyle() {
        return this.__textFontStyle.get();
    }
    set textFontStyle(newValue: FontStyle) {
        this.__textFontStyle.set(newValue);
    }
    private __textColor: ObservedPropertySimplePU<string>;
    get textColor() {
        return this.__textColor.get();
    }
    set textColor(newValue: string) {
        this.__textColor.set(newValue);
    }
    private textPlaceX: number;
    private textPlaceY: number;
    private isTextEdit: boolean;
    private lastTextClickTime: number;
    private lastTextClickX: number;
    private lastTextClickY: number;
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
    private offSetting: RenderingContextSettings;
    private offContext: CanvasRenderingContext2D;
    private drawInvoker: DrawInvoker;
    private path2Db: Path2D;
    private mPath: DrawPath;
    private arr: number[];
    private offCanvasReady: boolean;
    private shapeStartX: number;
    private shapeStartY: number;
    private distributedCanvas: DistributedCanvas;
    aboutToAppear(): void {
        this.mPaint = new Paint(CommonConstants.ZERO, CommonConstants.COLOR_STRING, CommonConstants.ONE);
        this.mPaint.setStrokeWidth(CommonConstants.THREE);
        this.mPaint.setColor(CommonConstants.BLACK);
        this.mPaint.setGlobalAlpha(CommonConstants.ONE);
        this.mBrush = new NormalBrush();
        this.distributedCanvas.init(getContext(this) as Context, this.drawInvoker, () => {
            this.refreshOffCanvas();
            this.clearTopCanvas();
        });
        this.distributedCanvas.startListening();
        let restoreError = AppStorage.get<string>(CONTINUE_ERROR);
        if (restoreError) {
            hilog.error(0x0000, 'Index', `Restore error: ${restoreError}`);
            AppStorage.setOrCreate(CONTINUE_ERROR, '');
        }
        let drawData = AppStorage.get<string>(CONTINUE_DRAW_DATA) ?? '';
        if (drawData.length > 0) {
            try {
                this.drawInvoker.deserializeAll(drawData);
                this.refreshOffCanvas();
            }
            catch (error) {
                hilog.error(0x0000, 'Index', `Failed to restore draw data`);
            }
        }
        this.selectedIndex = AppStorage.get<number>(CONTINUE_SELECTED_INDEX) ?? -1;
        let scaleX = AppStorage.get<number>(CONTINUE_SCALE_X) ?? 1;
        let scaleY = AppStorage.get<number>(CONTINUE_SCALE_Y) ?? 1;
        if (scaleX !== 1 || scaleY !== 1) {
            this.scaleValueX = scaleX;
            this.scaleValueY = scaleY;
            this.pinchValueX = scaleX;
            this.pinchValueY = scaleY;
        }
        this.shapeTool = AppStorage.get<string>(CONTINUE_SHAPE_TOOL) ?? '';
        this.isPaint = AppStorage.get<boolean>(CONTINUE_IS_PAINT) ?? false;
        this.isEraser = AppStorage.get<boolean>(CONTINUE_IS_ERASER) ?? false;
        try {
            display.on('foldStatusChange', (data: display.FoldStatus) => {
                if (data === 2) {
                    this.scaleValueX = 0.5;
                    this.pinchValueX = 0.5;
                    this.scaleValueY = 1;
                    this.pinchValueY = 1;
                    this.refreshOffCanvas();
                    this.clearTopCanvas();
                }
                else if (data === 1) {
                    this.scaleValueX = 1;
                    this.scaleValueY = 1;
                    this.pinchValueX = 1;
                    this.pinchValueY = 1;
                    this.refreshOffCanvas();
                    this.clearTopCanvas();
                }
            });
        }
        catch (error) {
            let err = error as BusinessError;
            hilog.error(0x0000, 'Index', `listen foldStatusChange failed. code=${err.code}, message=${err.message}`);
        }
    }
    aboutToDisappear(): void {
        this.distributedCanvas.stopListening();
        AppStorage.setOrCreate(CONTINUE_DRAW_DATA, this.drawInvoker.serializeAll());
        AppStorage.setOrCreate(CONTINUE_SELECTED_INDEX, this.selectedIndex);
        AppStorage.setOrCreate(CONTINUE_SCALE_X, this.scaleValueX);
        AppStorage.setOrCreate(CONTINUE_SCALE_Y, this.scaleValueY);
        AppStorage.setOrCreate(CONTINUE_SHAPE_TOOL, this.shapeTool);
        AppStorage.setOrCreate(CONTINUE_IS_PAINT, this.isPaint);
        AppStorage.setOrCreate(CONTINUE_IS_ERASER, this.isEraser);
    }
    createDraw() {
        if (this.isDrawing) {
            this.clearTopCanvas();
            this.isDrawing = false;
        }
    }
    refreshOffCanvas(): void {
        if (!this.offCanvasReady)
            return;
        this.offContext.clearRect(0, 0, this.offContext.width, this.offContext.height);
        this.drawInvoker.execute(this.offContext);
        this.offContext.globalCompositeOperation = 'destination-over';
        this.offContext.fillStyle = Color.White;
        this.offContext.fillRect(0, 0, this.offContext.width, this.offContext.height);
        this.offContext.globalCompositeOperation = 'source-over';
    }
    appendToOffCanvas(path: DrawPath): void {
        if (!this.offCanvasReady)
            return;
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
        if (this.selectedIndex < 0)
            return;
        let element = this.drawInvoker.getAt(this.selectedIndex);
        if (element === null)
            return;
        let bounds = element.getBounds();
        let m = Math.max(element.paint.lineWidth / 2 + 4, 8);
        this.shapeMenuX = bounds[2] + m;
        this.shapeMenuY = bounds[1] - m;
    }
    drawSelectionBox(): void {
        if (this.selectedIndex < 0)
            return;
        let element = this.drawInvoker.getAt(this.selectedIndex);
        if (element === null)
            return;
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
        if (this.selectedIndex < 0)
            return false;
        let element = this.drawInvoker.getAt(this.selectedIndex);
        if (element === null)
            return false;
        let bounds = element.getBounds();
        let margin = Math.max(element.paint.lineWidth / 2 + 4, 8);
        let cx = (bounds[0] + bounds[2]) / 2;
        let rotHandleY = bounds[1] - margin - 20;
        return tx >= cx - 15 && tx <= cx + 15 && ty >= rotHandleY - 15 && ty <= rotHandleY + 15;
    }
    isDeleteHandleHit(tx: number, ty: number): boolean {
        if (this.selectedIndex < 0)
            return false;
        let element = this.drawInvoker.getAt(this.selectedIndex);
        if (element === null)
            return false;
        let bounds = element.getBounds();
        let margin = Math.max(element.paint.lineWidth / 2 + 4, 8);
        let boxRight = bounds[2] + margin;
        let boxTop = bounds[1] - margin;
        return tx >= boxRight - 20 && tx <= boxRight + 20 && ty >= boxTop - 20 && ty <= boxTop + 20;
    }
    getSelectionCenter(): number[] {
        if (this.selectedIndex < 0)
            return [0, 0];
        let element = this.drawInvoker.getAt(this.selectedIndex);
        if (element === null)
            return [0, 0];
        let bounds = element.getBounds();
        return [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];
    }
    deleteSelected(): void {
        if (this.selectedIndex >= 0) {
            this.distributedCanvas.publishDelete(this.selectedIndex);
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
        this.distributedCanvas.publishAdd(path);
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
        }
        else {
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
        this.distributedCanvas.publishClear();
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
        let textDraw = new TextDraw(textPaint, this.textContent, this.textPlaceX, this.textPlaceY, this.textFontSize, this.textFontWeight, this.textFontStyle);
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
    myTextInputSheet(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new textInputSheet(this, {
                        textContent: this.__textContent,
                        textFontSize: this.__textFontSize,
                        textFontWeight: this.__textFontWeight,
                        textFontStyle: this.__textFontStyle,
                        textColor: this.__textColor
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 443, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            textContent: this.textContent,
                            textFontSize: this.textFontSize,
                            textFontWeight: this.textFontWeight,
                            textFontStyle: this.textFontStyle,
                            textColor: this.textColor
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "textInputSheet" });
        }
        Column.pop();
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
                        isFountainPen: this.__isFountainPen,
                        shapeTool: this.__shapeTool,
                        alpha: this.__alpha,
                        percent: this.__percent,
                        color: this.__color,
                        strokeWidth: this.__strokeWidth
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 458, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            isMarker: this.isMarker,
                            isFountainPen: this.isFountainPen,
                            shapeTool: this.shapeTool,
                            alpha: this.alpha,
                            percent: this.percent,
                            color: this.color,
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
    myEraserSheet(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
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
                value: this.eraserWidth,
                min: CommonConstants.THREE,
                max: CommonConstants.TWENTY_ONE,
                step: 1
            });
            Slider.width({ "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Slider.minResponsiveDistance(CommonConstants.ONE);
            Slider.onChange((value: number, _mode: SliderChangeMode) => {
                this.eraserWidth = value;
                this.mPaint.setStrokeWidth(this.eraserWidth);
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.eraserWidth.toFixed(0));
            Text.width(28);
            Text.fontSize(11);
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        Column.pop();
    }
    shapeToolSheet(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777249, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(16);
            Text.fontColor({ "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 16, bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceEvenly });
            Flex.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Flex.padding({ left: 16, right: 16, bottom: 20 });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'line';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'line' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('/');
            Text.fontSize(22);
            Text.fontColor(this.shapeTool === 'line' ? Color.White : Color.Black);
            Text.fontWeight(FontWeight.Bold);
            Text.rotate({ angle: -30 });
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777247, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'line' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'circle';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'circle' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('○');
            Text.fontSize(22);
            Text.fontColor(this.shapeTool === 'circle' ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'circle' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'rect';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'rect' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('□');
            Text.fontSize(22);
            Text.fontColor(this.shapeTool === 'rect' ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777242, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'rect' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'ellipse';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'ellipse' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⬭');
            Text.fontSize(22);
            Text.fontColor(this.shapeTool === 'ellipse' ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777233, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'ellipse' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'triangle';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'triangle' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('△');
            Text.fontSize(22);
            Text.fontColor(this.shapeTool === 'triangle' ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777254, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'triangle' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'diamond';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'diamond' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('◇');
            Text.fontSize(22);
            Text.fontColor(this.shapeTool === 'diamond' ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777232, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'diamond' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'star';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'star' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('☆');
            Text.fontSize(22);
            Text.fontColor(this.shapeTool === 'star' ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777251, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'star' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'arrow';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'arrow' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('→');
            Text.fontSize(22);
            Text.fontColor(this.shapeTool === 'arrow' ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777220, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'arrow' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'cube';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'cube' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.fillColor(this.shapeTool === 'cube' ? Color.White : Color.Black);
        }, Image);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777228, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'cube' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'cylinder';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'cylinder' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777289, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.fillColor(this.shapeTool === 'cylinder' ? Color.White : Color.Black);
        }, Image);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777230, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'cylinder' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'cone';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'cone' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777287, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.fillColor(this.shapeTool === 'cone' ? Color.White : Color.Black);
        }, Image);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777227, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'cone' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'pyramid';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'pyramid' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777300, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.fillColor(this.shapeTool === 'pyramid' ? Color.White : Color.Black);
        }, Image);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'pyramid' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'sphere';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'sphere' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777307, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.fillColor(this.shapeTool === 'sphere' ? Color.White : Color.Black);
        }, Image);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777250, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'sphere' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(80);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.onClick(() => {
                this.shapeTool = 'text';
                this.isShapeShow = false;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.width(48);
            Text.height(48);
            Text.borderRadius(24);
            Text.backgroundColor(this.shapeTool === 'text' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : '#F1F3F5');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('A');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.shapeTool === 'text' ? Color.White : Color.Black);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777252, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize(12);
            Text.fontColor(this.shapeTool === 'text' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        Flex.pop();
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
            Canvas.create(this.offContext);
            Canvas.width(CommonConstants.CANVAS_WIDTH);
            Canvas.height(CommonConstants.CANVAS_WIDTH);
            Canvas.backgroundColor({ "id": 125831026, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Canvas.onReady(() => {
                this.offCanvasReady = true;
            });
        }, Canvas);
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.width(CommonConstants.CANVAS_WIDTH);
            Canvas.height(CommonConstants.CANVAS_WIDTH);
            Canvas.onTouch((event: TouchEvent) => {
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
                            }
                            else {
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
                                    this.distributedCanvas.publishRotate(this.selectedIndex, element);
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
                                    this.distributedCanvas.publishMove(this.selectedIndex, element);
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
                        let shape = new ShapeDraw(this.mPaint, this.shapeTool, this.shapeStartX, this.shapeStartY, event.touches[0].x, event.touches[0].y);
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
                        }
                        else {
                            this.lastTextClickTime = 0;
                            if (this.selectedIndex >= 0) {
                                this.selectedIndex = -1;
                                this.showShapeMenu = false;
                                this.clearTopCanvas();
                            }
                        }
                    }
                    else if (!this.isPaint && !this.isEraser && this.shapeTool === '') {
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
                        }
                        else {
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
                    let tp0 = new TouchPointData();
                    tp0.x = touch.x;
                    tp0.y = touch.y;
                    this.mPath.touchPoints.push(tp0);
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
                            this.distributedCanvas.publishRotate(this.selectedIndex, element);
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
                                this.distributedCanvas.publishMove(this.selectedIndex, element);
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
                            this.distributedCanvas.publishMove(this.selectedIndex, element);
                            this.selectDragStartX = touch.x;
                            this.selectDragStartY = touch.y;
                            this.refreshOffCanvas();
                            this.drawSelectionBox();
                        }
                        return;
                    }
                    this.mBrush.move(this.mPath.path, event.touches[0].x, event.touches[0].y);
                    let tp1 = new TouchPointData();
                    tp1.x = event.touches[0].x;
                    tp1.y = event.touches[0].y;
                    this.mPath.touchPoints.push(tp1);
                    this.mPath.updateBounds(event.touches[0].x, event.touches[0].y);
                    if (this.isFountainPen && this.mBrush instanceof FountainPenBrush) {
                        this.mPath.isFountainPen = true;
                        this.mPath.fountainPenPoints = (this.mBrush as FountainPenBrush).points;
                    }
                    this.clearTopCanvas();
                    if (this.mPaint.isEraser) {
                        this.refreshOffCanvas();
                        this.mPath.draw(this.offContext);
                        this.offContext.globalCompositeOperation = 'destination-over';
                        this.offContext.fillStyle = Color.White;
                        this.offContext.fillRect(0, 0, this.offContext.width, this.offContext.height);
                        this.offContext.globalCompositeOperation = 'source-over';
                    }
                    else if (this.isFountainPen || this.arr.length > 4) {
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
                    if (this.mPaint.isEraser) {
                        this.refreshOffCanvas();
                    }
                    else {
                        this.appendToOffCanvas(this.mPath);
                    }
                    this.clearTopCanvas();
                    this.arr = [];
                    this.redoDraw = false;
                    this.unDoDraw = true;
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
                this.clearTopCanvas();
                if (event) {
                    this.scaleValueX = this.pinchValueX * event.scale;
                    this.scaleValueY = this.pinchValueY * event.scale;
                }
            });
            PinchGesture.onActionEnd(() => {
                this.pinchValueX = this.scaleValueX;
                this.pinchValueY = this.scaleValueY;
                this.clearTopCanvas();
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
                this.clearTopCanvas();
                if (event) {
                    this.scaleValueX = this.pinchValueX * event.scale;
                    this.scaleValueY = this.pinchValueY * event.scale;
                }
            });
            PinchGesture.onActionEnd(() => {
                this.clearTopCanvas();
                this.pinchValueX = this.scaleValueX;
                this.pinchValueY = this.scaleValueY;
            });
            PinchGesture.pop();
            Gesture.pop();
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(1);
            Column.height(1);
            Column.bindSheet({ value: this.isTextShow, changeEvent: newValue => { this.isTextShow = newValue; } }, { builder: () => {
                    this.myTextInputSheet.call(this);
                } }, {
                height: 500,
                backgroundColor: Color.White,
                title: {
                    title: { "id": 16777252, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
                },
                detents: CommonConstants.DETENTS,
                onWillDisappear: () => {
                    this.commitText();
                }
            });
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.alignItems(VerticalAlign.Center);
            Row.zIndex(CommonConstants.TEN);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.bindSheet({ value: this.isShow, changeEvent: newValue => { this.isShow = newValue; } }, { builder: () => {
                    this.myPaintSheet.call(this);
                } }, {
                height: { "id": 16777271, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" },
                backgroundColor: Color.White,
                title: {
                    title: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
                },
                detents: CommonConstants.DETENTS
            });
            Stack.width({ "id": 16777278, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isPaint && this.index === CommonConstants.NEGATIVE_ONE ? { "id": 16777299, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777298, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777265, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777270, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.isPaint && this.index === CommonConstants.NEGATIVE_ONE ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(() => {
                if (this.isPaint) {
                    this.isPaint = false;
                    this.isEraser = false;
                    this.isShow = false;
                    this.selectedIndex = -1;
                    this.showShapeMenu = false;
                    this.clearTopCanvas();
                }
                else {
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
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.bindSheet({ value: this.isShapeShow, changeEvent: newValue => { this.isShapeShow = newValue; } }, { builder: () => {
                    this.shapeToolSheet.call(this);
                } }, {
                height: 300,
                backgroundColor: Color.White,
                detents: CommonConstants.DETENTS
            });
            Stack.width({ "id": 16777278, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.shapeTool !== '' ? { "id": 16777299, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777298, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777265, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777249, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777270, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.shapeTool !== '' ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(() => {
                this.isEraser = false;
                if (this.shapeTool !== '') {
                    this.shapeTool = '';
                }
                else {
                    this.isShapeShow = !this.isShapeShow;
                }
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.bindSheet({ value: this.isEraserShow, changeEvent: newValue => { this.isEraserShow = newValue; } }, { builder: () => {
                    this.myEraserSheet.call(this);
                } }, {
                height: 120,
                backgroundColor: Color.White,
                title: {
                    title: { "id": 16777246, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" }
                },
                detents: CommonConstants.DETENTS
            });
            Stack.width({ "id": 16777278, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(!this.isEraser ? { "id": 16777305, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777306, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777265, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777246, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777270, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(!this.isEraser ? { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
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
                this.mPaint.setStrokeWidth(this.eraserWidth);
                this.mPaint.setEraser(true);
                this.isPaint = false;
                this.isEraser = true;
                this.isEraserShow = !this.isEraserShow;
                this.isShow = false;
                this.isShapeShow = false;
                this.shapeTool = '';
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width({ "id": 16777278, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.unDoDraw ? { "id": 16777302, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777301, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777265, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777243, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777270, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.unDoDraw ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.enabled(this.unDoDraw);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(() => {
                this.drawOperateUndo();
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width({ "id": 16777278, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.redoDraw ? { "id": 16777304, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777303, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777265, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777255, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777270, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.redoDraw ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.enabled(this.redoDraw);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(() => {
                this.drawOperateRedo();
            });
        }, Button);
        Button.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width({ "id": 16777278, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Stack.height({ "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Column.height(CommonConstants.ONE_HUNDRED_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.clean ? { "id": 16777286, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 16777285, "type": 20000, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.width({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.height({ "id": 16777272, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Image.margin({ bottom: { "id": 16777265, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777224, "type": 10003, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontSize({ "id": 16777270, "type": 10002, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
            Text.fontColor(this.clean ? { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" } : { "id": 125830998, "type": 10001, params: [], "bundleName": "com.example.customcanvas", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ type: ButtonType.Normal });
            Button.backgroundColor(Color.Transparent);
            Button.width(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.height(CommonConstants.ONE_HUNDRED_PERCENT);
            Button.onClick(() => {
                this.clear();
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
