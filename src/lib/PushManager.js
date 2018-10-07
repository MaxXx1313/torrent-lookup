const fs = require('fs');
const path = require('path');
const assert = require('assert');
const chainPromise = require('./tools.js').chainPromise;
const EventEmitter = require('events');

const Transmission = require('./push/Transmission').Transmission;

const DEFAULT_DATA_LOCATION = '/tmp'; // '~/tmp'


class PushManager extends EventEmitter{

  /**
   *
   */
  constructor(clientName, options){
    super();

    options = options || {};
    options.data = options.data || DEFAULT_DATA_LOCATION;

    this._options = options || {};
    this._options.rFile = path.join(options.data, options.rdata || 'maps.json');

    //
    this._client = getClient(clientName, options);
  }


  /**
   *
   */
  pushAll(){

    var dataRaw = fs.readFileSync(this._options.rFile);
    let matchArr = JSON.parse(dataRaw);

    return this._pushAll(matchArr);
  }

  _pushAll(matchArr){
    let self = this;
    return chainPromise(matchArr, {drop:true}, function(match){
      return self.push(match.torrent, match.saveTo);
    });
  }


  push(location, saveTo, opts){
    let self = this;
    return self._client.push(location, saveTo)
      .then(result=>{
        self.emit('opStatus', 'Torrent '+(result.isNew ? 'added':'exists')+': ' + result.id + ':\t' + location );
      });
  }

}


/**
 * Client must implement IPushProvider
 */
function getClient(clientName, options){
  switch(clientName){
    case 't':
    case 'transmission':
      return new Transmission(options.url);

    default:
      throw new Error('Unknown client: ' + clientName);
  }
}



module.exports.PushManager = PushManager;
module.exports.PushManager.getClient = getClient;
