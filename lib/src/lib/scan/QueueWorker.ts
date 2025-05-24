import { Subject, take } from "rxjs";
import { nexTickPromise } from "../utils/tools.js";

export type JobWorkerFn<T, R> = (job: T) => R | Promise<R>;

/**
 * @template T
 */
export class QueueWorker<T, R = any> {

    public readonly onStart: Subject<void> = new Subject();
    public readonly onStop: Subject<Error | null> = new Subject();

    public readonly onJob: Subject<T> = new Subject();

    /**
     * @type {Array<T>}
     */
    private _queue: T[] = [];

    private _isRunning = false;
    private _terminateFlag = false;

    /**
     */
    constructor(
        private worker: JobWorkerFn<T, R> = null,
        private opts?: {
            autostart?: boolean,
            stopOnError?: boolean,
        }) {
    }

    /**
     * @param {T} jobItem
     * @param {boolean} prepend
     */
    addJob(jobItem: T, prepend: boolean = false): void {
        if (!prepend) {
            this._queue.push(jobItem);
        } else {
            this._queue.unshift(jobItem);
        }
        if (this.opts.autostart) {
            this._digest();
        }
    }

    /**
     * @param {Array<T>} jobItems
     * @param {boolean} prepend
     */
    addJobs(jobItems: T[], prepend: boolean = false): void {
        if (!prepend) {
            this._queue.push.apply(this._queue, jobItems);
        } else {
            this._queue.unshift.apply(this._queue, jobItems);
        }
        if (this.opts.autostart) {
            this._digest();
        }
    }

    /**
     *
     */
    run(): Promise<void> {
        if (this._queue.length === 0) {
            console.warn('QueueWorker: empty queue');
        }
        this._digest();
        return this.onStop.pipe(take(1)).toPromise().then(e => {
            if (e) {
                return Promise.reject(e);
            } else {
                return Promise.resolve();
            }
        });
    }

    /**
     *
     */
    terminate() {
        this._terminateFlag = true;
    }

    /**
     *
     */
    isRunning(): boolean {
        return this._isRunning;
    }

    /**
     * @private
     */
    protected _digest(): void {
        if (this._isRunning === true) {
            return;
        }
        this._isRunning = true;

        nexTickPromise().then(async () => {
            this.onStart.next();
            while (true) {
                await nexTickPromise();

                if (this._terminateFlag) {
                    this._terminate();
                    return;
                }

                const job = this._queue.shift();
                if (job) {
                    this.onJob.next(job);

                    await this._runJob(job).catch(e => {
                        console.error(e);
                        if (this.opts.stopOnError) {
                            this._terminate(e);
                            throw e;
                        } else {
                            return null;
                        }
                    });
                } else {
                    this._terminate();
                    break;
                }
            }
        });
    }

    /**
     * @protected
     */
    protected _terminate(e?: Error) {
        this._isRunning = false;
        this._terminateFlag = false;
        this._queue.length = 0;
        this.onStop.next(e || null);
    }


    /**
     * @param {T} job
     */
    protected _runJob(job: T): Promise<R | null> {
        return Promise.resolve()
            .then(() => {
                return this.worker(job);
            });
    }

} // -
