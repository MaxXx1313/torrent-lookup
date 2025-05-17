import * as minimatch from "minimatch";
import { MMRegExp } from "minimatch";
import path from 'node:path';


const _pattenCache = {};


/**
 *
 */
export function matchCustom(filepath: string, pattern: string) /* boolean */ {
    const platform = process.platform;
    if (platform === 'win32') {
        filepath = filepath.replace(/\\/g, path.posix.sep);
        pattern = pattern.replace(/\\/g, path.posix.sep);
    }

    // put compare function to cache
    if (!_pattenCache[pattern]) {
        const globDerived = [pattern];

        const fixChild = !(pattern.endsWith('/**') || pattern.endsWith('/*'));
        if (fixChild) {
            globDerived.push(pattern + '/**');
        }

        const fixParent = !isAbsolute(pattern) && !(pattern.startsWith('**/') || pattern.startsWith('*/'));
        if (fixParent) {
            globDerived.push('**/' + pattern);
        }

        if (fixChild && fixParent) {
            globDerived.push('**/' + pattern + '/**');
        }

        const globReArr: MMRegExp[] = globDerived
            .map(g => minimatch.makeRe(g, {dot: true, nocase: platform === 'win32'}) as MMRegExp)
            .filter(v => !!v);

        _pattenCache[pattern] = function (_filepath: string) {
            const match = !globReArr.every(r => !r.test(_filepath));
            // console.log(' matchCustom', loc, globDerived, match/*, globRe*/);
            return match;
        }
    }
    return _pattenCache[pattern](filepath);
}


function isAbsolute(filepath: string) {
    if (!filepath) {
        throw new Error('Invalid path');
    }
    return path.isAbsolute(filepath);
    // return filepath.startsWith('/') || filepath.match(/^\w\:/);
    // return path.win32.isAbsolute(loc) || path.posix.isAbsolute(loc);
}
