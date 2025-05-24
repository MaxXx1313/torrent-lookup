import { BehaviorSubject, Observable, shareReplay } from 'rxjs';


export interface ScanOptions {
    targets: string[];
}


export const DATA_SERVICE_KEY = Symbol();

/**
 *
 */
export class DataService {

    private _targets = new BehaviorSubject<ScanOptions['targets']>([
        '~'
    ]);

    readonly isScanning$ = new Observable(observer => {
        return window.electronAPI.onScanStatus(isRunning => {
            observer.next(isRunning);
        });
    }).pipe(shareReplay(1));

    readonly scanTarget$ = new Observable<string>((observer) => {
        return window.electronAPI.onScanProgress((filepath) => {
            observer.next(filepath);
        });
    }).pipe(shareReplay(1));


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

    startScan() {
        const targets = this._targets.getValue();
        window.electronAPI.scan({targets});
    }

    stopScan() {
        return window.electronAPI.stopScan();
    }

}
