const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const minimatch = require("minimatch")
const ScheduleWorker = require('./ScheduleWorker');



const SKIPS_DEFAULT = [
  '.*',
  'node_modules'
];

/**
 * 1. recurseively scan folder content
 *   1.1. - emit events when file/folder is found
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
    this._options = options || {};
    this._options.skip = this._options.skip || SKIPS_DEFAULT;

    this._sw = new ScheduleWorker(this._workerFn.bind(this));
    this._sw.on('activate', this.onActivate.bind(this));
    this._sw.on('idle', this.onIdle.bind(this));
  }

  /**
   * start scanning process
   * @param {string|Array<string>} location
   */
  scan(locations){
    let self = this;
    if(!locations){
      console.log('location must be set');
      return;
    }
    if(!Array.isArray(locations)){
      locations = [locations];
    }
    locations
      .filter(loc=>!this._isExcluded(loc))
      .forEach(location=>{
        self.addJob(location);
      });
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

        if(self._isExcluded(file)){
          continue;
        }

        let stats;
        try{
         stats = fs.lstatSync(file);
        }catch(err){
          // skip no file and access warning
          if(err.code != 'ENOENT'){
            console.warn(err);
          }
        }

        if(!stats){
          continue;
        }

        if(stats.isSymbolicLink()){
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
    this.addJob(location);
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


  addJob(location){
    this._sw.addJob(location, !!'prepend');
  }

  _isExcluded(location){
    // console.log('_isExcluded', location);
    let locationComponents = location.split(path.sep);

    for(let i = this._options.skip.length - 1; i>=0; i--){
      let skipRule = this._options.skip[i];

      let m = minimatch.match(locationComponents, skipRule) || [];
      // console.log('  minimatch', skipRule, m);
      if(m.length > 0){
        return true;
      }
    }
    return false;
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
module.exports.Scanner.SKIPS = SKIPS_DEFAULT;