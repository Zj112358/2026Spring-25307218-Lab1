import fs from "@ohos:file.fs";
import type { Context } from "@ohos:abilityAccessCtrl";
import hilog from "@ohos:hilog";
import util from "@ohos:util";
import type DrawInvoker from './DrawInvoker';
const TAG = 'DistributedFileManager';
const DOMAIN = 0x0000;
const CANVAS_FILE_DIR = 'canvas_files';
const EXPORT_DIR = 'exports';
export class ExportFormat {
    static PNG: string = 'png';
    static SVG: string = 'svg';
    static PDF: string = 'pdf';
    static JSON: string = 'json';
}
export class SavedFileInfo {
    fileName: string = '';
    filePath: string = '';
    fileSize: number = 0;
    timestamp: number = 0;
    format: string = '';
}
export default class DistributedFileManager {
    private context: Context | null = null;
    private canvasFileDir: string = '';
    private exportDir: string = '';
    init(context: Context): void {
        this.context = context;
        try {
            let filesDir = context.filesDir;
            this.canvasFileDir = `${filesDir}/${CANVAS_FILE_DIR}`;
            this.exportDir = `${filesDir}/${EXPORT_DIR}`;
            if (!fs.accessSync(this.canvasFileDir)) {
                fs.mkdirSync(this.canvasFileDir, true);
            }
            if (!fs.accessSync(this.exportDir)) {
                fs.mkdirSync(this.exportDir, true);
            }
            hilog.info(DOMAIN, TAG, 'DistributedFileManager initialized');
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to init: %{public}s', JSON.stringify(error) ?? '');
        }
    }
    saveCanvas(drawInvoker: DrawInvoker, fileName: string = ''): SavedFileInfo {
        let info = new SavedFileInfo();
        if (!this.context) {
            return info;
        }
        if (fileName.length === 0) {
            let ts = Date.now();
            fileName = `canvas_${ts}.json`;
        }
        if (!fileName.endsWith('.json')) {
            fileName = `${fileName}.json`;
        }
        let filePath = `${this.canvasFileDir}/${fileName}`;
        try {
            let data = drawInvoker.serializeAll();
            this.writeTextFile(filePath, data);
            let stat = fs.statSync(filePath);
            info.fileName = fileName;
            info.filePath = filePath;
            info.fileSize = stat.size;
            info.timestamp = Date.now();
            info.format = ExportFormat.JSON;
            hilog.info(DOMAIN, TAG, 'Canvas saved: %{public}s', filePath);
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to save canvas: %{public}s', JSON.stringify(error) ?? '');
        }
        return info;
    }
    loadCanvas(drawInvoker: DrawInvoker, filePath: string): boolean {
        try {
            let data = this.readTextFile(filePath);
            drawInvoker.deserializeAll(data);
            hilog.info(DOMAIN, TAG, 'Canvas loaded: %{public}s', filePath);
            return true;
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to load canvas: %{public}s', JSON.stringify(error) ?? '');
            return false;
        }
    }
    listSavedFiles(): SavedFileInfo[] {
        let result: SavedFileInfo[] = [];
        try {
            let entries = fs.listFileSync(this.canvasFileDir);
            for (let i = 0; i < entries.length; i++) {
                let entry = entries[i];
                let fullPath = `${this.canvasFileDir}/${entry}`;
                try {
                    let stat = fs.statSync(fullPath);
                    let info = new SavedFileInfo();
                    info.fileName = entry;
                    info.filePath = fullPath;
                    info.fileSize = stat.size;
                    info.timestamp = stat.mtime * 1000;
                    info.format = ExportFormat.JSON;
                    result.push(info);
                }
                catch (e) {
                    continue;
                }
            }
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to list files: %{public}s', JSON.stringify(error) ?? '');
        }
        return result;
    }
    exportToSvg(drawInvoker: DrawInvoker, fileName: string): SavedFileInfo {
        let info = new SavedFileInfo();
        if (!fileName.endsWith('.svg')) {
            fileName = `${fileName}.svg`;
        }
        let filePath = `${this.exportDir}/${fileName}`;
        try {
            let json = drawInvoker.serializeAll();
            let svgContent = this.jsonToSvg(json);
            this.writeTextFile(filePath, svgContent);
            let stat = fs.statSync(filePath);
            info.fileName = fileName;
            info.filePath = filePath;
            info.fileSize = stat.size;
            info.timestamp = Date.now();
            info.format = ExportFormat.SVG;
            hilog.info(DOMAIN, TAG, 'Exported SVG: %{public}s', filePath);
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to export SVG: %{public}s', JSON.stringify(error) ?? '');
        }
        return info;
    }
    deleteFile(filePath: string): boolean {
        try {
            fs.unlinkSync(filePath);
            hilog.info(DOMAIN, TAG, 'File deleted: %{public}s', filePath);
            return true;
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to delete file: %{public}s', JSON.stringify(error) ?? '');
            return false;
        }
    }
    private writeTextFile(filePath: string, text: string): void {
        let file = fs.openSync(filePath, fs.OpenMode.CREATE | fs.OpenMode.TRUNC | fs.OpenMode.WRITE_ONLY);
        let encoder = new util.TextEncoder();
        let encoded = encoder.encodeInto(text);
        let buffer = new ArrayBuffer(encoded.length);
        let view = new Uint8Array(buffer);
        view.set(encoded, 0);
        fs.writeSync(file.fd, buffer);
        fs.closeSync(file);
    }
    private readTextFile(filePath: string): string {
        let file = fs.openSync(filePath, fs.OpenMode.READ_ONLY);
        let stat = fs.statSync(filePath);
        let buffer = new ArrayBuffer(stat.size);
        fs.readSync(file.fd, buffer);
        fs.closeSync(file);
        let decoder = util.TextDecoder.create('utf-8');
        let result = decoder.decodeToString(new Uint8Array(buffer));
        return result;
    }
    private jsonToSvg(json: string): string {
        let items = JSON.parse(json) as Array<Record<string, Object>>;
        let paths = '';
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let type = item['type'] as string;
            let p = item['paint'] as Record<string, Object>;
            let stroke = p['strokeStyle'] as string;
            let width = p['lineWidth'] as number;
            let opacity = p['globalAlpha'] as number;
            let ox = item['offsetX'] as number;
            let oy = item['offsetY'] as number;
            let transform = '';
            if (ox !== 0 || oy !== 0) {
                transform = ` transform="translate(${ox},${oy})"`;
            }
            if (type === 'drawpath') {
                let pts = item['touchPoints'] as Array<Record<string, Object>>;
                if (pts.length > 0) {
                    let d = `M${pts[0]['x']},${pts[0]['y']}`;
                    for (let j = 1; j < pts.length; j++) {
                        d += ` L${pts[j]['x']},${pts[j]['y']}`;
                    }
                    paths += `  <path d="${d}" stroke="${stroke}" stroke-width="${width}" fill="none" opacity="${opacity}"${transform}/>\n`;
                }
            }
            else if (type === 'shapedraw') {
                let shapeType = item['shapeType'] as string;
                let sx = item['startX'] as number;
                let sy = item['startY'] as number;
                let ex = item['endX'] as number;
                let ey = item['endY'] as number;
                if (shapeType === 'rect') {
                    let x = Math.min(sx, ex);
                    let y = Math.min(sy, ey);
                    let w = Math.abs(ex - sx);
                    let h = Math.abs(ey - sy);
                    paths += `  <rect x="${x}" y="${y}" width="${w}" height="${h}" stroke="${stroke}" stroke-width="${width}" fill="none" opacity="${opacity}"${transform}/>\n`;
                }
                else if (shapeType === 'circle') {
                    let cx = (sx + ex) / 2;
                    let cy = (sy + ey) / 2;
                    let r = Math.min(Math.abs(ex - sx), Math.abs(ey - sy)) / 2;
                    paths += `  <circle cx="${cx}" cy="${cy}" r="${r}" stroke="${stroke}" stroke-width="${width}" fill="none" opacity="${opacity}"${transform}/>\n`;
                }
                else if (shapeType === 'line') {
                    paths += `  <line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}"${transform}/>\n`;
                }
                else if (shapeType === 'ellipse') {
                    let cx = (sx + ex) / 2;
                    let cy = (sy + ey) / 2;
                    let rx = Math.abs(ex - sx) / 2;
                    let ry = Math.abs(ey - sy) / 2;
                    paths += `  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" stroke="${stroke}" stroke-width="${width}" fill="none" opacity="${opacity}"${transform}/>\n`;
                }
            }
            else if (type === 'textdraw') {
                let text = item['text'] as string;
                let x = item['x'] as number;
                let y = item['y'] as number;
                let fontSize = item['fontSize'] as number;
                paths += `  <text x="${x}" y="${y}" fill="${stroke}" font-size="${fontSize * 2.5}" opacity="${opacity}"${transform}>${text}</text>\n`;
            }
        }
        return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">\n${paths}</svg>`;
    }
}
