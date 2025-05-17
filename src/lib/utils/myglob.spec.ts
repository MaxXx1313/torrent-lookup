import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { matchCustom } from './myglob';


describe('Glob base usage', () => {

    it('template match', () => {

        assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', '.npm'), true);
        // assert.equal(matchCustom('/.npm/project/lib/somefile.js', '.npm'), true);
        // assert.equal(matchCustom('/root/.npm/', '.npm'), true);
        assert.equal(matchCustom('/root/.npmz/project/lib/somefile.js', ".npm"), false);
    });
    it('trailing slash', function () {
        assert.equal(matchCustom('/root/.npm', '.npm'), true);
        assert.equal(matchCustom('/root/.npm/', '.npm'), true);
    });

//   it('windows path', function(){
//       forcePlatform = 'win32';
//       assert.equal(matchCustom('C:\\Windows\\system32\\myfile.js', 'C:\\Windows\\**'), true);
//   });
//
//
//   it('windows path 2', ()=>{
//       assert.equal(matchCustom('C:/Windows/system32/myfile.js', 'C:/Windows/**'), true);
//       assert.equal(matchCustom('C:/Windows/system32/myfile.js', 'C:/Windows/*'), false);
//   });
//
//
//   it('windows case', ()=>{
//       forcePlatform = 'win32';
//       assert.equal(matchCustom('C:/Windows/system32/myfile.js', 'c:/windows/**'), true);
//       assert.equal(matchCustom('C:/WINDOWS/system32/myfile.js', 'c:/windows/**'), true);
//       assert.equal(matchCustom('C:/WiNdOwS/system32/myfile.js', 'c:/windows/**'), true);
//       assert.equal(matchCustom('C:/windows/system32/myfile.js', 'c:/WINDOWS/**'), true);
//   });
//
//
//   it('linux case', ()=>{
//       forcePlatform = 'posix';
//       assert.equal(matchCustom('/root/.NPM/project/lib/somefile.js', "**/.npm/**"), false);
//   });
//
//
//
//   it('isAbsolute', ()=>{
//       assert.equal(path.win32.isAbsolute('C:/Windows/system32/myfile.js'), true);
//       assert.equal(path.win32.isAbsolute('Windows/system32/myfile.js'), false);
//
//       assert.equal(path.posix.isAbsolute('/Windows/system32/myfile.js'), true);
//       assert.equal(path.posix.isAbsolute('Windows/system32/myfile.js'), false);
//   });
// });
//
//
// describe('Minimatch custom', ()=>{
//
//   it('glob has globstar', ()=>{
//       assert.equal(matchCustom('/root/.npm/', ".npm/**"), true, 'after');
//       assert.equal(matchCustom('/root/.npm/', "**/.npm"), true,  'before');
//       assert.equal(matchCustom('/root/.npm/', "**/.npm/**"), true,  'both');
//   });
//   it('test first folder (prepend glob)', ()=>{
//       assert.equal(matchCustom('/.npm/folder', ".npm"), true,  'linux path');
//       assert.equal(matchCustom('C:/Windows/system32/myfile.js', 'Windows'), true, 'windows path');
//   });
//
//   it('exclude folder with content (append glob)', ()=>{
//       assert.equal(matchCustom('/root/.npm', ".npm"), true, 'without trailing slash');
//       assert.equal(matchCustom('/root/.npm/', ".npm"), true,  'with trailing slash');
//   });
//
//   it('match absolute path', ()=>{
//       assert.equal(matchCustom('/root/.npmz/project/lib/somefile.js', "/root"), true);
//       // assert.equal(matchCustom('/etc/root/.npmz/project/lib/somefile.js', "/root"), false);
//
//       // assert.equal(matchCustom('C:/Windows/system32/myfile.js', 'C:/Windows'), true);
//       // assert.equal(matchCustom('Windows/C/Windows/system32/myfile.js', 'C:/Windows'), false);
//   });
//
//   it('complex glob', ()=>{
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', ".npm*"), true, 'any match (zero)');
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', ".npm?"), false, 'one match');
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', ".np*"), true, 'any match (one)');
//
//
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', ".np*/p*t"), true, 'any match (two) 1');
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', ".np*/p*p"), false, 'any match (two) 2');
//
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', "root/**/lib"), true, 'depth 3');
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', "root/*/lib"), false, 'depth 2');
//
//
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', "root**"), true, 'globstar 1');
//       assert.equal(matchCustom('/roots/.npm/project/lib/somefile.js', "root**"), true, 'globstar 2');
//       assert.equal(matchCustom('/root', "root**"), true, 'globstar 3');
//       assert.equal(matchCustom('/root', "root/**"), false, 'globstar 4');
//       assert.equal(matchCustom('/root', "root"), true, 'globstar 5');
//
//
//
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', ".npm/project"), true, 'nested 1');
//       assert.equal(matchCustom('/root/.npm/projectZ/lib/somefile.js', ".npm/project"), false, 'nested 1');
//   });
//
//   it('dot glob', ()=>{
//
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', ".*"), true, 'dot 1');
//       assert.equal(matchCustom('/root/xnpm/project/lib/somefile.js', ".*"), false, 'dot 2');
//       assert.equal(matchCustom('/root/npm/project/lib/somefile.js', ".*"), false, 'dot 3');
//
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', "/root/*"), false, 'dot 4 (not match nested)');
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', "/root/**"), true, 'dot 5 (match nested)');
//       assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', "/root/**/project"), true, 'dot 6');
//
//       assert.equal(matchCustom('/root/.npm', "/root/*"), true, 'dot 7  (match dot)');
//   });

});

