import { describe, it } from 'node:test';
import assert from 'node:assert';
import { matchCustom } from './myglob';


describe('matchCustom.spec', () => {

    it('template match', () => {
        assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', '.npm'), true);
        assert.equal(matchCustom('/root/.npmz/project/lib/somefile.js', ".npm"), false);
    });

    it('absolute path', () => {
        assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', '/root/.npm'), true);
        assert.equal(matchCustom('/root/lib/.npm/project/lib/somefile.js', '/root/.npm'), false);
    });

    it('single wildcard', () => {
        assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', '*.js'), true);
        assert.equal(matchCustom('/root/.npm/project/lib/somefile.js', '*.json'), false);
    });

    it('trailing slash in file', function () {
        assert.equal(matchCustom('/root/.npm', '.npm'), true);
        assert.equal(matchCustom('/root/.npm/', '.npm'), true);
    });

    it('trailing slash in pattern', function () {
        assert.equal(matchCustom('/root/.npm', '.npm/'), true);
        assert.equal(matchCustom('/root/.npm/', '.npm'), true);
    });

    it('windows path', function () {
        assert.equal(matchCustom('C:\\Windows\\system32\\myfile.js', 'C:\\Windows', {platform: 'win32'}), true);
    });

    it('windows case', () => {
        assert.equal(matchCustom('C:/Windows/system32/myfile.js', 'C:\\windows', {platform: 'win32'}), true);
        assert.equal(matchCustom('C:/WINDOWS/system32/myfile.js', 'C:\\windows', {platform: 'win32'}), true);
        assert.equal(matchCustom('C:/WiNdOwS/system32/myfile.js', 'C:\\windows', {platform: 'win32'}), true);
        assert.equal(matchCustom('C:/windows/system32/myfile.js', 'C:\\WINDOWS', {platform: 'win32'}), true);
    });


    it('linux case', () => {
        assert.equal(matchCustom('/root/.NPM/project/lib/somefile.js', ".npm", {platform: 'posix'}), false);
    });
});
