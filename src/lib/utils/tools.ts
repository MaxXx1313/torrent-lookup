import * as path from 'path';



const http = require('http');


/**
 * Run a function not more often than {@link timeout}
 */
export function debounce<T>(fn: (T) => void, timeout: number): (T) => void {
    const caller = this;
    let lastCall: number | null = null;


    return function (...args) {
        const now = Date.now();
        if ((lastCall === null) || (now - lastCall > timeout)) {
            lastCall = now;
            fn.apply(caller, args);
        }
    };
}


/**
 *
 */
export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


/**
 * @param {object} opts : see https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_request_options_callback
 * @param {string} [postData]
 * TODO: use axios
 */
export function request(opts, postData: any = null) {
    return new Promise(function (resolve, reject) {
        let req = http.request(opts, function (res) {

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
                if (res.statusCode >= 400) {
                    reject(res);
                } else {
                    resolve(res);
                }
            });
        });


        req.on('error', (e) => {
            reject(e);
        });

        if (postData) {
            // write data to request body
            req.write(postData);
        }
        req.end();

    });
}

/**
 * Get basepath from {@param filepath} to {@param dir}, if it's a child
 * Otherwise return false
 * @private
 */
export function extractBasePath(filepath: string, dir: string): string {
    if (dir == '') {
        return filepath;
    }
    if (filepath.endsWith(path.sep + dir)) {
        return filepath.substr(0, filepath.length - dir.length - 1);
    }
    return null;
}

/**
 *
 */
export function nexTickPromise() {
    return new Promise(resolve => {
        process.nextTick(resolve);
    });
}


//## tick
let _tic_time = 0;

/**
 *
 */
export function tick() {
    let t = _tic_time;
    _tic_time = Date.now();
    return _tic_time - t;
}
