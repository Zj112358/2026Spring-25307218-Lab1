import type DrawInvoker from './DrawInvoker';
import hilog from "@ohos:hilog";
const TAG = 'VersionHistory';
const DOMAIN = 0x0000;
const MAX_VERSIONS = 100;
export class VersionSnapshot {
    id: number = 0;
    timestamp: number = 0;
    label: string = '';
    dataJson: string = '';
    operationDesc: string = '';
}
export default class VersionHistory {
    private versions: VersionSnapshot[] = [];
    private currentVersionId: number = 0;
    private nextId: number = 1;
    private drawInvoker: DrawInvoker | null = null;
    private onVersionChange: (() => void) | null = null;
    init(drawInvoker: DrawInvoker, onVersionChange: () => void): void {
        this.drawInvoker = drawInvoker;
        this.onVersionChange = onVersionChange;
    }
    saveSnapshot(operationDesc: string = ''): VersionSnapshot {
        if (!this.drawInvoker) {
            let empty = new VersionSnapshot();
            return empty;
        }
        let snapshot = new VersionSnapshot();
        snapshot.id = this.nextId++;
        snapshot.timestamp = Date.now();
        snapshot.label = this.formatTime(snapshot.timestamp);
        snapshot.dataJson = this.drawInvoker.serializeAll();
        snapshot.operationDesc = operationDesc;
        this.versions.push(snapshot);
        this.currentVersionId = snapshot.id;
        if (this.versions.length > MAX_VERSIONS) {
            this.versions = this.versions.slice(-MAX_VERSIONS);
        }
        if (this.onVersionChange) {
            this.onVersionChange();
        }
        hilog.info(DOMAIN, TAG, 'Snapshot saved: id=%{public}d, desc=%{public}s', snapshot.id, operationDesc);
        return snapshot;
    }
    restoreToVersion(versionId: number): boolean {
        if (!this.drawInvoker) {
            return false;
        }
        for (let i = 0; i < this.versions.length; i++) {
            if (this.versions[i].id === versionId) {
                try {
                    this.drawInvoker.deserializeAll(this.versions[i].dataJson);
                    this.currentVersionId = versionId;
                    if (this.onVersionChange) {
                        this.onVersionChange();
                    }
                    hilog.info(DOMAIN, TAG, 'Restored to version: %{public}d', versionId);
                    return true;
                }
                catch (error) {
                    hilog.error(DOMAIN, TAG, 'Failed to restore version: %{public}s', JSON.stringify(error) ?? '');
                    return false;
                }
            }
        }
        return false;
    }
    getVersionList(): VersionSnapshot[] {
        return this.versions;
    }
    getCurrentVersionId(): number {
        return this.currentVersionId;
    }
    getVersionCount(): number {
        return this.versions.length;
    }
    canRestore(versionId: number): boolean {
        return this.versions.some((v: VersionSnapshot) => v.id === versionId);
    }
    getDiffBetween(versionId1: number, versionId2: number): VersionDiff {
        let diff = new VersionDiff();
        let v1: VersionSnapshot | null = null;
        let v2: VersionSnapshot | null = null;
        for (let i = 0; i < this.versions.length; i++) {
            if (this.versions[i].id === versionId1)
                v1 = this.versions[i];
            if (this.versions[i].id === versionId2)
                v2 = this.versions[i];
        }
        if (!v1 || !v2) {
            return diff;
        }
        diff.version1 = v1;
        diff.version2 = v2;
        try {
            let arr1 = JSON.parse(v1.dataJson) as Object[];
            let arr2 = JSON.parse(v2.dataJson) as Object[];
            diff.addedCount = Math.max(0, arr2.length - arr1.length);
            diff.removedCount = Math.max(0, arr1.length - arr2.length);
            diff.totalCountV1 = arr1.length;
            diff.totalCountV2 = arr2.length;
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to compute diff: %{public}s', JSON.stringify(error) ?? '');
        }
        return diff;
    }
    clearHistory(): void {
        this.versions = [];
        this.currentVersionId = 0;
        if (this.onVersionChange) {
            this.onVersionChange();
        }
    }
    private formatTime(timestamp: number): string {
        let date = new Date(timestamp);
        let h = date.getHours().toString().padStart(2, '0');
        let m = date.getMinutes().toString().padStart(2, '0');
        let s = date.getSeconds().toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
}
export class VersionDiff {
    version1: VersionSnapshot | null = null;
    version2: VersionSnapshot | null = null;
    addedCount: number = 0;
    removedCount: number = 0;
    totalCountV1: number = 0;
    totalCountV2: number = 0;
}
