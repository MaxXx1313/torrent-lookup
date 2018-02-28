/**
 * Created by maksim on 01/12/16.
 */

import { Subject } from 'rxjs'
declare const Promise: any;

/**
 *
 */
export class ScheduleWorker<JobItemType> {

  public readonly onActivate: Subject<void> = new Subject();
  public readonly onIdle: Subject<void> = new Subject();

  public readonly onJob: Subject<JobItemType> = new Subject();

  /**
   * @type {Array<T>}
   */
  private _queue: JobItemType[];

  /**
   * @type {function}
   */
  private _worker: Function;

  /**
   * @type {function}
   */
  private _errorHandler: Function;

  /**
   *
   */
  private _currentJob: JobItemType;

  /**
   *
   */
  private _isIdle = false;

  /**
   */
  constructor(worker: Function = null, errorHandler: Function = null) {
    this._worker = worker;
    this._errorHandler = errorHandler;
  }

  /**
   * Set schedule worker
   * @param worker
   */
  setWorker(worker: Function){
    this._worker = worker;
  }

  /**
   * Set schedule errorHandler
   * @param worker
   */
  setErrorHandler(errorHandler: Function){
    this._errorHandler = errorHandler;
  }

  /**
   * @param {JobItemType} jobItem
   * @param {boolean} prepend
   */
  addJob(jobItem: JobItemType, prepend: boolean = false): void {
    if (!prepend) {
      this._queue.push(jobItem);
    } else {
      this._queue.unshift(jobItem);
    }
    this._digest();
  }

  /**
   * @param {Array<JobItemType>} jobItems
   * @param {boolean} prepend
   */
  addJobs(jobItems: JobItemType[], prepend: boolean = false): void {
    if (!prepend) {
      this._queue.push.apply(this._queue, jobItems);
    } else{
      this._queue.unshift.apply(this._queue, jobItems);
    }
    this._digest();
  }

  /**
   * @return {boolean}
   */
  isActive(): boolean {
    return !!this._currentJob;
  }



  /**
   * @private
   */
  protected _digest() {

    if (this._currentJob) {
      // already diegesting
      return;
    }

    process.nextTick(() => {

      this._currentJob = this._queue.shift();
      if (this._currentJob) {
        this._activate();

        this.runJob(this._currentJob)
          .catch(error => {
            if ( this._errorHandler ){
              // don't log when has error listener
              return this._errorHandler(error, this._currentJob);
            }
            // if this error is not caught, it breaks the system?
            throw error;
          })
          .then(() => { this._currentJob = null; })
          .then(this._digest.bind(this))
          // .catch(error => {
          //   console.error(error, error.message, error.stack);
          // });
      } else {
        this._idle();
      }
    });
    return;
  }

  /**
   */
  private _activate(): void {
      if(this._isIdle) {
        this.onActivate.next();
      }
      this._isIdle = false;
  }

  /**
   */
  private _idle(): void {
    if (!this._isIdle) {
      this._isIdle = true;
      this.onIdle.next();
    }
  }

  /**
   * @param {JobItemType} job
   */
  protected runJob(job: JobItemType): Promise<any> {
    this.onJob.next(job);

    return Promise.resolve()
      .then(() => {
        return this._worker(job);
      });
  }

}