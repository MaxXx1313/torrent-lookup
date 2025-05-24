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

    getTargets(): Observable<ScanOptions['targets']> {
        return this._options.pipe(
            map(v => v.targets),
        );
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
