import ScreenInfo from "@bundle:com.example.customcanvas/entry/ets/common/ScreenInfo";
import type display from "@ohos:display";
export enum BreakpointType {
    SM = 0,
    MD = 1,
    LG = 2
}
export default class BreakpointSystem {
    static readonly SM_MAX: number = 600;
    static readonly MD_MAX: number = 840;
    static calculate(widthVp: number): BreakpointType {
        if (widthVp < BreakpointSystem.SM_MAX)
            return BreakpointType.SM;
        if (widthVp < BreakpointSystem.MD_MAX)
            return BreakpointType.MD;
        return BreakpointType.LG;
    }
    static getCurrent(): BreakpointType {
        let widthVp = ScreenInfo.getWidthVp();
        return BreakpointSystem.calculate(widthVp);
    }
    static toString(bp: BreakpointType): string {
        if (bp === BreakpointType.SM)
            return 'sm';
        if (bp === BreakpointType.MD)
            return 'md';
        return 'lg';
    }
    static isLandscape(): boolean {
        let w = ScreenInfo.getWidthVp();
        let h = ScreenInfo.getHeightVp();
        return w > h;
    }
    static getFoldScaleRatio(foldStatus: display.FoldStatus): number {
        if (foldStatus === 2) {
            return 0.5;
        }
        return 1.0;
    }
}
