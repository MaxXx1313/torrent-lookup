import { Subject } from "rxjs";
import { nexTickPromise } from "./utils/tools";

/**
 * Created by maksim on 01/12/16.
 */

declare const Promise: any;

/**
 * @template T
 */
export class QueueWorker<T> {

    public readonly onStart: Subject<void> = new Subject();
    public readonly onStop: Subject<void> = new Subject();

    public readonly onJob: Subject<T> = new Subject();

    /**
     * @type {Array<T>}
     */
    private _queue: T[] = [];

    /**
     * @type {function}
     */
    private _worker: Function;


    /**
     */
    constructor(worker: Function = null) {
        this._worker = worker;
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
     * @private
     */
    protected async _digest() {
        this.onStart.next();

        while (true) {
            await nexTickPromise();

            const job = this._queue.shift();
            if (job) {
                await this.runJob(job);
            } else {
                this.onStop.next();
                break;
            }
        }
    }


    /**
     * @param {T} job
     */
    protected runJob(job: T): Promise<any> {
        this.onJob.next(job);

        return Promise.resolve()
            .then(() => {
                return this._worker(job);
            });
    }

} // -