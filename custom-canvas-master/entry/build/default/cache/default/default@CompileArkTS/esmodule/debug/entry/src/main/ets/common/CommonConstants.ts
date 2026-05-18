/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export class CommonConstants {
    /**
     * Zero.
     */
    static readonly ZERO: number = 0;
    /**
     * One.
     */
    static readonly ONE: number = 1;
    /**
     * Negative one.
     */
    static readonly NEGATIVE_ONE: number = -1;
    /**
     * Three.
     */
    static readonly THREE: number = 3;
    /**
     * Ten.
     */
    static readonly TEN: number = 10;
    /**
     * Twenty-one.
     */
    static readonly TWENTY_ONE: number = 21;
    /**
     * Canvas width.
     */
    static readonly CANVAS_WIDTH: number = 750;
    /**
     * One hundred.
     */
    static readonly ONE_HUNDRED: number = 100;
    /**
     * String empty.
     */
    static readonly COLOR_STRING: string = '';
    /**
     * Percent sign.
     */
    static readonly SIGN: string = '%';
    /**
     * Basic color.
     */
    static readonly BLACK: string = 'black';
    /**
     * One hundred percent.
     */
    static readonly ONE_HUNDRED_PERCENT: string = '100%';
    /**
     * Arr color.
     */
    static readonly COLOR_ARR: string[] = ['#E90808', '#63B959', '#0A59F7', '#E56224', '#F6C800', '#5445EF', '#A946F1',
        '#000000'];
    static readonly COLOR_GRAY_ROW: string[] = CommonConstants.generateGrayRow();
    static readonly COLOR_GRID: string[][] = CommonConstants.generateColorGrid();
    private static hslToHex(h: number, s: number, l: number): string {
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        let m = l - c / 2;
        let r1 = 0;
        let g1 = 0;
        let b1 = 0;
        if (h < 60) {
            r1 = c;
            g1 = x;
        }
        else if (h < 120) {
            r1 = x;
            g1 = c;
        }
        else if (h < 180) {
            g1 = c;
            b1 = x;
        }
        else if (h < 240) {
            g1 = x;
            b1 = c;
        }
        else if (h < 300) {
            r1 = x;
            b1 = c;
        }
        else {
            r1 = c;
            b1 = x;
        }
        let r = Math.round((r1 + m) * 255);
        let g = Math.round((g1 + m) * 255);
        let b = Math.round((b1 + m) * 255);
        return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') +
            b.toString(16).padStart(2, '0');
    }
    private static generateGrayRow(): string[] {
        let row: string[] = [];
        for (let i = 0; i < 10; i++) {
            let v = Math.round(255 - i * 255 / 9);
            let hex = v.toString(16).padStart(2, '0');
            row.push('#' + hex + hex + hex);
        }
        return row;
    }
    private static generateColorGrid(): string[][] {
        let grid: string[][] = [];
        let hueSteps = [180, 200, 220, 240, 270, 300, 330, 0, 20, 40, 60, 140, 160];
        let hues = [180, 210, 240, 270, 300, 330, 0, 30, 60, 120];
        for (let row = 0; row < 9; row++) {
            let line: string[] = [];
            let lightness = 0.1 + row * 0.08;
            for (let col = 0; col < 10; col++) {
                let h = hues[col];
                let s = 1.0 - row * 0.06;
                if (s < 0.1)
                    s = 0.1;
                line.push(CommonConstants.hslToHex(h, s, lightness).toUpperCase());
            }
            grid.push(line);
        }
        return grid;
    }
    /**
     * White.
     */
    static readonly WHITE: string = '#ffffff';
    /**
     * Detents.
     */
    static readonly DETENTS: [
        Length,
        Length
    ] = [650, 750];
}
