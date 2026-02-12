import * as path from 'node:path';

/**
 *
 */
export class MyGlob {

    static _patternCache = {};

    /**
     */
    static match(filepath: string, pattern: string, opts?: { platform?: string }): boolean {
        // put compare function to cache
        if (!MyGlob._patternCache[pattern]) {
            MyGlob._patternCache[pattern] = MyGlob.createPathTestFunction(pattern, opts);
        }
        return MyGlob._patternCache[pattern](filepath);
    }

    /**
     */
    static _preparePatternRegexString(pattern: string, opts?: { platform?: string }) {
        const platform = opts?.platform || process.platform;
        if (platform === 'win32') {
            pattern = pattern.toLowerCase();
        }
        const patternPrepared = path.posix.sep + path.posix.normalize(_unifySlashes(pattern) + path.posix.sep)
            .replace(/\*/g, '.+');
        return patternPrepared;
    }

    /**
     */
    static _preparePathString(filepath: string, opts?: { platform?: string }) {
        const platform = opts?.platform || process.platform;
        if (platform === 'win32') {
            filepath = filepath.toLowerCase();
        }

        return path.posix.sep + path.posix.normalize(_unifySlashes(filepath) + path.posix.sep);
    }

    /**
     */
    static createPathTestFunction(pattern: string, opts?: { platform?: string }) {
        const patternRegExpString = MyGlob._preparePatternRegexString(pattern, opts);
        const patternRegExp = new RegExp(patternRegExpString);

        return (filepath: string) => {
            const filepathWithSlash = MyGlob._preparePathString(filepath, opts);
            return patternRegExp.test(filepathWithSlash);
        };
    }

}

/**
 *
 */
function _unifySlashes(str: string) {
    return str.replace(/\//g, '\/') // escape slash for regexp
        .replace(/\\/g, '\/'); // escape slash for regexp
}

