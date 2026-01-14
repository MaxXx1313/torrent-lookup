import os from "node:os";
import * as path from 'node:path';

/**
 * @param filepath
 * @protected
 */
export function normalizePath(filepath: string) {
    // fix windows drive root
    if (filepath.match(/^\w{1}:\\?$/)) {
        // location is a pure drive letter: "C:" o "C:\"
        filepath = filepath.substring(0, 2) + '/';
    }

    // fix home path
    if (filepath.match(/^\~(?:[\/\\]|$)/)) {
        // location starting from '~'
        filepath = os.homedir() + filepath.substring(1);
    }
    return filepath;
}


/**
 * Get basepath from {@param filepath} to {@param dir}, if it's a child
 * Otherwise return null
 */
export function extractBasePath(filepath: string, dir: string): string {
    if (dir == '') {
        return filepath;
    }
    if (filepath.endsWith(path.sep + dir)) {
        return filepath.substring(0, filepath.length - dir.length - 1);
    }
    return null;
}