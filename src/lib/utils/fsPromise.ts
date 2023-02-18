import * as fs from 'fs';
import { WriteFileOptions } from 'fs';



interface FileReadOptions {
    encoding?: null | undefined;
    flag?: string | undefined;
}

/**
 *
 */
export function writeFile(location: string, data: any, opts: WriteFileOptions = {}): Promise<any> {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(location, data, opts, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve();
            }
        });
    });
}


/**
 *
 */
export function readFile(location: string, opts: FileReadOptions = {}): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(location, opts, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data.toString());
            }
        });
    });
}


/**
 * @more: https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_class_fs_stats
 */
export function readdir(location: string): Promise<string[]> {
    return new Promise(function (resolve, reject) {
        fs.readdir(location, function (err, files) {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}


/**
 * create folder if it not exists
 */
export function pesistFolderSync(folder: string): void {
    let stat;
    try {
        stat = fs.statSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
        return;
    }
    if (!stat.isDirectory()) {
        throw new Error('Not a folder: ' + folder);
    }
    return;
}
