const fs = require('fs');
const path = require('path');
const Scanner = require('./Scanner').Scanner;


const DEFAULT_DATA_LOCATION = '/tmp'; // '~/tmp'
const TORRENT_EXTENSION = '.torrent';

/**
 * 1. use Scanner to scan files and folders
 *   1.1 chech is that file is a torrent file
 *     1.1.1 write torrent file into one list
 *     1.1.2 write ordinary file into another list(with file size)
 *
 * @emit TorrentScanner#torrentfile    - when torrent file is found
 */
class TorrentScanner extends Scanner{


  constructor(options){
    super(options);

    options = options || {};
    options.data = options.data || DEFAULT_DATA_LOCATION;
    // assert.ok(options.data, 'data location must be specified');
    permitFolder(options.data);

    this._options = this._options || {};
    this._options.dFile = path.join(options.data, options.ddata || 'files.bin');
    this._options.tFile = path.join(options.data, options.tdata || 'torrents.bin');
    this._options.rFile = path.join(options.data, options.rdata || 'maps.json');

    this.on('file',  this.onFile.bind(this));
    this.on('start', this.onStart.bind(this));
    this.on('end',   this.onEnd.bind(this));

    this._resetStats();
  }

  _resetStats(){
    this._stats = {
      files: 0, // without torrent files
      torrents:0
    };
  }

  onFile(location, stats){
    location = path.resolve(location);
    if( this.isTorrentFile(location, stats) ){

      this._tFileStream.write( location + '\n');
      this._stats.torrents++;
      this.emit('torrentfile', location);
    } else {
      this._stats.files++;

      // get relative location
      var locRelative = this.shiftRelative(location);
      this._dFileStream.write( locRelative + ':' + stats.size + '\n');
    }
  }

  /**
   * Get file location  and return relative path from previous file.
   * Also set internal relative path to a new one
   */
  shiftRelative(location){
      var locRelative;
      if(this._lastFile){
        locRelative = path.relative(this._lastFile + '/..', location);
      } else {
        locRelative = location;
      }
      this._lastFile = location;
      return locRelative;
  }


  onStart(){
    this._dFileStream = fs.createWriteStream(this._options.dFile);
    this._tFileStream = fs.createWriteStream(this._options.tFile);

    this._resetStats();
    this._lastFile = null;
  }

  onEnd(){
    this._dFileStream.end();
    this._tFileStream.end();
  }


  /**
   * @return {boolean}
   */
  isTorrentFile(location, stats){
    return ( location.match(/(\.\w+)$/) || [])[1] == TORRENT_EXTENSION;
  }

}

/**
 *
 */
function permitFolder(folder){
  let stat;
  try{
    stat = fs.statSync(folder);
  }catch(e){
    fs.mkdirSync(folder);
    return true;
  }
  if(!stat.isDirectory()){
    throw new Error('Not a folder: ' + folder);
  }
  return true;
}



module.exports.TorrentScanner = TorrentScanner;
module.exports.TorrentScanner.permitFolder = permitFolder;
// module.exports.Scanner = Scanner;