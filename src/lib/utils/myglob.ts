const minimatch = require("minimatch");
const path = require('path');


const globCache = {};

const forcePlatform = null;


/**
 *
 */
export function matchCustom(loc, glob) /* boolean */ {
  const platform = forcePlatform || process.platform;
    if(platform === 'win32'){
      loc = loc.replace(/\\/g, path.posix.sep);
      glob = glob.replace(/\\/g, path.posix.sep);
    }

    // put compare function to cache
    if(!globCache[glob]) {
      const globDerived = [glob];

      const fixChild = !(glob.endsWith('/**') || glob.endsWith('/*'));
      if(fixChild){
        globDerived.push(glob + '/**');
      }     

      const fixParent = !isAbsolute(glob) && !(glob.startsWith('**/') || glob.startsWith('*/'));
      if(fixParent){
        globDerived.push('**/' + glob);
      }

      if(fixChild && fixParent) {
        globDerived.push('**/' + glob + '/**');    
      }

      const globRe = globDerived.map(g => minimatch.makeRe(g, { dot: true, nocase: platform === 'win32' }) );

      globCache[glob] = function(loc){
        const match = !globRe.every(r => !r.test(loc));
        // console.log(' matchCustom', loc, globDerived, match/*, globRe*/);
        return match;
      }
    }
    return globCache[glob](loc);
}





function isAbsolute(loc){
  if(!loc){
    throw new Error('Invalid path');
  }
  return loc.startsWith('/') || loc.match(/^\w\:/);
  // return path.win32.isAbsolute(loc) || path.posix.isAbsolute(loc);
}
