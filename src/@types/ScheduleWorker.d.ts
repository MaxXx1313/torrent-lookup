/**
 * Created by maksim on 23/12/16.
 */

import EventEmitter = NodeJS.EventEmitter;


declare class ScheduleWorker<T> extends EventEmitter{
    constructor(worker?:(job:T)=>void);
    setWorker(worker:(w:T)=>void):void;
    addJob(jobItem:T):void;
    addJobs(jobItems:T[]):void;
    isActive():boolean;
}

