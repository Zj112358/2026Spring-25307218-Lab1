import List from "@ohos:util.List";
import DrawPath, { ShapeDraw, TextDraw, DrawPathData, TouchPointData, FountainPenPointData } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IDraw";
import hilog from "@ohos:hilog";
import type { BusinessError } from "@ohos:base";
export default class DrawInvoker {
    // Draw list.
    private drawPathList: List<DrawPath> = new List<DrawPath>();
    // Redo list.
    private redoList: Array<DrawPath> = new Array<DrawPath>();
    add(command: DrawPath): void {
        try {
            this.drawPathList.add(command);
        }
        catch (error) {
            let err = error as BusinessError;
            hilog.error(0x0000, 'DrawInvoker', `list add failed. code=${err.code}, message=${err.message}`);
        }
        this.redoList = [];
    }
    clear(): void {
        try {
            this.drawPathList.clear();
        }
        catch (error) {
            let err = error as BusinessError;
            hilog.error(0x0000, 'DrawInvoker', `list clear failed. code=${err.code}, message=${err.message}`);
        }
        this.redoList = [];
    }
    undo(): void {
        if (this.drawPathList.length > 0) {
            try {
                let undo: DrawPath = this.drawPathList.get(this.drawPathList.length - 1);
                this.drawPathList.removeByIndex(this.drawPathList.length - 1);
                this.redoList.push(undo);
            }
            catch (error) {
                let err = error as BusinessError;
                hilog.error(0x0000, 'DrawInvoker', `undo failed. code=${err.code}, message=${err.message}`);
            }
        }
    }
    redo(): void {
        if (this.redoList.length > 0) {
            let redoCommand = this.redoList[this.redoList.length - 1];
            this.redoList.pop();
            try {
                this.drawPathList.add(redoCommand);
            }
            catch (error) {
                let err = error as BusinessError;
                hilog.error(0x0000, 'DrawInvoker', `list add failed. code=${err.code}, message=${err.message}`);
            }
        }
    }
    execute(context: CanvasRenderingContext2D): void {
        if (this.drawPathList !== null) {
            try {
                this.drawPathList.forEach((element: DrawPath) => {
                    element.draw(context);
                });
            }
            catch (error) {
                let err = error as BusinessError;
                hilog.error(0x0000, 'DrawInvoker', `execute failed. code=${err.code}, message=${err.message}`);
            }
        }
    }
    canRedo(): boolean {
        return this.redoList.length > 0;
    }
    canUndo(): boolean {
        return this.drawPathList.length > 0;
    }
    removeAt(index: number): void {
        if (index >= 0 && index < this.drawPathList.length) {
            try {
                this.drawPathList.removeByIndex(index);
            }
            catch (error) {
                let err = error as BusinessError;
                hilog.error(0x0000, 'DrawInvoker', `removeAt failed. code=${err.code}, message=${err.message}`);
            }
            this.redoList = [];
        }
    }
    getAt(index: number): DrawPath | null {
        if (index >= 0 && index < this.drawPathList.length) {
            return this.drawPathList.get(index);
        }
        return null;
    }
    getCount(): number {
        return this.drawPathList.length;
    }
    findShapeAt(x: number, y: number): number {
        for (let i = this.drawPathList.length - 1; i >= 0; i--) {
            let element = this.drawPathList.get(i);
            if (element.hitTest(x, y)) {
                return i;
            }
        }
        return -1;
    }
    serializeAll(): string {
        let items: DrawPathData[] = [];
        for (let i = 0; i < this.drawPathList.length; i++) {
            let element = this.drawPathList.get(i);
            items.push(element.toJSON());
        }
        return JSON.stringify(items);
    }
    deserializeAll(json: string): void {
        this.clear();
        let rawItems = JSON.parse(json) as Array<Record<string, Object>>;
        for (let i = 0; i < rawItems.length; i++) {
            let raw = rawItems[i];
            let type = raw['type'] as string;
            let data = new DrawPathData();
            let p = raw['paint'] as Record<string, Object>;
            data.paint.lineWidth = p['lineWidth'] as number;
            data.paint.strokeStyle = p['strokeStyle'] as string;
            data.paint.globalAlpha = p['globalAlpha'] as number;
            data.paint.isEraser = (p['isEraser'] as boolean) ?? false;
            data.offsetX = raw['offsetX'] as number;
            data.offsetY = raw['offsetY'] as number;
            data.rotation = raw['rotation'] as number;
            if (type === 'shapedraw') {
                data.type = 'shapedraw';
                data.shapeType = raw['shapeType'] as string;
                data.startX = raw['startX'] as number;
                data.startY = raw['startY'] as number;
                data.endX = raw['endX'] as number;
                data.endY = raw['endY'] as number;
                this.add(ShapeDraw.fromJSON(data));
            }
            else if (type === 'textdraw') {
                data.type = 'textdraw';
                data.text = raw['text'] as string;
                data.x = raw['x'] as number;
                data.y = raw['y'] as number;
                data.fontSize = raw['fontSize'] as number;
                data.fontWeight = raw['fontWeight'] as number;
                data.fontStyle = raw['fontStyle'] as number;
                this.add(TextDraw.fromJSON(data));
            }
            else {
                data.type = 'drawpath';
                data.isFountainPen = raw['isFountainPen'] as boolean;
                let ptsArr = raw['touchPoints'] as Array<Record<string, Object>>;
                for (let j = 0; j < ptsArr.length; j++) {
                    let pt = ptsArr[j];
                    let tpd = new TouchPointData();
                    tpd.x = pt['x'] as number;
                    tpd.y = pt['y'] as number;
                    data.touchPoints.push(tpd);
                }
                let fpArr = raw['fountainPenPoints'] as Array<Record<string, Object>>;
                for (let j = 0; j < fpArr.length; j++) {
                    let fpd = new FountainPenPointData();
                    let fp = fpArr[j];
                    fpd.x = fp['x'] as number;
                    fpd.y = fp['y'] as number;
                    fpd.velocity = fp['velocity'] as number;
                    data.fountainPenPoints.push(fpd);
                }
                this.add(DrawPath.fromJSON(data));
            }
        }
    }
}
