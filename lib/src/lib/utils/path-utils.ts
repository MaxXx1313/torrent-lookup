import os from "node:os";
import * as path from 'node:path';

export class PathUtils {
    /**
     * Return correct path which can be safely used with 'path.join'
     */
    static normalizePath(filepath: string) {
        // fix windows drive root
        if (filepath.match(/^\w{1}:\\?$/)) {
            // location is a pure drive letter: "C:" o "C:\"
            filepath = filepath.substring(0, 2) + '\\';
        }

        // fix home path
        if (filepath.match(/^\~(?:[\/\\]|$)/)) {
            // location starting from '~'
            filepath = os.homedir() + filepath.substring(1);
        }
        return filepath;
    }

    /**
     * Get basepath from {@param filepath} to {@param dir}, if it's a child, otherwise return null
     */
    static extractBasePath(filepath: string, dir: string): string {
        if (!dir?.length) {
            return filepath;
        }
        const fileParts = filepath.split(path.sep);
        const dirParts = dir.split(path.sep);
        for (let i = 0; i < dirParts.length; i++) {
            if (fileParts[fileParts.length - i - 1] !== dirParts[dirParts.length - i - 1]) {
                return null;
            }
        }
        // filepath ends with dir
        return fileParts.slice(0, fileParts.length - dirParts.length).join(path.sep);
    }
}