import path from 'node:path';


const _pattenCache = {};


/**
 *
 */
export function matchCustom(filepath: string, pattern: string, opts?: { platform?: string }): boolean {
    const platform = opts?.platform || process.platform;
    if (platform === 'win32') {
        filepath = filepath.replace(/\\/g, path.posix.sep).toLowerCase();
        pattern = pattern.replace(/\\/g, path.posix.sep).toLowerCase();
    }

    // put compare function to cache
    if (!_pattenCache[pattern]) {
        _pattenCache[pattern] = createTestFunction(pattern, {platform});
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


function createTestFunction(pattern: string, opts: { platform: string }) {
    const patternWithSlash = path.normalize(pattern + path.sep);
    return function (filepath: string) {
        const filepathWithSlash = path.normalize(filepath + path.sep);

        // console.log('createTestFunction: test', filepathWithSlash, patternWithSlash);
        if (isAbsolute(patternWithSlash, opts)) {
            // pattern is an absolute path
            // console.log('createTestFunction: absolute', patternWithSlash);
            return filepathWithSlash.startsWith(patternWithSlash);
        } else {
            // relative/name-only
            // console.log('createTestFunction: relative', patternWithSlash);
            return filepathWithSlash.indexOf(path.sep + patternWithSlash) >= 0;
        }
    };
}
