/**
 * Created by maksim on 01/12/16.
 */

const EventEmitter = require('events');

/**
 * @typedef {*} T
 */

/**
 * @class
 * @extends EventEmitter
 * @mixes EventEmitter
 *
 * @emit ScheduleWorker#start   - when job is about starting
 * @emit ScheduleWorker#success - when job is finished
 * @emit ScheduleWorker#fail    - when job is failed
 *
 * @emit ScheduleWorker#activate    - when worker comes out from idle state
 * @emit ScheduleWorker#idle        - when all job is done, going to idle state
 */
class ScheduleWorker extends EventEmitter{

  /**
   * @param {function} [worker]
   */
  constructor(worker){
    super();

    /**
     * @type {Array<T>}
     * @private
     */
    this._queue = [];

    /**
     * @type {function}
     * @private
     */
    this._worker = worker || null;

    /**
     * @type {T}
     * @private
     */
    this._currentJob = null;


    /**
     * @type {boolean}
     * @private
     */
    this._isIdle = true;
  }



  /**
   * Set schedule worker
   * @param worker
   */
  setWorker(worker){
    this._worker = worker;
  }

  /**
   * @param {T} jobItem
   */
  addJob(jobItem, prepend) {
    if (!prepend){
      this._queue.push(jobItem);
    }else {
      this._queue.unshift(jobItem);
    }
    this._digest();
  }

  /**
   * @param {Array<T>} jobItems
   */
  addJobs(jobItems, prepend){
    if (!prepend) {
      this._queue.push.apply(this._queue, jobItems);
    }else{
      this._queue.unshift.apply(this._queue, jobItems);
    }
    this._digest();
  }

  /**
   * @return {boolean}
   */
  isActive(){
    return !!this._currentJob;
  }

  /**
   * @private
   */
  _digest(){
    let self = this;
    process.nextTick(()=>{

      if(self.isActive()){
        return;
      }

      self._currentJob = self._queue.shift();
      if(this._currentJob){
        if(self._isIdle){
          self.emit('activate');
        }
        self._isIdle = false;


        self._runJob(self._currentJob)
              .then(()=>{self._currentJob = null;})
              .then(self._digest.bind(self));

      } else {
        if (!self._isIdle){
          self._isIdle = true;
          self.emit('idle');
        }
      }
    });
  }

  /**
   * @private
   * @param {T} job
   * @return {Promise<*>}
   */
  _runJob(job){
    let that = this;
    that.emit('start', job);

    return new Promise((resolve, reject)=>{
      let res;
      try {
        res = this._worker(job);
      }catch(e){
        reject(e);
        return;
      }
      resolve(res);
    })
    .then(result=>{
      that.emit('success', result, job );
    })
    .catch(error=>{
      if (that.listenerCount('fail')>0){
        // don't log when has error listener
        that.emit('fail', error, job);
      }else{
        console.error(error, error.message, error.stack);
        // throw error;
        // TODO if this error is not caught, it breaks the system
        return null;
      }
    })
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = ScheduleWorker;