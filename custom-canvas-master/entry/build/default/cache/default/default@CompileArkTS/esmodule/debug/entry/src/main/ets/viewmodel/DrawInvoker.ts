import List from "@ohos:util.List";
import type DrawPath from './IDraw';
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
        if (this.drawPathList.length > 0 || this.redoList.length > 0) {
            try {
                this.drawPathList.clear();
            }
            catch (error) {
                let err = error as BusinessError;
                hilog.error(0x0000, 'DrawInvoker', `list clear failed. code=${err.code}, message=${err.message}`);
            }
            this.redoList = [];
        }
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
}
