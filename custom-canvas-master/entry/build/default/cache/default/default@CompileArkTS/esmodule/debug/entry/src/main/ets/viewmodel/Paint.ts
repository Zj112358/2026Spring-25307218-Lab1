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
export default class Paint {
    lineWidth: number;
    StrokeStyle: string;
    globalAlpha: number;
    isEraser: boolean;
    constructor(lineWidth: number, StrokeStyle: string, globalAlpha: number, isEraser?: boolean) {
        this.lineWidth = lineWidth;
        this.StrokeStyle = StrokeStyle;
        this.globalAlpha = globalAlpha;
        this.isEraser = isEraser ?? false;
    }
    setColor(color: string) {
        this.StrokeStyle = color;
    }
    setStrokeWidth(width: number) {
        this.lineWidth = width;
    }
    setGlobalAlpha(alpha: number) {
        this.globalAlpha = alpha;
    }
    setEraser(isEraser: boolean) {
        this.isEraser = isEraser;
    }
    toJSON(): PaintData {
        let d = new PaintData();
        d.lineWidth = this.lineWidth;
        d.strokeStyle = this.StrokeStyle;
        d.globalAlpha = this.globalAlpha;
        d.isEraser = this.isEraser;
        return d;
    }
    static fromJSON(data: PaintData): Paint {
        return new Paint(data.lineWidth, data.strokeStyle, data.globalAlpha, data.isEraser);
    }
}
export class PaintData {
    lineWidth: number = 0;
    strokeStyle: string = '';
    globalAlpha: number = 1;
    isEraser: boolean = false;
}
