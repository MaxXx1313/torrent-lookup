import { Subject } from "rxjs";
import { nexTickPromise } from "../utils/tools";

export type JobWorkerFn<T, R> = (job: T) => R | Promise<R>;

/**
 * @template T
 */
export class QueueWorker<T, R = any> {

    public readonly onStart: Subject<void> = new Subject();
    public readonly onStop: Subject<void> = new Subject();

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
    run(): Promise<any> {
        if (this._queue.length === 0) {
            console.warn('QueueWorker: empty queue');
        }
        return this._digest();
    }

    /**
     *
     */
    terminate() {
        this._terminateFlag = true;
    }

    /**
     * @private
     */
    protected async _digest() {
        if (this._isRunning === true) {
            return;
        }
        this._isRunning = true;

        this.onStart.next();

        while (true) {
            await nexTickPromise();

            if (this._terminateFlag) {
                this._terminate();
                return;
            }

            const job = this._queue.shift();
            if (job) {
                await this._runJob(job);
            } else {
                this._isRunning = false;
                this.onStop.next();
                break;
            }
        }
    }

    /**
     * @protected
     */
    protected _terminate() {
        this._isRunning = false;
        this._terminateFlag = false;
        this._queue.length = 0;
        this.onStop.next();
    }


    /**
     * @param {T} job
     */
    protected _runJob(job: T): Promise<R | null> {
        this.onJob.next(job);

        return Promise.resolve()
            .then(() => {
                return this.worker(job);
            }).catch(e => {
                if (this.opts.stopOnError) {
                    throw e;
                } else {
                    console.log(e);
                    return null;
                }
            });
    }

} // -
