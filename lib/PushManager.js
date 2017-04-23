// const fs = require('fs');
const path = require('path');
const assert = require('assert');
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
    return self._client.torrentAdd(location, saveTo, {paused:true})
      .then(result=>{
        self.emit('opStatus', 'Torrent added: ' + result.id );
      });
  }

}


/**
 *
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



/**
 * Run {@link param promiseFn} across each element in array sequentially
 *
 * @param {Array} array
 * @param {object} opts
 * @param {object} opts.drop:boolean - don't save result for each promise
 *
 * @param {function} promiseFn
 * @return {Promise}
 *
 * by preliminary estimation the recursive mode takes less memory than iterative,
 * because iterative one allocates memory for the function before any async operation run
 */
function chainPromise(array, opts, promiseFn){
    if(typeof opts === "function" && !promiseFn){
      promiseFn = opts;
      opts = {};
    }

    var i = 0;
    var result = [];

    let collectorFn = opts.drop ? nope : __collectResult;
    function __collectResult(res){
      result.push(res);
    }
    function nope(){}


    function __step(){
        if(i >= array.length){
            return Promise.resolve();
        }
        let item = array[i++];
        return promiseFn(item)
            .then(__collectResult)
            .then(__step);
    }

    return __step().then(function(){
      return opts.drop ? null : result;
    });
}





module.exports.PushManager = PushManager;
module.exports.PushManager.getClient = getClient;
