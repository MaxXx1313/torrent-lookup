import * as fs from 'fs';
import * as readline from 'node:readline';



/**
 */
export function promiseByLine(file: string, processFn: (line: string) => Promise<void>, errorFn?: (e?: Error) => any) {

    return new Promise<void>(function (resolve) {

        const input = fs.createReadStream(file);
        const lreader = readline.createInterface({input});

        lreader.on('error', function (err) {
            console.error(err);
        });

        lreader.on('line', function (line) {
            // pause emitting of lines...
            lreader.pause();

            // ...do your asynchronous line processing..
            Promise.resolve()
                .then(() => processFn(line))
                .catch(e => {
                    if (errorFn) {
                        errorFn(e);
                    } else {
                        console.warn(e);
                    }
                    return e;
                })
                .then(function () {

                    // ...and continue emitting lines.
                    lreader.resume();
                });
        });

        lreader.on('close', function () {
            // All lines are read, file is closed now.
            resolve();
        });
    });

}
