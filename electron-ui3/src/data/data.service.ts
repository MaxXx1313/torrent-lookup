import { BehaviorSubject, map, Observable } from 'rxjs';


export interface ScanOptions {
    targets: string[];
}


const _options = new BehaviorSubject<ScanOptions>({
    targets: ['~'],
});

/**
 *
 */
export class DataService {


    static getTargets(): Observable<ScanOptions['targets']> {
        return _options.pipe(
            map(v => v.targets),
        );
    }
}
