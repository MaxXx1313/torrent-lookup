const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const LineByLineReader = require('line-by-line');
const bencode = require( 'bencode' );


/**
  1. load and hash torrents data
  2. read line by line datafile
  3. match data with hashed torrent data
  4. save result

 * @emit Analyzer#status    - when status changes

 */
class Analyzer extends EventEmitter {

  constructor(options){
    super();

    options = options || {};
    this._options = {};
    this._options.dFile = options.data  || 'tmp/files.bin';
    this._options.tFile = options.tdata || 'tmp/torrents.bin';

    // this.on('file',  this.onFile.bind(this));
    // this.on('start', this.onStart.bind(this));
    // this.on('end',   this.onEnd.bind(this));

    // key is a filename+':'+size =)
    // value is TorrentInfo
    this._hash = {};
  }

  analyze(){
    this.loadFiles(this._options.tFile);
    //.then(match)
  }


  loadFiles(torrentFile){
    var self = this;
    this.emit('status', 'Hashing data');

    promiseByLine(torrentFile, function(line){
        var dataArr = self.loadTorrentFile(line);
        for (var i = dataArr.length - 1; i >= 0; i--) {
          self._addToHash(dataArr[i]);
        }
    })
    .then(function(){
      // console.log(self._hash)
    })

  }

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
   */

  /**
   * @return {TorrentInfo}
   */
  loadTorrentFile(location){
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
    // console.log(data.info.files);
    if(!data.info.files){
      // single file
      return [{
        dir:'',
        base: data.info.name.toString(data.encoding || 'UTF-8'),
        length: data.info.length,
        torrent: location
      }];
    } else {
      // multiple files
      var name = data.info.name.toString(data.encoding || 'UTF-8')
      return data.info.files.map(function(fileData){
        fileData.path.unshift(name);
        return {
          base: fileData.path.pop().toString(data.encoding || 'UTF-8'),
          dir:  fileData.path.join('/'),

          length: fileData.length,
          torrent: location
        }
      });
    }
  }

  _addToHash(torrentInfo){
    let key = torrentInfo.base+':'+torrentInfo.length;
    if(this._hash[key]){
      console.warn('File duplicated?', torrentInfo);
    } else {
      this._hash[key] = torrentInfo;
    }
  }



  onStart(){
    this._dFileStream = fs.createReadStream(this._options.dFile);
    this._tFileStream = fs.createReadStream(this._options.tFile);
    this._rFileStream = fs.createWriteStream(this._options.tFile);

    this._lastFile = null;
  }

  onEnd(){
    this._dFileStream.end();
    this._tFileStream.end();
    this._rFileStream.end();
  }

}



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