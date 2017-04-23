

const http = require('http');
const url = require('url');


const CSRF_HEADER = 'x-transmission-session-id';


// https://trac.transmissionbt.com/browser/trunk/extras/rpc-spec.txt
class Transmission {

  /**
   *
   */
  constructor(endpoint){
    endpoint = endpoint || 'http://admin:admin@localhost:9091';

    let parsed = url.parse(endpoint);
    this._parsed = parsed;

    this._csrf = null;
  }

  /**
   * @param {string} filename - filename or URL of the .torrent file
   * @param {string} downloadDir - path to download the torrent to
   * @param {object} [opts] any extra options according to the specificaion
   * https://trac.transmissionbt.com/browser/trunk/extras/rpc-spec.txt#L356
   */
  torrentAdd(filename, downloadDir, opts){
    opts = opts || {};
    opts['filename'] = filename;
    opts['download-dir'] = downloadDir;

    return this.rpcRequest('torrent-add', opts)
      .then(this._torrentAddGetId.bind(this));
  }

  _torrentAddGetId(res){
    let result = res.body.arguments['torrent-added'] || res.body.arguments['torrent-duplicate'];
    if(result){
      result.isNew = !!res.body.arguments['torrent-added'];
      return result;
    } else {
      throw new Error('Me: unexpected response');
    }
  }


  /**
   *
   */
  rpcRequest(method, data){
    let self = this;

    let opts = clone(this._parsed);

    let payload = {
      method: method,
      arguments: data
    };

    opts.method = "POST";
    opts.path = "/transmission/rpc";

    //
    function _makeRequest(){
      opts.headers = opts.headers || {};
      opts.headers[CSRF_HEADER] = self._csrf;

      // console.log(opts); console.log(payload);

      return request(opts, JSON.stringify(payload))
        .then(self._collectCsrf.bind(self))
        .then(self._rpcResponseJson.bind(self))
        .then(self._rpcResponse.bind(self))
        .then(res=>{
          // console.log(res.body);
          return res;
        });
    }

    return _makeRequest()
      .catch((res)=>{
        // CSRF Protection
        if(res.statusCode === 409 ){
          self._collectCsrf(res);
          return _makeRequest();
        } else {
          throw res;
        }
      });
  }

  /**
   *
   */
  _rpcResponse(res){
    if(res.body && res.body.result){
      if(res.body.result !== "success"){
        throw new Error(res.body.result || 'Transmission reports an error');
      }
    }
    return res;
  }

  /**
   *
   */
  _rpcResponseJson(res){
    let ct = getContentType(res.headers["content-type"]);

    if(ct == "application/json"){
      res.body = JSON.parse(res.body); // throws error
    }
    return res;
  }

  /**
   *
   */
  _collectCsrf(res){
    if(res.headers[CSRF_HEADER]){
      this._csrf = res.headers[CSRF_HEADER];
    }
    return res;
  }

}// -Transmission class


/**
 *
 */
function clone(obj){
  return JSON.parse(JSON.stringify(obj));
}

/**
 * @param {object} opts : see https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_request_options_callback
 * @param {string} [postData]
 */
function request(opts, postData){
  return new Promise(function(resolve, reject){
    let req = http.request(opts, function(res){

      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

      let body = '';

      // let charset = getCharset( res.headers["content-type"] );
      // res.setEncoding( charset || 'utf8');
      res.setEncoding( 'utf8');
      res.on('data', (chunk) => {
        // console.log(`BODY: ${chunk}`);
        body += chunk;
      });
      res.on('end', () => {
        res.body = body;
        // console.log('No more data in response.');
        if( res.statusCode >= 400){
          reject(res);
        } else {
          resolve(res);
        }
      });
    });


    req.on('error', (e) => {
      reject(e);
    });

    if(postData){
      // write data to request body
      req.write(postData);
    }
    req.end();

  });
}

// "content-type":"application/json; charset=UTF-8"
function getContentType(contentTypeHeaderValue){
  return ((""+contentTypeHeaderValue).match(/(.*?)(;|$)/) || [])[1];
}
//
function getCharset(contentTypeHeaderValue){
  return ((""+contentTypeHeaderValue).match(/charset=(.*?)(;|$)/) || [])[1];
}



module.exports.Transmission = Transmission;
module.exports.Transmission.getContentType = getContentType;
module.exports.Transmission.getCharset = getCharset;
