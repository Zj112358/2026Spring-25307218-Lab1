import type Paint from './Paint';
export interface IDraw {
    /**
     * Drawing commands.
     */
    draw(context: CanvasRenderingContext2D): void;
}
/**
 * Drawn path.
 */
export default class DrawPath implements IDraw {
    public paint: Paint;
    public path: Path2D;
    constructor(paint: Paint, path: Path2D) {
        this.paint = paint;
        this.path = path;
    }
    draw(context: CanvasRenderingContext2D): void {
        context.lineWidth = this.paint.lineWidth;
        context.strokeStyle = this.paint.StrokeStyle;
        context.globalAlpha = this.paint.globalAlpha;
        context.lineCap = 'round';
        context.stroke(this.path);
    }
}
