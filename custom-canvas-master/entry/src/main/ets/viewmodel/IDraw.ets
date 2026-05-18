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

import Paint from './Paint';
import { FountainPenPoint } from './IBrush';

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
  public isFountainPen: boolean = false;
  public fountainPenPoints: FountainPenPoint[] = [];

  constructor(paint: Paint, path: Path2D) {
    this.paint = paint;
    this.path = path;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.isFountainPen && this.fountainPenPoints.length > 1) {
      this.drawFountainPen(context);
    } else {
      context.lineWidth = this.paint.lineWidth;
      context.strokeStyle = this.paint.StrokeStyle;
      context.globalAlpha = this.paint.globalAlpha;
      context.lineCap = 'round';
      context.stroke(this.path);
    }
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
  public startAngle: number = 0;
  public endAngle: number = 2 * Math.PI;

  constructor(paint: Paint, shapeType: string, startX: number, startY: number, endX: number, endY: number,
    startAngle?: number, endAngle?: number) {
    super(paint, new Path2D());
    this.shapeType = shapeType;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.isFountainPen = false;
    this.fountainPenPoints = [];
    if (startAngle !== undefined) {
      this.startAngle = startAngle;
    }
    if (endAngle !== undefined) {
      this.endAngle = endAngle;
    }
  }

  draw(context: CanvasRenderingContext2D): void {
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
    } else if (this.shapeType === 'circle') {
      let dx = this.endX - this.startX;
      let dy = this.endY - this.startY;
      let radius = Math.sqrt(dx * dx + dy * dy);
      context.beginPath();
      context.arc(this.startX, this.startY, radius, this.startAngle, this.endAngle);
      context.stroke();
    } else if (this.shapeType === 'rect') {
      let x = Math.min(this.startX, this.endX);
      let y = Math.min(this.startY, this.endY);
      let w = Math.abs(this.endX - this.startX);
      let h = Math.abs(this.endY - this.startY);
      context.beginPath();
      context.rect(x, y, w, h);
      context.stroke();
    }
  }
}