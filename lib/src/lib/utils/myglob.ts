import * as path from 'node:path';


const _pattenCache = {};


/**
 *
 */
export function matchCustom(filepath: string, pattern: string, opts?: { platform?: string }): boolean {
    const platform = opts?.platform || process.platform;
    if (platform === 'win32') {
        filepath = filepath.toLowerCase();
        pattern = pattern.toLowerCase();
    }

    // put compare function to cache
    if (!_pattenCache[pattern]) {
        _pattenCache[pattern] = _createPathTestFunction(pattern, {platform});
    }
    return _pattenCache[pattern](filepath);
}


function isAbsolute(filepath: string, opts: { platform: string }) {
    if (!filepath) {
        throw new Error('Invalid path');
    }
    switch (opts.platform) {
        case 'win32':
            return path.win32.isAbsolute(filepath);
        default:
            return path.posix.isAbsolute(filepath);
    }
    // return path.isAbsolute(filepath);
    // return filepath.startsWith('/') || filepath.match(/^\w\:/);
    // return path.win32.isAbsolute(filepath) || path.posix.isAbsolute(filepath);
}


export function _createPathTestFunction(pattern: string, opts?: { platform: string }) {
    const patternPrepared = path.normalize(pattern + path.posix.sep)
        .replace(/\*/g, '.+');
    const patternRegEx = new RegExp(_unifySlashes(patternPrepared));

    return function (filepath: string) {
        const filepathWithSlash = _unifySlashes(path.normalize(filepath + path.posix.sep));
        return patternRegEx.test(filepathWithSlash);
    };
}


function _unifySlashes(str: string) {
    return str.replace(/\//g, '\/') // escape slash for regexp
        .replace(/\\/g, '\/'); // escape slash for regexp
}