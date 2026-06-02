import distributedDataObject from '@ohos.data.distributedDataObject';
import DrawPath, { ShapeDraw, TextDraw, DrawPathData,
  TouchPointData, FountainPenPointData } from './IDraw';
import DrawInvoker from './DrawInvoker';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { Context } from '@kit.AbilityKit';

export class CanvasChangeData {
  opType: string = '';
  index: number = -1;
  drawDataJson: string = '';
  timestamp: number = 0;
}

export class DistributedCanvasState {
  sessionId: string = '';
  changeOpType: string = '';
  changeIndex: number = -1;
  changeDrawDataJson: string = '';
  changeTimestamp: number = 0;
  syncStatus: string = 'offline';
  remoteDeviceCount: number = 0;
}

const TAG = 'DistributedCanvas';
const DOMAIN = 0x0000;

export default class DistributedCanvas {
  private distributedObject: distributedDataObject.DataObject | null = null;
  private state: DistributedCanvasState = new DistributedCanvasState();
  private drawInvoker: DrawInvoker | null = null;
  private onRemoteChange: (() => void) | null = null;
  private lastLocalTimestamp: number = 0;

  private context: Context | null = null;

  init(context: Context, drawInvoker: DrawInvoker, onRemoteChange: () => void): void {
    this.context = context;
    this.drawInvoker = drawInvoker;
    this.onRemoteChange = onRemoteChange;
    try {
      this.distributedObject = distributedDataObject.create(context, this.state);
      hilog.info(DOMAIN, TAG, 'Distributed data object created');
    } catch (error) {
      hilog.error(DOMAIN, TAG, 'Failed to create distributed object: %{public}s', JSON.stringify(error) ?? '');
    }
  }

  setSessionId(sessionId: string): void {
    if (!this.distributedObject) {
      hilog.warn(DOMAIN, TAG, 'Distributed object not initialized');
      return;
    }
    try {
      this.distributedObject.setSessionId(sessionId);
      this.state.sessionId = sessionId;
      this.state.syncStatus = sessionId.length > 0 ? 'syncing' : 'offline';
      hilog.info(DOMAIN, TAG, 'Session set: %{public}s', sessionId);
    } catch (error) {
      hilog.error(DOMAIN, TAG, 'Failed to set session: %{public}s', JSON.stringify(error) ?? '');
    }
  }

  startListening(): void {
    if (!this.distributedObject) {
      return;
    }
    try {
      this.distributedObject.on('change', this.onChange.bind(this));
      this.distributedObject.on('status', this.onStatus.bind(this));
      hilog.info(DOMAIN, TAG, 'Started listening for distributed changes');
    } catch (error) {
      hilog.error(DOMAIN, TAG, 'Failed to start listening: %{public}s', JSON.stringify(error) ?? '');
    }
  }

  stopListening(): void {
    if (!this.distributedObject) {
      return;
    }
    try {
      this.distributedObject.off('change');
      this.distributedObject.off('status');
      hilog.info(DOMAIN, TAG, 'Stopped listening');
    } catch (error) {
      hilog.error(DOMAIN, TAG, 'Failed to stop listening: %{public}s', JSON.stringify(error) ?? '');
    }
  }

  publishAdd(drawPath: DrawPath): void {
    this.publishChange('add', -1, drawPath.toJSON());
  }

  publishDelete(index: number): void {
    this.publishChange('delete', index, new DrawPathData());
  }

  publishMove(index: number, drawPath: DrawPath): void {
    this.publishChange('move', index, drawPath.toJSON());
  }

  publishRotate(index: number, drawPath: DrawPath): void {
    this.publishChange('rotate', index, drawPath.toJSON());
  }

  publishClear(): void {
    this.publishChange('clear', -1, new DrawPathData());
  }

  getSyncStatus(): string {
    return this.state.syncStatus;
  }

  getRemoteDeviceCount(): number {
    return this.state.remoteDeviceCount;
  }

  private publishChange(opType: string, index: number, data: DrawPathData): void {
    if (!this.distributedObject || this.state.sessionId.length === 0) {
      return;
    }
    let timestamp = Date.now();
    this.lastLocalTimestamp = timestamp;
    try {
      this.state.changeOpType = opType;
      this.state.changeIndex = index;
      this.state.changeDrawDataJson = JSON.stringify(data);
      this.state.changeTimestamp = timestamp;
      hilog.info(DOMAIN, TAG, 'Published change: %{public}s at index %{public}d', opType, index);
    } catch (error) {
      hilog.error(DOMAIN, TAG, 'Failed to publish change: %{public}s', JSON.stringify(error) ?? '');
    }
  }

  private onChange(sessionId: string, fields: Array<string>): void {
    if (sessionId !== this.state.sessionId) {
      return;
    }
    if (this.state.changeTimestamp <= this.lastLocalTimestamp) {
      return;
    }
    if (!this.drawInvoker || !this.onRemoteChange) {
      return;
    }
    hilog.info(DOMAIN, TAG, 'Remote change received: %{public}s', this.state.changeOpType);
    try {
      let opType = this.state.changeOpType;
      let index = this.state.changeIndex;
      let dataJson = this.state.changeDrawDataJson;

      if (opType === 'add') {
        let data = this.parseDrawPathData(dataJson);
        if (data) {
          let dp = this.createDrawPathFromData(data);
          if (dp) {
            this.drawInvoker.add(dp);
          }
        }
      } else if (opType === 'delete') {
        this.drawInvoker.removeAt(index);
      } else if (opType === 'move' || opType === 'rotate') {
        let data = this.parseDrawPathData(dataJson);
        if (data) {
          let dp = this.createDrawPathFromData(data);
          if (dp && index >= 0 && index < this.drawInvoker.getCount()) {
            let existing = this.drawInvoker.getAt(index);
            if (existing) {
              existing.offsetX = dp.offsetX;
              existing.offsetY = dp.offsetY;
              existing.rotation = dp.rotation;
            }
          }
        }
      } else if (opType === 'clear') {
        this.drawInvoker.clear();
      }

      this.onRemoteChange();
    } catch (error) {
      hilog.error(DOMAIN, TAG, 'Failed to apply remote change: %{public}s', JSON.stringify(error) ?? '');
    }
  }

  private onStatus(sessionId: string, networkId: string, status: string): void {
    hilog.info(DOMAIN, TAG, 'Status change: session=%{public}s network=%{public}s status=%{public}s',
      sessionId, networkId, status);
    if (status === 'online') {
      this.state.remoteDeviceCount++;
      this.state.syncStatus = 'synced';
    } else if (status === 'offline') {
      this.state.remoteDeviceCount = Math.max(0, this.state.remoteDeviceCount - 1);
      if (this.state.remoteDeviceCount === 0) {
        this.state.syncStatus = 'offline';
      }
    }
  }

  private parseDrawPathData(json: string): DrawPathData | null {
    try {
      let raw = JSON.parse(json) as Record<string, Object>;
      let data = new DrawPathData();
      let p = raw['paint'] as Record<string, Object>;
      data.type = (raw['type'] as string) ?? 'drawpath';
      data.paint.lineWidth = p['lineWidth'] as number;
      data.paint.strokeStyle = p['strokeStyle'] as string;
      data.paint.globalAlpha = p['globalAlpha'] as number;
      data.paint.isEraser = (p['isEraser'] as boolean) ?? false;
      data.offsetX = raw['offsetX'] as number;
      data.offsetY = raw['offsetY'] as number;
      data.rotation = raw['rotation'] as number;
      data.shapeType = (raw['shapeType'] as string) ?? '';
      data.startX = raw['startX'] as number;
      data.startY = raw['startY'] as number;
      data.endX = raw['endX'] as number;
      data.endY = raw['endY'] as number;
      data.text = (raw['text'] as string) ?? '';
      data.x = raw['x'] as number;
      data.y = raw['y'] as number;
      data.fontSize = raw['fontSize'] as number;
      data.fontWeight = raw['fontWeight'] as number;
      data.fontStyle = raw['fontStyle'] as number;
      data.isFountainPen = raw['isFountainPen'] as boolean;
      let ptsArr = raw['touchPoints'] as Array<Record<string, Object>>;
      if (ptsArr) {
        for (let j = 0; j < ptsArr.length; j++) {
          let pt = ptsArr[j];
          let tpd = new TouchPointData();
          tpd.x = pt['x'] as number;
          tpd.y = pt['y'] as number;
          data.touchPoints.push(tpd);
        }
      }
      let fpArr = raw['fountainPenPoints'] as Array<Record<string, Object>>;
      if (fpArr) {
        for (let j = 0; j < fpArr.length; j++) {
          let fpd = new FountainPenPointData();
          let fp = fpArr[j];
          fpd.x = fp['x'] as number;
          fpd.y = fp['y'] as number;
          fpd.velocity = fp['velocity'] as number;
          data.fountainPenPoints.push(fpd);
        }
      }
      return data;
    } catch (error) {
      hilog.error(DOMAIN, TAG, 'Failed to parse DrawPathData: %{public}s', JSON.stringify(error) ?? '');
      return null;
    }
  }

  private createDrawPathFromData(data: DrawPathData): DrawPath | null {
    try {
      if (data.type === 'shapedraw') {
        return ShapeDraw.fromJSON(data);
      } else if (data.type === 'textdraw') {
        return TextDraw.fromJSON(data);
      } else {
        return DrawPath.fromJSON(data);
      }
    } catch (error) {
      hilog.error(DOMAIN, TAG, 'Failed to create DrawPath from data: %{public}s', JSON.stringify(error) ?? '');
      return null;
    }
  }
}
