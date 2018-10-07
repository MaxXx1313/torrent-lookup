

const http = require('http');

declare const Promise: any;

/**
 * Run a function not more often than {@link timeout}
 * TODO: review
 */
export function debounce(fn: Function, timeout: number){
  var caller = this;

  var pass = true;


  const _debounce_fn = function (/*arguments*/){
    if(pass){
      pass = false;
      fn.apply(caller, arguments);
    }
  }

  _debounce_fn['_debounce_timer'] = setInterval(function(){
    pass = true;
  }, timeout);

  _debounce_fn['_debounce_timer'].unref(); // it's important moment!

  _debounce_fn['cancel'] = function(){
    clearInterval(this._debounce_timer);
  };
  return _debounce_fn;
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
export function chainPromise(array: any[], opts : {drop?: boolean} = {}, promiseFn: Function): Promise<any[]>{

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


/**
 * @param {Array<Object>} dataArray
 */
export function prettyFormat(dataArray: Array<{}>, columnsFilter?: string[]){
  dataArray = dataArray || [];

  if(dataArray.length === 0){
    return ' \x1B[3m no data \x1B[0m';
  }

  // collect columns
  let columns = {};
  dataArray.forEach(row=>{
    let cols = columnsFilter || Object.keys(row);
    cols.forEach(name=>{
      columns[name] = max(columns[name] || 0, (''+row[name]).length );
    });
  });

  // print columns
  let tableData: string = '';
  Object.keys(columns).forEach((name, index)=>{
    // normalize column length
    columns[name] = max(columns[name], name.length);

    // create header
    let spaceAfter = columns[name] - name.length;
    tableData +=
      (index > 0 ?'|':'')  // separator
      + ' ' + name + ' '   // name + padding
      + (spaceAfter > 0 ? ' '.repeat(spaceAfter) : '' ) // space after
      ;
  });
  tableData += '\n';

  // +1 for separator, +2 for padding, -1 for no separator on first line
  let sum = Object.keys(columns).reduce((sum, name)=>sum+columns[name]+1+2, -1);
  tableData += (sum > 0 ? '-'.repeat(sum) : '') + '\n';

  // table data
  dataArray.forEach(row=>{
    Object.keys(columns).forEach((name, index)=>{

      let spaceAfter = columns[name] - (""+row[name]).length;
      tableData +=
        (index > 0 ?'|':'')  // separator
        + ' ' + row[name] + ' '   // value + padding
        + (spaceAfter > 0 ? ' '.repeat(spaceAfter) : '' ) // space after
        ;
    });
    tableData += '\n';
  });

  return tableData;
}


function max(a: number, b: number): number{ return a > b ? a : b; }


/**
 *
 */
export function clone(obj){
  return JSON.parse(JSON.stringify(obj));
}



/**
 * @param {object} opts : see https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_request_options_callback
 * @param {string} [postData]
 */
export function request(opts, postData: any = null){
  return new Promise(function(resolve, reject){
    let req = http.request(opts, function(res){

      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

      let body = '';

      // let charset = getCharset( res.headers["content-type"] );
      // res.setEncoding( charset || 'utf8');
      res.setEncoding('utf8');
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


//## tick
let _tic_time = 0;

/**
 *
 */
export function tick(){
    let t = _tic_time;
    _tic_time = Date.now();
    return _tic_time - t;
}