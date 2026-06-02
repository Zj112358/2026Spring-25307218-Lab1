import AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
import display from "@ohos:display";
const CONTINUE_DRAW_DATA = 'ContinueDrawData';
const CONTINUE_SELECTED_INDEX = 'ContinueSelectedIndex';
const CONTINUE_SCALE_X = 'ContinueScaleX';
const CONTINUE_SCALE_Y = 'ContinueScaleY';
const CONTINUE_SHAPE_TOOL = 'ContinueShapeTool';
const CONTINUE_IS_PAINT = 'ContinueIsPaint';
const CONTINUE_IS_ERASER = 'ContinueIsEraser';
const RESTORE_KEY = 'NeedRestoreData';
const CONTINUE_ERROR = 'ContinueError';
const MAX_WANT_PARAM_SIZE = 100 * 1024;
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onCreate');
        if (launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION) {
            this.restoreFromWant(want);
        }
    }
    onDestroy(): void {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageCreate');
        windowStage.loadContent('pages/Index', (err) => {
            if (err.code) {
                hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
                return;
            }
            hilog.info(0x0000, 'testTag', 'Succeeded in loading the content.');
        });
        try {
            let win = windowStage.getMainWindowSync();
            win.on('windowSizeChange', (size: window.Size) => {
                hilog.info(0x0000, 'testTag', 'Window size changed: w=%{public}d h=%{public}d', size.width, size.height);
                AppStorage.setOrCreate('windowWidth', size.width);
                AppStorage.setOrCreate('windowHeight', size.height);
                try {
                    let d = display.getDefaultDisplaySync();
                    let widthVp = size.width / d.densityPixels;
                    let bp = 'sm';
                    if (widthVp >= 840) {
                        bp = 'lg';
                    }
                    else if (widthVp >= 600) {
                        bp = 'md';
                    }
                    AppStorage.setOrCreate('currentBreakpoint', bp);
                    let isLandscape = size.width > size.height;
                    AppStorage.setOrCreate('isLandscape', isLandscape);
                }
                catch (error) {
                    hilog.error(0x0000, 'testTag', 'Failed to calc breakpoint: %{public}s', JSON.stringify(error) ?? '');
                }
            });
        }
        catch (error) {
            hilog.error(0x0000, 'testTag', 'Failed to listen window size: %{public}s', JSON.stringify(error) ?? '');
        }
    }
    onWindowStageDestroy(): void {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
    }
    onForeground(): void {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onForeground');
    }
    onBackground(): void {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onBackground');
    }
    onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onNewWant');
        if (launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION) {
            this.restoreFromWant(want);
        }
    }
    onContinue(wantParam: Record<string, Object>): AbilityConstant.OnContinueResult {
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onContinue');
        try {
            let drawData = AppStorage.get<string>(CONTINUE_DRAW_DATA) ?? '';
            if (drawData.length > MAX_WANT_PARAM_SIZE) {
                hilog.warn(0x0000, 'testTag', 'drawData size %{public}d exceeds limit %{public}d, truncating', drawData.length, MAX_WANT_PARAM_SIZE);
                drawData = drawData.substring(0, MAX_WANT_PARAM_SIZE);
                AppStorage.setOrCreate(CONTINUE_ERROR, 'data_truncated');
            }
            let selectedIndex = AppStorage.get<number>(CONTINUE_SELECTED_INDEX) ?? -1;
            let scaleX = AppStorage.get<number>(CONTINUE_SCALE_X) ?? 1;
            let scaleY = AppStorage.get<number>(CONTINUE_SCALE_Y) ?? 1;
            let shapeTool = AppStorage.get<string>(CONTINUE_SHAPE_TOOL) ?? '';
            let isPaint = AppStorage.get<boolean>(CONTINUE_IS_PAINT) ?? false;
            let isEraser = AppStorage.get<boolean>(CONTINUE_IS_ERASER) ?? false;
            wantParam[CONTINUE_DRAW_DATA] = drawData;
            wantParam[CONTINUE_SELECTED_INDEX] = selectedIndex;
            wantParam[CONTINUE_SCALE_X] = scaleX;
            wantParam[CONTINUE_SCALE_Y] = scaleY;
            wantParam[CONTINUE_SHAPE_TOOL] = shapeTool;
            wantParam[CONTINUE_IS_PAINT] = isPaint;
            wantParam[CONTINUE_IS_ERASER] = isEraser;
            return AbilityConstant.OnContinueResult.AGREE;
        }
        catch (error) {
            hilog.error(0x0000, 'testTag', 'onContinue failed: %{public}s', JSON.stringify(error) ?? '');
            AppStorage.setOrCreate(CONTINUE_ERROR, 'continue_failed');
            return AbilityConstant.OnContinueResult.REJECT;
        }
    }
    private restoreFromWant(want: Want): void {
        try {
            let drawData = want.parameters?.[CONTINUE_DRAW_DATA] as string;
            let selectedIndex = want.parameters?.[CONTINUE_SELECTED_INDEX] as number;
            let scaleX = want.parameters?.[CONTINUE_SCALE_X] as number;
            let scaleY = want.parameters?.[CONTINUE_SCALE_Y] as number;
            let shapeTool = want.parameters?.[CONTINUE_SHAPE_TOOL] as string;
            let isPaint = want.parameters?.[CONTINUE_IS_PAINT] as boolean;
            let isEraser = want.parameters?.[CONTINUE_IS_ERASER] as boolean;
            AppStorage.setOrCreate(CONTINUE_DRAW_DATA, drawData ?? '');
            AppStorage.setOrCreate(CONTINUE_SELECTED_INDEX, selectedIndex ?? -1);
            AppStorage.setOrCreate(CONTINUE_SCALE_X, scaleX ?? 1);
            AppStorage.setOrCreate(CONTINUE_SCALE_Y, scaleY ?? 1);
            AppStorage.setOrCreate(CONTINUE_SHAPE_TOOL, shapeTool ?? '');
            AppStorage.setOrCreate(CONTINUE_IS_PAINT, isPaint ?? false);
            AppStorage.setOrCreate(CONTINUE_IS_ERASER, isEraser ?? false);
            AppStorage.setOrCreate(RESTORE_KEY, true);
        }
        catch (error) {
            hilog.error(0x0000, 'testTag', 'restoreFromWant failed: %{public}s', JSON.stringify(error) ?? '');
            AppStorage.setOrCreate(CONTINUE_ERROR, 'restore_failed');
            AppStorage.setOrCreate(RESTORE_KEY, false);
        }
    }
}
export { CONTINUE_DRAW_DATA, CONTINUE_SELECTED_INDEX, CONTINUE_SCALE_X, CONTINUE_SCALE_Y, CONTINUE_SHAPE_TOOL, CONTINUE_IS_PAINT, CONTINUE_IS_ERASER, RESTORE_KEY, CONTINUE_ERROR };
