import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import type { AppConfiguration } from "@/data/types.ts";


export interface ScanOptions {
    targets: string[];
}


export const DATA_SERVICE_KEY = Symbol();

export type ScanStatus = 'idle' | 'scan' | 'analyze' | 'export';

/**
 *
 */
export class DataService {

    readonly status$ = new Observable<ScanStatus>(observer => {
        return window.electronAPI.onStatus(status => {
            observer.next(status);
        });
    }).pipe(shareReplay(1));
    readonly scanTarget$ = new Observable<string>((observer) => {
        return window.electronAPI.onScanProgress((filepath) => {
            observer.next(filepath);
        });
    }).pipe(shareReplay(1));
    readonly analyzeResults$ = new Observable<TorrentMapping[]>((observer) => {
        return window.electronAPI.onAnalyzeResults((data) => {
            observer.next(data);
        });
    }).pipe(shareReplay(1));
    readonly _scanFound: string[] = [];
    readonly scanFound$ = new BehaviorSubject<string[]>([]);
    private _targets = new BehaviorSubject<ScanOptions['targets']>([
        '~'
    ]);

    constructor() {
        window.electronAPI?.onScanFound(item => {
            this._scanFound.push(item);
            this.scanFound$.next(this._scanFound);
        });
    }

    appReady() {
        window.electronAPI?.appReady();
    }

    getTargets(): Observable<ScanOptions['targets']> {
        return this._targets;
    }


    addTarget() {
        return window.electronAPI.selectFolder().then(folder => {
            if (!folder) {
                return;
            }

            const targets = [...this._targets.getValue()];
            if (Array.isArray(folder)) {
                targets.push(...folder);
            } else {
                targets.push(folder);
            }
            this._targets.next(targets);
        });
    }

    deleteTarget(toDelete: string) {
        const targets = [...this._targets.getValue()];
        const idx = targets.indexOf(toDelete);
        if (idx > -1) {
            targets.splice(idx, 1);
        }
        this._targets.next(targets);
    }

    stopScan() {
        return window.electronAPI.stopScan();
    }


    // ui4
    getConfig() {
        return window.electronAPI.getConfig();
    }

    setConfig(config: AppConfiguration) {
        return window.electronAPI.setConfig(config);
    }

    getSystemExcluded() {
        return window.electronAPI.getSystemExcluded();
    }

    selectFolder() {
        return window.electronAPI.selectFolder();
    }


    startScan(config: AppConfiguration) {
        this._scanFound.length = 0;
        this.scanFound$.next(this._scanFound);

        window.electronAPI.scan({targets: config.targets, exclude: config.exclude});
    }

}

export interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
}
