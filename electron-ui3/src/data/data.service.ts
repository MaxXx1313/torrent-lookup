import { BehaviorSubject, Observable } from 'rxjs';


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

    readonly isScanning$ = new BehaviorSubject(false);

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

    startScan(): Observable<string> {
        const targets = this._targets.getValue();
        window.electronAPI.scan({targets});

        return new Observable<string>((observer) => {
            window.electronAPI.onScanProgress((filepath) => {
                observer.next(filepath);
            })
        });
    }
}
