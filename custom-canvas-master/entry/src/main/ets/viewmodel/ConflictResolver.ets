import DrawInvoker from './DrawInvoker';
import { DrawPathData } from './IDraw';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG = 'ConflictResolver';
const DOMAIN = 0x0000;

export class OperationRecord {
  opId: string = '';
  opType: string = '';
  index: number = -1;
  dataJson: string = '';
  timestamp: number = 0;
  deviceId: string = '';
  applied: boolean = false;
}

export class ConflictRecord {
  localOp: OperationRecord = new OperationRecord();
  remoteOp: OperationRecord = new OperationRecord();
  resolved: boolean = false;
  resolution: string = '';
}

export default class ConflictResolver {
  private operationLog: OperationRecord[] = [];
  private pendingConflicts: ConflictRecord[] = [];
  private onConflict: ((conflict: ConflictRecord) => void) | null = null;
  private localDeviceId: string = '';
  private opCounter: number = 0;

  init(localDeviceId: string, onConflict: (conflict: ConflictRecord) => void): void {
    this.localDeviceId = localDeviceId;
    this.onConflict = onConflict;
  }

  recordOperation(opType: string, index: number, dataJson: string): OperationRecord {
    let op = new OperationRecord();
    op.opId = `${this.localDeviceId}_${this.opCounter++}`;
    op.opType = opType;
    op.index = index;
    op.dataJson = dataJson;
    op.timestamp = Date.now();
    op.deviceId = this.localDeviceId;
    op.applied = true;
    this.operationLog.push(op);
    if (this.operationLog.length > 1000) {
      this.operationLog = this.operationLog.slice(-500);
    }
    return op;
  }

  transformRemoteOp(remoteOp: OperationRecord): OperationRecord {
    let concurrentLocalOps = this.operationLog.filter((op: OperationRecord) => {
      return op.deviceId === this.localDeviceId &&
        Math.abs(op.timestamp - remoteOp.timestamp) < 5000 &&
        op.opType !== 'clear';
    });

    if (concurrentLocalOps.length === 0) {
      remoteOp.applied = true;
      return remoteOp;
    }

    let hasConflict = concurrentLocalOps.some((localOp: OperationRecord) => {
      return this.isConflicting(localOp, remoteOp);
    });

    if (hasConflict) {
      let adjustedIndex = remoteOp.index;
      for (let i = 0; i < concurrentLocalOps.length; i++) {
        let localOp = concurrentLocalOps[i];
        if (localOp.opType === 'add' && localOp.index <= adjustedIndex) {
          adjustedIndex++;
        } else if (localOp.opType === 'delete' && localOp.index < adjustedIndex) {
          adjustedIndex--;
        }
      }
      remoteOp.index = Math.max(0, adjustedIndex);

      if (this.onConflict) {
        let conflict = new ConflictRecord();
        conflict.localOp = concurrentLocalOps[concurrentLocalOps.length - 1];
        conflict.remoteOp = remoteOp;
        this.pendingConflicts.push(conflict);
        this.onConflict(conflict);
      }
    }

    remoteOp.applied = true;
    this.operationLog.push(remoteOp);
    return remoteOp;
  }

  resolveConflict(conflictIndex: number, resolution: string): void {
    if (conflictIndex >= 0 && conflictIndex < this.pendingConflicts.length) {
      this.pendingConflicts[conflictIndex].resolved = true;
      this.pendingConflicts[conflictIndex].resolution = resolution;
    }
  }

  getPendingConflicts(): ConflictRecord[] {
    return this.pendingConflicts.filter((c: ConflictRecord) => !c.resolved);
  }

  private isConflicting(localOp: OperationRecord, remoteOp: OperationRecord): boolean {
    if (localOp.opType === 'clear' || remoteOp.opType === 'clear') {
      return true;
    }
    if (localOp.index === remoteOp.index) {
      return true;
    }
    if ((localOp.opType === 'add' || localOp.opType === 'delete') &&
      (remoteOp.opType === 'add' || remoteOp.opType === 'delete')) {
      let minLocal = Math.min(localOp.index, localOp.index + (localOp.opType === 'add' ? 1 : 0));
      let minRemote = Math.min(remoteOp.index, remoteOp.index + (remoteOp.opType === 'add' ? 1 : 0));
      if (Math.abs(minLocal - minRemote) <= 1) {
        return true;
      }
    }
    return false;
  }
}
