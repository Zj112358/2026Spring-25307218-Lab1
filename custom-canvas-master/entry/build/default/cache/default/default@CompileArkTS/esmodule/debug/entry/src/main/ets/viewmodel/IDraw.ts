import Paint, { PaintData } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/Paint";
import { FountainPenPoint } from "@bundle:com.example.customcanvas/entry/ets/viewmodel/IBrush";
export class TouchPointData {
    x: number = 0;
    y: number = 0;
}
export class FountainPenPointData {
    x: number = 0;
    y: number = 0;
    velocity: number = 0;
}
export class DrawPathData {
    type: string = 'drawpath';
    paint: PaintData = new PaintData();
    touchPoints: TouchPointData[] = [];
    isFountainPen: boolean = false;
    fountainPenPoints: FountainPenPointData[] = [];
    offsetX: number = 0;
    offsetY: number = 0;
    rotation: number = 0;
    shapeType: string = '';
    startX: number = 0;
    startY: number = 0;
    endX: number = 0;
    endY: number = 0;
    text: string = '';
    x: number = 0;
    y: number = 0;
    fontSize: number = 24;
    fontWeight: number = 0;
    fontStyle: number = 0;
}
export interface IDraw {
    draw(context: CanvasRenderingContext2D): void;
    getBounds(): number[];
    hitTest(x: number, y: number): boolean;
    moveBy(dx: number, dy: number): void;
    rotateBy(angle: number): void;
}
export class DrawBounds {
    public minX: number = 0;
    public minY: number = 0;
    public maxX: number = 0;
    public maxY: number = 0;
}
/**
 * Drawn path.
 */
export default class DrawPath implements IDraw {
    public paint: Paint;
    public path: Path2D;
    public isFountainPen: boolean = false;
    public fountainPenPoints: FountainPenPoint[] = [];
    public offsetX: number = 0;
    public offsetY: number = 0;
    public rotation: number = 0;
    public touchPoints: TouchPointData[] = [];
    private _boundsMinX: number = 0;
    private _boundsMinY: number = 0;
    private _boundsMaxX: number = 0;
    private _boundsMaxY: number = 0;
    private _boundsSet: boolean = false;
    constructor(paint: Paint, path: Path2D) {
        this.paint = paint;
        this.path = path;
    }
    updateBounds(x: number, y: number): void {
        if (!this._boundsSet) {
            this._boundsMinX = x;
            this._boundsMinY = y;
            this._boundsMaxX = x;
            this._boundsMaxY = y;
            this._boundsSet = true;
        }
        else {
            if (x < this._boundsMinX)
                this._boundsMinX = x;
            if (y < this._boundsMinY)
                this._boundsMinY = y;
            if (x > this._boundsMaxX)
                this._boundsMaxX = x;
            if (y > this._boundsMaxY)
                this._boundsMaxY = y;
        }
    }
    resetBounds(): void {
        this._boundsMinX = Infinity;
        this._boundsMinY = Infinity;
        this._boundsMaxX = -Infinity;
        this._boundsMaxY = -Infinity;
        this._boundsSet = false;
    }
    getBounds(): number[] {
        if (!this._boundsSet) {
            return [0, 0, 0, 0];
        }
        if (this.rotation === 0) {
            return [this._boundsMinX + this.offsetX, this._boundsMinY + this.offsetY,
                this._boundsMaxX + this.offsetX, this._boundsMaxY + this.offsetY];
        }
        let cx = (this._boundsMinX + this._boundsMaxX) / 2 + this.offsetX;
        let cy = (this._boundsMinY + this._boundsMaxY) / 2 + this.offsetY;
        let hw = (this._boundsMaxX - this._boundsMinX) / 2;
        let hh = (this._boundsMaxY - this._boundsMinY) / 2;
        let cos = Math.cos(this.rotation);
        let sin = Math.sin(this.rotation);
        let corners = [
            [cx + hw * cos - hh * sin, cy + hw * sin + hh * cos],
            [cx - hw * cos - hh * sin, cy - hw * sin + hh * cos],
            [cx - hw * cos + hh * sin, cy - hw * sin - hh * cos],
            [cx + hw * cos + hh * sin, cy + hw * sin - hh * cos]
        ];
        let minX = corners[0][0], minY = corners[0][1];
        let maxX = corners[0][0], maxY = corners[0][1];
        for (let i = 1; i < 4; i++) {
            if (corners[i][0] < minX)
                minX = corners[i][0];
            if (corners[i][1] < minY)
                minY = corners[i][1];
            if (corners[i][0] > maxX)
                maxX = corners[i][0];
            if (corners[i][1] > maxY)
                maxY = corners[i][1];
        }
        return [minX, minY, maxX, maxY];
    }
    hitTest(x: number, y: number): boolean {
        let margin = Math.max(this.paint.lineWidth / 2 + 8, 15);
        let bounds = this.getBounds();
        return x >= bounds[0] - margin && x <= bounds[2] + margin &&
            y >= bounds[1] - margin && y <= bounds[3] + margin;
    }
    moveBy(dx: number, dy: number): void {
        this.offsetX += dx;
        this.offsetY += dy;
    }
    rotateBy(angle: number): void {
        this.rotation += angle;
    }
    applyTransform(context: CanvasRenderingContext2D): void {
        if (this.offsetX !== 0 || this.offsetY !== 0 || this.rotation !== 0) {
            let cx = (this._boundsMinX + this._boundsMaxX) / 2;
            let cy = (this._boundsMinY + this._boundsMaxY) / 2;
            context.translate(cx + this.offsetX, cy + this.offsetY);
            context.rotate(this.rotation);
            context.translate(-cx, -cy);
        }
    }
    restoreTransform(context: CanvasRenderingContext2D): void {
        if (this.offsetX !== 0 || this.offsetY !== 0 || this.rotation !== 0) {
            context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    draw(context: CanvasRenderingContext2D): void {
        this.applyTransform(context);
        if (this.paint.isEraser) {
            let prevComposite = context.globalCompositeOperation;
            context.globalCompositeOperation = 'destination-out';
            context.lineWidth = this.paint.lineWidth;
            context.strokeStyle = '#000000';
            context.globalAlpha = 1;
            context.lineCap = 'round';
            context.stroke(this.path);
            context.globalCompositeOperation = prevComposite;
        }
        else if (this.isFountainPen && this.fountainPenPoints.length > 1) {
            this.drawFountainPen(context);
        }
        else {
            context.lineWidth = this.paint.lineWidth;
            context.strokeStyle = this.paint.StrokeStyle;
            context.globalAlpha = this.paint.globalAlpha;
            context.lineCap = 'round';
            context.stroke(this.path);
        }
        this.restoreTransform(context);
    }
    rebuildPath(): void {
        this.path = new Path2D();
        if (this.touchPoints.length === 0) {
            return;
        }
        this.path.moveTo(this.touchPoints[0].x, this.touchPoints[0].y);
        for (let i = 1; i < this.touchPoints.length; i++) {
            this.path.lineTo(this.touchPoints[i].x, this.touchPoints[i].y);
        }
    }
    toJSON(): DrawPathData {
        let d = new DrawPathData();
        d.paint = this.paint.toJSON();
        d.isFountainPen = this.isFountainPen;
        d.offsetX = this.offsetX;
        d.offsetY = this.offsetY;
        d.rotation = this.rotation;
        for (let i = 0; i < this.touchPoints.length; i++) {
            let tp = new TouchPointData();
            tp.x = this.touchPoints[i].x;
            tp.y = this.touchPoints[i].y;
            d.touchPoints.push(tp);
        }
        for (let i = 0; i < this.fountainPenPoints.length; i++) {
            let fp = new FountainPenPointData();
            fp.x = this.fountainPenPoints[i].x;
            fp.y = this.fountainPenPoints[i].y;
            fp.velocity = this.fountainPenPoints[i].velocity;
            d.fountainPenPoints.push(fp);
        }
        return d;
    }
    static fromJSON(data: DrawPathData): DrawPath {
        let paint = Paint.fromJSON(data.paint);
        let dp = new DrawPath(paint, new Path2D());
        for (let i = 0; i < data.touchPoints.length; i++) {
            let tp = new TouchPointData();
            tp.x = data.touchPoints[i].x;
            tp.y = data.touchPoints[i].y;
            dp.touchPoints.push(tp);
        }
        dp.isFountainPen = data.isFountainPen;
        for (let i = 0; i < data.fountainPenPoints.length; i++) {
            let fp = data.fountainPenPoints[i];
            dp.fountainPenPoints.push(new FountainPenPoint(fp.x, fp.y, fp.velocity));
        }
        dp.offsetX = data.offsetX;
        dp.offsetY = data.offsetY;
        dp.rotation = data.rotation;
        dp.rebuildPath();
        for (let i = 0; i < dp.touchPoints.length; i++) {
            dp.updateBounds(dp.touchPoints[i].x, dp.touchPoints[i].y);
        }
        return dp;
    }
    private drawFountainPen(context: CanvasRenderingContext2D): void {
        const baseWidth = this.paint.lineWidth;
        const baseColor = this.paint.StrokeStyle;
        const baseAlpha = this.paint.globalAlpha;
        const points = this.fountainPenPoints;
        if (points.length < 2) {
            return;
        }
        const widths: number[] = this.computeWidths(points, baseWidth);
        context.strokeStyle = baseColor;
        context.globalAlpha = baseAlpha;
        context.lineCap = 'round';
        for (let i = 1; i < points.length; i++) {
            context.lineWidth = (widths[i - 1] + widths[i]) / 2;
            context.beginPath();
            context.moveTo(points[i - 1].x, points[i - 1].y);
            context.lineTo(points[i].x, points[i].y);
            context.stroke();
        }
    }
    private computeWidths(points: FountainPenPoint[], baseWidth: number): number[] {
        const widths: number[] = [];
        let maxVelocity = 0;
        for (let i = 0; i < points.length; i++) {
            if (points[i].velocity > maxVelocity) {
                maxVelocity = points[i].velocity;
            }
        }
        if (maxVelocity === 0) {
            maxVelocity = 1;
        }
        for (let i = 0; i < points.length; i++) {
            const normalizedVelocity = Math.min(points[i].velocity / maxVelocity, 1);
            const widthFactor = 1.5 - normalizedVelocity * 1.1;
            widths.push(baseWidth * widthFactor);
        }
        for (let pass = 0; pass < 2; pass++) {
            const smoothed: number[] = [widths[0]];
            for (let i = 1; i < widths.length - 1; i++) {
                smoothed.push((widths[i - 1] + widths[i] + widths[i + 1]) / 3);
            }
            smoothed.push(widths[widths.length - 1]);
            for (let i = 0; i < smoothed.length; i++) {
                widths[i] = smoothed[i];
            }
        }
        const taperLength = Math.min(4, Math.floor(points.length / 4));
        for (let i = 0; i < taperLength; i++) {
            const t = (i + 1) / (taperLength + 1);
            widths[i] *= t;
            widths[widths.length - 1 - i] *= t;
        }
        return widths;
    }
}
export class ShapeDraw extends DrawPath {
    public shapeType: string;
    public startX: number;
    public startY: number;
    public endX: number;
    public endY: number;
    constructor(paint: Paint, shapeType: string, startX: number, startY: number, endX: number, endY: number) {
        super(paint, new Path2D());
        this.shapeType = shapeType;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.isFountainPen = false;
        this.fountainPenPoints = [];
        this.computeBounds();
    }
    computeBounds(): void {
        if (this.shapeType === 'line') {
            this.updateBounds(this.startX, this.startY);
            this.updateBounds(this.endX, this.endY);
        }
        else if (this.shapeType === 'arrow') {
            this.updateBounds(this.startX, this.startY);
            this.updateBounds(this.endX, this.endY);
            let dx = this.endX - this.startX;
            let dy = this.endY - this.startY;
            let len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0) {
                let headLen = Math.min(len * 0.25, 20);
                let angle = Math.atan2(dy, dx);
                this.updateBounds(this.endX - headLen * Math.cos(angle - Math.PI / 6), this.endY - headLen * Math.sin(angle - Math.PI / 6));
                this.updateBounds(this.endX - headLen * Math.cos(angle + Math.PI / 6), this.endY - headLen * Math.sin(angle + Math.PI / 6));
            }
        }
        else if (this.shapeType === 'circle') {
            let cx = (this.startX + this.endX) / 2;
            let cy = (this.startY + this.endY) / 2;
            let r = Math.min(Math.abs(this.endX - this.startX), Math.abs(this.endY - this.startY)) / 2;
            this.updateBounds(cx - r, cy - r);
            this.updateBounds(cx + r, cy + r);
        }
        else if (this.shapeType === 'rect' || this.shapeType === 'ellipse' || this.shapeType === 'triangle') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            this.updateBounds(x, y);
            this.updateBounds(x + w, y + h);
        }
        else if (this.shapeType === 'diamond') {
            let cx = (this.startX + this.endX) / 2;
            let cy = (this.startY + this.endY) / 2;
            let hw = Math.abs(this.endX - this.startX) / 2;
            let hh = Math.abs(this.endY - this.startY) / 2;
            this.updateBounds(cx - hw, cy - hh);
            this.updateBounds(cx + hw, cy + hh);
        }
        else if (this.shapeType === 'star') {
            let cx = (this.startX + this.endX) / 2;
            let cy = (this.startY + this.endY) / 2;
            let outerR = Math.min(Math.abs(this.endX - this.startX), Math.abs(this.endY - this.startY)) / 2;
            let innerR = outerR * 0.4;
            for (let i = 0; i < 5; i++) {
                let outerAngle = (i * 72 - 90) * Math.PI / 180;
                let innerAngle = ((i * 72 + 36) - 90) * Math.PI / 180;
                this.updateBounds(cx + outerR * Math.cos(outerAngle), cy + outerR * Math.sin(outerAngle));
                this.updateBounds(cx + innerR * Math.cos(innerAngle), cy + innerR * Math.sin(innerAngle));
            }
        }
        else if (this.shapeType === 'cube') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            let ox = Math.min(w, h) * 0.35;
            let oy = Math.min(w, h) * 0.25;
            this.updateBounds(x, y);
            this.updateBounds(x + w, y + h);
            this.updateBounds(x + ox, y - oy);
            this.updateBounds(x + w + ox, y + h - oy);
        }
        else if (this.shapeType === 'cylinder') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            this.updateBounds(x, y);
            this.updateBounds(x + w, y + h);
        }
        else if (this.shapeType === 'cone') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            let cx = x + w / 2;
            this.updateBounds(cx, y);
            this.updateBounds(x, y + h);
            this.updateBounds(x + w, y + h);
        }
        else if (this.shapeType === 'pyramid') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            let cx = x + w / 2;
            let ox = w * 0.25;
            let oy = h * 0.18;
            this.updateBounds(cx, y);
            this.updateBounds(x, y + h);
            this.updateBounds(x + w + ox, y + h - oy);
        }
        else if (this.shapeType === 'sphere') {
            let cx = (this.startX + this.endX) / 2;
            let cy = (this.startY + this.endY) / 2;
            let r = Math.min(Math.abs(this.endX - this.startX), Math.abs(this.endY - this.startY)) / 2;
            this.updateBounds(cx - r, cy - r);
            this.updateBounds(cx + r, cy + r);
        }
    }
    draw(context: CanvasRenderingContext2D): void {
        this.applyTransform(context);
        context.lineWidth = this.paint.lineWidth;
        context.strokeStyle = this.paint.StrokeStyle;
        context.globalAlpha = this.paint.globalAlpha;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        if (this.shapeType === 'line') {
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.lineTo(this.endX, this.endY);
            context.stroke();
        }
        else if (this.shapeType === 'circle') {
            let cx = (this.startX + this.endX) / 2;
            let cy = (this.startY + this.endY) / 2;
            let r = Math.min(Math.abs(this.endX - this.startX), Math.abs(this.endY - this.startY)) / 2;
            if (r > 0) {
                context.beginPath();
                context.arc(cx, cy, r, 0, 2 * Math.PI);
                context.stroke();
            }
        }
        else if (this.shapeType === 'rect') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            context.beginPath();
            context.rect(x, y, w, h);
            context.stroke();
        }
        else if (this.shapeType === 'ellipse') {
            let cx = (this.startX + this.endX) / 2;
            let cy = (this.startY + this.endY) / 2;
            let rx = Math.abs(this.endX - this.startX) / 2;
            let ry = Math.abs(this.endY - this.startY) / 2;
            if (rx > 0 && ry > 0) {
                context.beginPath();
                context.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
                context.stroke();
            }
        }
        else if (this.shapeType === 'triangle') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            context.beginPath();
            context.moveTo(x + w / 2, y);
            context.lineTo(x + w, y + h);
            context.lineTo(x, y + h);
            context.closePath();
            context.stroke();
        }
        else if (this.shapeType === 'diamond') {
            let cx = (this.startX + this.endX) / 2;
            let cy = (this.startY + this.endY) / 2;
            let hw = Math.abs(this.endX - this.startX) / 2;
            let hh = Math.abs(this.endY - this.startY) / 2;
            context.beginPath();
            context.moveTo(cx, cy - hh);
            context.lineTo(cx + hw, cy);
            context.lineTo(cx, cy + hh);
            context.lineTo(cx - hw, cy);
            context.closePath();
            context.stroke();
        }
        else if (this.shapeType === 'star') {
            let cx = (this.startX + this.endX) / 2;
            let cy = (this.startY + this.endY) / 2;
            let outerR = Math.min(Math.abs(this.endX - this.startX), Math.abs(this.endY - this.startY)) / 2;
            let innerR = outerR * 0.4;
            if (outerR > 0) {
                context.beginPath();
                for (let i = 0; i < 5; i++) {
                    let outerAngle = (i * 72 - 90) * Math.PI / 180;
                    let innerAngle = ((i * 72 + 36) - 90) * Math.PI / 180;
                    if (i === 0) {
                        context.moveTo(cx + outerR * Math.cos(outerAngle), cy + outerR * Math.sin(outerAngle));
                    }
                    else {
                        context.lineTo(cx + outerR * Math.cos(outerAngle), cy + outerR * Math.sin(outerAngle));
                    }
                    context.lineTo(cx + innerR * Math.cos(innerAngle), cy + innerR * Math.sin(innerAngle));
                }
                context.closePath();
                context.stroke();
            }
        }
        else if (this.shapeType === 'arrow') {
            let dx = this.endX - this.startX;
            let dy = this.endY - this.startY;
            let len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0) {
                let headLen = Math.min(len * 0.25, 20);
                let angle = Math.atan2(dy, dx);
                context.beginPath();
                context.moveTo(this.startX, this.startY);
                context.lineTo(this.endX, this.endY);
                context.stroke();
                context.beginPath();
                context.moveTo(this.endX, this.endY);
                context.lineTo(this.endX - headLen * Math.cos(angle - Math.PI / 6), this.endY - headLen * Math.sin(angle - Math.PI / 6));
                context.moveTo(this.endX, this.endY);
                context.lineTo(this.endX - headLen * Math.cos(angle + Math.PI / 6), this.endY - headLen * Math.sin(angle + Math.PI / 6));
                context.stroke();
            }
        }
        else if (this.shapeType === 'cube') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            let ox = Math.min(w, h) * 0.35;
            let oy = Math.min(w, h) * 0.25;
            let ftl_x = x, ftl_y = y;
            let ftr_x = x + w, ftr_y = y;
            let fbl_x = x, fbl_y = y + h;
            let fbr_x = x + w, fbr_y = y + h;
            let btl_x = x + ox, btl_y = y - oy;
            let btr_x = x + w + ox, btr_y = y - oy;
            let bbl_x = x + ox, bbl_y = y + h - oy;
            let bbr_x = x + w + ox, bbr_y = y + h - oy;
            context.beginPath();
            context.moveTo(fbl_x, fbl_y);
            context.lineTo(fbr_x, fbr_y);
            context.lineTo(ftr_x, ftr_y);
            context.lineTo(ftl_x, ftl_y);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.moveTo(ftl_x, ftl_y);
            context.lineTo(btl_x, btl_y);
            context.lineTo(btr_x, btr_y);
            context.lineTo(ftr_x, ftr_y);
            context.stroke();
            context.beginPath();
            context.moveTo(fbr_x, fbr_y);
            context.lineTo(bbr_x, bbr_y);
            context.lineTo(btr_x, btr_y);
            context.stroke();
            context.setLineDash([4, 4]);
            context.beginPath();
            context.moveTo(fbl_x, fbl_y);
            context.lineTo(bbl_x, bbl_y);
            context.lineTo(btl_x, btl_y);
            context.stroke();
            context.beginPath();
            context.moveTo(bbl_x, bbl_y);
            context.lineTo(bbr_x, bbr_y);
            context.stroke();
            context.setLineDash([]);
        }
        else if (this.shapeType === 'cylinder') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            let rx = w / 2;
            let ry = Math.min(h * 0.15, rx * 0.4);
            let cx = x + w / 2;
            let topY = y + ry;
            let botY = y + h - ry;
            if (rx > 0 && ry > 0) {
                context.beginPath();
                context.ellipse(cx, topY, rx, ry, 0, 0, 2 * Math.PI);
                context.stroke();
                context.beginPath();
                context.moveTo(x, topY);
                context.lineTo(x, botY);
                context.moveTo(x + w, topY);
                context.lineTo(x + w, botY);
                context.stroke();
                context.setLineDash([5, 3]);
                context.beginPath();
                context.ellipse(cx, botY, rx, ry, 0, Math.PI, 2 * Math.PI);
                context.stroke();
                context.setLineDash([]);
                context.beginPath();
                context.ellipse(cx, botY, rx, ry, 0, 0, Math.PI);
                context.stroke();
            }
        }
        else if (this.shapeType === 'cone') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            let rx = w / 2;
            let ry = Math.min(h * 0.15, rx * 0.4);
            let cx = x + w / 2;
            let apexY = y;
            let botY = y + h - ry;
            if (rx > 0 && ry > 0) {
                context.beginPath();
                context.moveTo(cx, apexY);
                context.lineTo(x, botY);
                context.moveTo(cx, apexY);
                context.lineTo(x + w, botY);
                context.stroke();
                context.setLineDash([5, 3]);
                context.beginPath();
                context.ellipse(cx, botY, rx, ry, 0, Math.PI, 2 * Math.PI);
                context.stroke();
                context.setLineDash([]);
                context.beginPath();
                context.ellipse(cx, botY, rx, ry, 0, 0, Math.PI);
                context.stroke();
            }
        }
        else if (this.shapeType === 'pyramid') {
            let x = Math.min(this.startX, this.endX);
            let y = Math.min(this.startY, this.endY);
            let w = Math.abs(this.endX - this.startX);
            let h = Math.abs(this.endY - this.startY);
            let cx = x + w / 2;
            let ox = w * 0.25;
            let oy = h * 0.18;
            let apexX = cx, apexY = y;
            let flx = x, fly = y + h;
            let frx = x + w, fry = y + h;
            let blx = x + ox, bly = y + h - oy;
            let brx = x + w + ox, bry = y + h - oy;
            context.beginPath();
            context.moveTo(apexX, apexY);
            context.lineTo(flx, fly);
            context.stroke();
            context.beginPath();
            context.moveTo(apexX, apexY);
            context.lineTo(frx, fry);
            context.stroke();
            context.beginPath();
            context.moveTo(apexX, apexY);
            context.lineTo(brx, bry);
            context.stroke();
            context.beginPath();
            context.moveTo(flx, fly);
            context.lineTo(frx, fry);
            context.stroke();
            context.beginPath();
            context.moveTo(frx, fry);
            context.lineTo(brx, bry);
            context.stroke();
            context.setLineDash([4, 4]);
            context.beginPath();
            context.moveTo(flx, fly);
            context.lineTo(blx, bly);
            context.stroke();
            context.beginPath();
            context.moveTo(blx, bly);
            context.lineTo(brx, bry);
            context.stroke();
            context.beginPath();
            context.moveTo(apexX, apexY);
            context.lineTo(blx, bly);
            context.stroke();
            context.setLineDash([]);
        }
        else if (this.shapeType === 'sphere') {
            let cx = (this.startX + this.endX) / 2;
            let cy = (this.startY + this.endY) / 2;
            let r = Math.min(Math.abs(this.endX - this.startX), Math.abs(this.endY - this.startY)) / 2;
            if (r > 0) {
                let ry = r * 0.35;
                context.beginPath();
                context.arc(cx, cy, r, 0, 2 * Math.PI);
                context.stroke();
                context.beginPath();
                context.ellipse(cx, cy, r, ry, 0, 0, Math.PI);
                context.stroke();
                context.setLineDash([6, 4]);
                context.beginPath();
                context.ellipse(cx, cy, r, ry, 0, Math.PI, 2 * Math.PI);
                context.stroke();
                context.setLineDash([]);
                context.beginPath();
                context.ellipse(cx, cy, ry, r, 0, -Math.PI / 2, Math.PI / 2);
                context.stroke();
                context.setLineDash([6, 4]);
                context.beginPath();
                context.ellipse(cx, cy, ry, r, 0, Math.PI / 2, 3 * Math.PI / 2);
                context.stroke();
                context.setLineDash([]);
            }
        }
        this.restoreTransform(context);
    }
    toJSON(): DrawPathData {
        let d = new DrawPathData();
        d.type = 'shapedraw';
        d.paint = this.paint.toJSON();
        d.shapeType = this.shapeType;
        d.startX = this.startX;
        d.startY = this.startY;
        d.endX = this.endX;
        d.endY = this.endY;
        d.offsetX = this.offsetX;
        d.offsetY = this.offsetY;
        d.rotation = this.rotation;
        return d;
    }
    static fromJSON(data: DrawPathData): ShapeDraw {
        let paint = Paint.fromJSON(data.paint);
        let sd = new ShapeDraw(paint, data.shapeType, data.startX, data.startY, data.endX, data.endY);
        sd.offsetX = data.offsetX;
        sd.offsetY = data.offsetY;
        sd.rotation = data.rotation;
        return sd;
    }
}
export class TextDraw extends DrawPath {
    public text: string;
    public fontSize: number;
    public fontWeight: FontWeight;
    public fontStyle: FontStyle;
    public x: number;
    public y: number;
    constructor(paint: Paint, text: string, x: number, y: number, fontSize: number, fontWeight?: FontWeight, fontStyle?: FontStyle) {
        super(paint, new Path2D());
        this.text = text;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.fontWeight = fontWeight ?? FontWeight.Normal;
        this.fontStyle = fontStyle ?? FontStyle.Normal;
        this.isFountainPen = false;
        this.fountainPenPoints = [];
        this.computeTextBounds();
    }
    computeTextBounds(): void {
        if (this.text.length === 0) {
            this.updateBounds(this.x, this.y);
            this.updateBounds(this.x + this.fontSize, this.y + this.fontSize);
            return;
        }
        let lineHeight = this.fontSize * 1.2;
        let lines = this.text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let lineW = line.length === 0 ? this.fontSize * 0.5 : this.measureTextWidth(line);
            let lineY = this.y + i * lineHeight;
            this.updateBounds(this.x, lineY);
            this.updateBounds(this.x + lineW, lineY + this.fontSize);
        }
    }
    private measureTextWidth(text: string): number {
        let w = 0;
        for (let i = 0; i < text.length; i++) {
            let code = text.charCodeAt(i);
            if (code > 0x4E00 && code < 0x9FFF) {
                w += this.fontSize;
            }
            else if (code >= 0x3000 && code <= 0x303F) {
                w += this.fontSize;
            }
            else if (code >= 0xFF00 && code <= 0xFFEF) {
                w += this.fontSize * 0.85;
            }
            else if (this.fontWeight === FontWeight.Bold) {
                w += this.fontSize * 0.65;
            }
            else {
                w += this.fontSize * 0.55;
            }
        }
        return w;
    }
    draw(context: CanvasRenderingContext2D): void {
        this.applyTransform(context);
        context.globalAlpha = this.paint.globalAlpha;
        context.fillStyle = this.paint.StrokeStyle;
        let styleStr = this.fontStyle === FontStyle.Italic ? 'italic' : 'normal';
        let weightStr = this.fontWeight === FontWeight.Bold ? 'bold' : 'normal';
        let sizePx = this.fontSize * 2.5;
        context.font = `${styleStr} ${weightStr} ${sizePx}px sans-serif`;
        let lineHeight = sizePx * 1.2;
        let lines = this.text.split('\n');
        this.resetBounds();
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let lineY = this.y + i * lineHeight;
            let measured = context.measureText(line);
            let lineW = measured.width > 0 ? measured.width : sizePx * 0.5;
            this.updateBounds(this.x, lineY);
            this.updateBounds(this.x + lineW, lineY + sizePx);
            context.fillText(line, this.x, lineY + sizePx * 0.8);
        }
        if (lines.length === 0 || (lines.length === 1 && lines[0].length === 0)) {
            this.updateBounds(this.x, this.y);
            this.updateBounds(this.x + sizePx, this.y + sizePx);
        }
        context.font = 'normal normal 14px sans-serif';
        this.restoreTransform(context);
    }
    toJSON(): DrawPathData {
        let d = new DrawPathData();
        d.type = 'textdraw';
        d.paint = this.paint.toJSON();
        d.text = this.text;
        d.x = this.x;
        d.y = this.y;
        d.fontSize = this.fontSize;
        d.fontWeight = this.fontWeight as number;
        d.fontStyle = this.fontStyle as number;
        d.offsetX = this.offsetX;
        d.offsetY = this.offsetY;
        d.rotation = this.rotation;
        return d;
    }
    static fromJSON(data: DrawPathData): TextDraw {
        let paint = Paint.fromJSON(data.paint);
        let td = new TextDraw(paint, data.text, data.x, data.y, data.fontSize, data.fontWeight as FontWeight, data.fontStyle as FontStyle);
        td.offsetX = data.offsetX;
        td.offsetY = data.offsetY;
        td.rotation = data.rotation;
        return td;
    }
}
