import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG = 'RemoteCursorManager';
const DOMAIN = 0x0000;
const CURSOR_COLORS: string[] = [
  '#FF4444', '#44FF44', '#4444FF', '#FFAA00', '#FF44FF',
  '#44FFFF', '#FF8844', '#88FF44', '#4488FF', '#FF4488'
];

export class RemoteCursorData {
  deviceId: string = '';
  deviceName: string = '';
  x: number = 0;
  y: number = 0;
  color: string = '#FF4444';
  lastActiveTime: number = 0;
}

export default class RemoteCursorManager {
  private cursors: Map<string, RemoteCursorData> = new Map();
  private onCursorsChange: (() => void) | null = null;
  private localDeviceId: string = '';

  init(localDeviceId: string, onCursorsChange: () => void): void {
    this.localDeviceId = localDeviceId;
    this.onCursorsChange = onCursorsChange;
    hilog.info(DOMAIN, TAG, 'RemoteCursorManager initialized');
  }

  updateCursor(deviceId: string, deviceName: string, x: number, y: number): void {
    if (deviceId === this.localDeviceId) {
      return;
    }
    let cursor = this.cursors.get(deviceId);
    if (!cursor) {
      cursor = new RemoteCursorData();
      cursor.deviceId = deviceId;
      cursor.deviceName = deviceName;
      cursor.color = this.assignColor(deviceId);
      this.cursors.set(deviceId, cursor);
    }
    cursor.x = x;
    cursor.y = y;
    cursor.lastActiveTime = Date.now();
    if (this.onCursorsChange) {
      this.onCursorsChange();
    }
  }

  removeCursor(deviceId: string): void {
    this.cursors.delete(deviceId);
    if (this.onCursorsChange) {
      this.onCursorsChange();
    }
  }

  getAllCursors(): RemoteCursorData[] {
    let result: RemoteCursorData[] = [];
    this.cursors.forEach((cursor: RemoteCursorData) => {
      result.push(cursor);
    });
    return result;
  }

  clearStaleCursors(timeoutMs: number = 30000): void {
    let now = Date.now();
    let keysToDelete: string[] = [];
    this.cursors.forEach((cursor: RemoteCursorData, key: string) => {
      if (now - cursor.lastActiveTime > timeoutMs) {
        keysToDelete.push(key);
      }
    });
    for (let i = 0; i < keysToDelete.length; i++) {
      this.cursors.delete(keysToDelete[i]);
    }
    if (keysToDelete.length > 0 && this.onCursorsChange) {
      this.onCursorsChange();
    }
  }

  private assignColor(deviceId: string): string {
    let hash = 0;
    for (let i = 0; i < deviceId.length; i++) {
      hash = ((hash << 5) - hash) + deviceId.charCodeAt(i);
      hash = hash & hash;
    }
    let index = Math.abs(hash) % CURSOR_COLORS.length;
    return CURSOR_COLORS[index];
  }
}
