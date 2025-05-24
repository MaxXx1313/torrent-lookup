import { BehaviorSubject, map, Observable } from 'rxjs';


export interface ScanOptions {
    targets: string[];
}


export const DATA_SERVICE_KEY = Symbol();

/**
 *
 */
export class DataService {

    private _options = new BehaviorSubject<ScanOptions>({
        targets: ['~'],
    });

    readonly isScanning$ = new BehaviorSubject(false);

    getTargets(): Observable<ScanOptions['targets']> {
        return this._options.pipe(
            map(v => v.targets),
        );
    }

    addTarget() {
        window.electronAPI.selectFolder().then(folder => {
            console.log('selectFolder', folder);
            if (!folder) {
                return;
            }

            const options = {...this._options.getValue()};
            if (Array.isArray(folder)) {
                options.targets.push(...folder);
            } else {
                options.targets.push(folder);
            }
            this._options.next(options);
        });
    }

    startScan(): Observable<string> {
        const options = this._options.getValue();
        window.electronAPI.scan(options);

        return new Observable<string>((observer) => {
            window.electronAPI.onScanProgress((filepath) => {
                observer.next(filepath);
            })
        });
    }
}
