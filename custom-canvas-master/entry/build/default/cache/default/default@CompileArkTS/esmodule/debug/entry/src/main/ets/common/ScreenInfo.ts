import display from "@ohos:display";
import hilog from "@ohos:hilog";
const TAG = 'ScreenInfo';
const DOMAIN = 0x0000;
export default class ScreenInfo {
    static getWidthVp(): number {
        try {
            let d = display.getDefaultDisplaySync();
            return d.width / d.densityPixels;
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'getWidthVp failed: %{public}s', JSON.stringify(error) ?? '');
            return 750;
        }
    }
    static getHeightVp(): number {
        try {
            let d = display.getDefaultDisplaySync();
            return d.height / d.densityPixels;
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'getHeightVp failed: %{public}s', JSON.stringify(error) ?? '');
            return 1334;
        }
    }
    static getWidthPx(): number {
        try {
            let d = display.getDefaultDisplaySync();
            return d.width;
        }
        catch (error) {
            return 750;
        }
    }
    static getHeightPx(): number {
        try {
            let d = display.getDefaultDisplaySync();
            return d.height;
        }
        catch (error) {
            return 1334;
        }
    }
    static getDensityPixels(): number {
        try {
            let d = display.getDefaultDisplaySync();
            return d.densityPixels;
        }
        catch (error) {
            return 2;
        }
    }
    static getRefreshRate(): number {
        try {
            let d = display.getDefaultDisplaySync();
            return d.refreshRate;
        }
        catch (error) {
            return 60;
        }
    }
}
