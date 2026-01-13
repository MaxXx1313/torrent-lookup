import os from "node:os";

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