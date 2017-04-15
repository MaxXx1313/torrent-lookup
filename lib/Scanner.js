const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const ScheduleWorker = require('././ScheduleWorker');

/**
 * @typedef {object} fs.Stats
 * @property {function} isFile
 * @property {function} isDirectory
 *
 * @more: https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_class_fs_stats
 */

function readdir(location){

 return new Promise(function(resolve, reject){
      fs.readdir(location, function(err, files){
        if(err){
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
}


/**
 *
 * @emit Scanner#start   - at the beginning of scan process
 * @emit Scanner#end     - at the end of scan process
 *
 * @emit Scanner#scan    - when scan target changed
 * @emit Scanner#file    - when file is found
 * @emit Scanner#folder  - when folder is found
 */
class Scanner extends EventEmitter {

  constructor(options){
    super();
    this._sw = new ScheduleWorker(this._workerFn.bind(this));
    this._sw.on('activate', this.onActivate.bind(this));
    this._sw.on('idle', this.onIdle.bind(this));
  }

  /**
   * start scanning process
   * @param {string|Array<string>} location
   */
  scan(location){
    if(!Array.isArray(location)){
      location = [location];
    }
    this._sw.addJobs(location);
  }

  /**
   * @param {string} location
   * @return {Promise<fs.Stats>}
   */
  _workerFn(location){
    let self = this;

    // console.log('_workerFn', location);
    self.emit('scan', location);

    return readdir(location)
    .then(files=>{

      for (var i = 0; i < files.length; i++) {
        let file = path.join(location, files[i]);
        let stats;
        try{
         stats = fs.statSync(file);
        }catch(err){
          console.warn(err);
        }

        if(!stats){
          continue;
        }
        // console.log(self);

        if(stats.isDirectory()){
          self.onFolderFound(file, stats);
        } else if(stats.isFile()){
          self.onFileFound(file, stats);
        } else {
          self.onOtherFound(file, stats);
        }
      }
    });
  }

  onFolderFound(location, stats){
    // emit folder
    this.emit('folder', location, stats);
    this._sw.addJob(location, !!'prepend');
  }

  onFileFound(location, stats){
    // emit file
    this.emit('file', location, stats);
  }


  onOtherFound(location, stats){
    // skip others
    this.emit('unknown', location, stats);
    console.log('skip unsupported location:', location);
  }



  onActivate(){
    this.emit('start');
  }


  onIdle(){
    this.emit('end');
  }

  off(/*arguments*/){
    return this.removeListener.apply(this, arguments);
  }


}//- Scanner



module.exports.Scanner = Scanner;
