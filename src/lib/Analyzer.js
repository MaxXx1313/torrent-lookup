const fs = require('fs');
const path = require('path');
const assert = require('assert');
const EventEmitter = require('events');

const LineByLineReader = require('line-by-line');
const bencode = require( 'bencode' );

const DEFAULT_DATA_LOCATION = '/tmp'; // '~/tmp'
/**
 * @typdef {object} TorrentData - bencoded data format (partial)
 * @property {string} encoding
 * @property {number} info.length
 * @property {string} info.name
 */

/**
 * @typdef {object} TorrentInfo - custom format
 * @property {string} base - file name + extension
 * @property {string} dir  - folder
 * @property {number} length - file size
 * @property {string} torrent - torrent location

 * after matchPath:
 * @property {Array<string>} [match] - path, which match this file
 */

/**
 * @typdef {object} TorrentMapping - custom format
 * @property {string} torrent - torrent location
 * @property {string} saveTo - absolute file location

 * TODO:
 * @property {Object} [mapping] - set of renamed/moved files
 */


/**
  1. load and hash torrents data
  2. read line by line datafile
  3. match data with hashed torrent data
  4. rehash by torent location
  5. make a choice from matched results
  6. save result

 * @emit Analyzer#opStatus    - when status changes

 */
class Analyzer extends EventEmitter {

  opStatus: EventEmitter = new EventEmitter<string>();

  constructor(options){
    super();
    options = options || {};
    options.data = options.data || DEFAULT_DATA_LOCATION;
    // assert.ok(options.data, 'data location must be specified');

    this._options = {};
    this._options.dFile = path.join(options.data, options.ddata || 'files.bin');
    this._options.tFile = path.join(options.data, options.tdata || 'torrents.bin');
    this._options.rFile = path.join(options.data, options.rdata || 'maps.json');

    /**
     * @type {MyHash}
     *
     *  key is a filename+':'+size =)
     *  value is Array<TorrentInfo>
     *  Note: one file can present in different torrens.
     *  Moreover it can be in one torrent file several times!
     */
    this._hash = {};


    /**
     * @type {MyMapping}
     *  key is torrent file location
     *  value is TorrentInfo
     */
    this._mapping = {};
  }

  analyze(){
    return this.loadTorrentFiles(this._options.tFile)
      .then(this.matchFiles.bind(this, this._options.dFile))
      .then(this._regroupHash.bind(this))
      .then(this._makeDecision.bind(this))
      .then(this.saveTo.bind(this, this._options.rFile));
  }


  loadTorrentFiles(torrentFile){
    var self = this;
    self.emit('opStatus', 'Hashing data');

    return promiseByLine(torrentFile, function(line){
        var dataArr = self._loadTorrentFile(line);
        for (var i = dataArr.length - 1; i >= 0; i--) {
          self._addToHash(dataArr[i]);
        }
    })
    .then(function(){
      // console.log(self._hash);
    })

  }


  /**
   *
   */
  matchFiles(dFile){
    var self = this;
    self.emit('opStatus', 'Matching files');

    this._lastFile = null;

    return promiseByLine(dFile, function(fileInfo){

      // parse filepath and size
      let m = fileInfo.match(/(.*):([-\d]+)$/);
      if(!m){
        return null;
      }
      let pathRelative = m[1];
      let size = m[2];

      // get absolute location
      let pathAbsolute = self.pushRelative(pathRelative);

      //
      self._matchFile(pathAbsolute, size);
    });
  }

  /**
   * @param {string} location
   * @param {integer} size
   *
   * Matching is quite challenged task
   *  1. try to match exact file + size
   //*  2. try to match exact filename
   */
  _matchFile(location, size){
    var self = this;

    // console.log(location, size);

    /**
     * @type {MyMappingEntry}
     */
    // let mapping = {

    // };

    let pathInfo = path.parse(location);

    // 1. match exact file + size
    let key = pathInfo.base + ':' + size;
    // console.log(key);
    if( this._hash[key] ){

      let matchTorrentInfo = this._hash[key];

      matchTorrentInfo = matchTorrentInfo.forEach(item=>{

        // TODO: 'no-relocate-inside-torrent' option
        // 2. match path
        let savedTo = self.__getBasePath(pathInfo.dir, item.dir);
        if(savedTo){

          // matched!
          item.match = item.match || [];
          item.match.push(savedTo);
        }

      });

    }
    // this._mapping
  }

  __getBasePath(location, dir){
    // console.log('__matchPath', pathInfo, dir);
    if(dir == ''){
      return location;
    }
    if( location.endsWith('/'+dir) ){
      return location.substr(0, location.length - dir.length-1);
    }
    return false;
  }

  // group by torrent location
  _regroupHash(){
    var self = this;
    self.emit('opStatus', 'Hashing');

    self._mapping = {};
    Object.keys(self._hash).forEach(key=>{

      self._hash[key].forEach(torrentInfo=>{
        let torrent = torrentInfo.torrent;
        self._mapping[torrent] = self._mapping[torrent] || [];
        self._mapping[torrent].push(torrentInfo);
      });
    });
    self._hash = null; // free some memory
  }

  /**
   * @return {Array<TorrentMapping>}
   */
  _makeDecision(){
    var self = this;
    self.emit('opStatus', 'Analyzing');
    self._decision = Object.keys(self._mapping).map(torrent=>{

      // key is path, value is a score
      let pathes = {};

      self._mapping[torrent].forEach(torrentInfo=>{
        if(!torrentInfo.match){
          return;
        }

        // collect scores
        torrentInfo.match.forEach(path=>{
          pathes[path] = (pathes[path] || 0) + 1;
        });

      });

      // choose max
      let maxScore = -1;
      let saveTo;
      Object.keys(pathes).forEach(function(location){
          if(maxScore < pathes[location]){
            maxScore = pathes[location];
            saveTo = location;
          }
      });

      /**
       * @type {TorrentMapping}
       */
      return {
        torrent:torrent,
        saveTo : saveTo
      }

    });

    return self._decision;
  }


  /**
   *
   */
  pushRelative(location){
      var locAbsolute;
      if(this._lastFile){
        locAbsolute = path.join(this._lastFile + '/..', location);
      } else {
        locAbsolute = location;
      }
      this._lastFile = locAbsolute;
      return locAbsolute;
  }


  saveTo(location){
    var self = this;
    self.emit('opStatus', 'Saving');
    // 'found-only'

    let data = self._decision.filter(mapping=>mapping.saveTo);
    return writeFile(location, JSON.stringify(data));
  }

  /**
   * @return {TorrentInfo}
   */
  _loadTorrentFile(location){
    var content = fs.readFileSync(location);

    /**
     * @type {TorrentData}
     */
    var data = bencode.decode( content/*, 'UTF-8'*/ );
    return this._grabTorrentData(data, location);
  }

  // https://nodejs.org/dist/latest-v7.x/docs/api/path.html#path_path_parse_path
  _grabTorrentData(data, location){
    delete data.info.pieces; // some binary data
    let encoding = data.encoding || 'UTF-8';

    // console.log(data.info.files);
    if(!data.info.files){
      // single file
      return [{
        dir:'',
        base: data.info.name.toString(encoding),
        length: data.info.length,
        torrent: location
      }];
    } else {
      // multiple files
      var name = data.info.name.toString(encoding)
      return data.info.files.map(function(fileData){
        fileData.path.unshift(name);
        return {
          base: fileData.path.pop().toString(encoding),
          dir:  fileData.path.join('/'),

          length: fileData.length,
          torrent: location
        }
      });
    }
  }

  /**
   * @param {TorrentInfo} torrentInfo
   */
  _addToHash(torrentInfo){
    let key = torrentInfo.base + ':' + torrentInfo.length;
    if(!this._hash[key]){
      this._hash[key] = [];
    }
    this._hash[key].push(torrentInfo);
  }


  // unused
  onStart(){
    this._dFileStream = fs.createReadStream(this._options.dFile);
    this._tFileStream = fs.createReadStream(this._options.tFile);
    this._rFileStream = fs.createWriteStream(this._options.tFile);

    this._lastFile = null;
  }

  // unused
  onEnd(){
    this._dFileStream.end();
    this._tFileStream.end();
    this._rFileStream.end();
  }

}



/**
 * @param {string} file
 * @param {function(file:string):Promise} processFn
 * @param {function(e:Error):any} errorFn
 */
function promiseByLine(file, processFn, errorFn){

  return new Promise(function(resolve){

    lr = new LineByLineReader(file);

    lr.on('error', function (err) {
      console.error(err);
    });

    lr.on('line', function (line) {
      // pause emitting of lines...
      lr.pause();

      // ...do your asynchronous line processing..
      Promise.resolve()
        .then(()=> processFn(line) )
        .catch(e=>{
          if(errorFn){
            errorFn(e);
          } else {
            console.warn(e);
          }
          return e;
        })
        .then(function(){

          // ...and continue emitting lines.
          lr.resume();
        });
    });

    lr.on('end', function () {
      // All lines are read, file is closed now.
      resolve();
    });
  });

}


module.exports.Analyzer = Analyzer;
module.exports.Analyzer.promiseByLine = promiseByLine;