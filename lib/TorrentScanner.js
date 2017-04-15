const fs = require('fs');
const path = require('path');
const Scanner = require('./Scanner').Scanner;


const TORRENT_EXTENSION = '.torrent';


class TorrentScanner extends Scanner{


  constructor(options){
    super(options);

    options = options || {};
    this._options = {};
    this._options.dFile = options.dFile || 'tmp/files.bin';
    this._options.tFile = options.tFile || 'tmp/torrents.bin';

    this.on('file',  this.onFile.bind(this));
    this.on('start', this.onStart.bind(this));
    this.on('end',   this.onEnd.bind(this));
  }

  onFile(location, stats){
    location = path.resolve(location);
    if( this.isTorrentFile(location, stats) ){
      this._tFileStream.write( location + '\n');
    } else {

      // get relative location
      var locRelative = this.shiftRelative(location);
      this._dFileStream.write( locRelative + ':' + stats.size + '\n');
    }
  }

  /**
   * Get file location  and return relative path from previous file.
   * Also set internal relative oath to a new one
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



module.exports.TorrentScanner = TorrentScanner;
// module.exports.Scanner = Scanner;
