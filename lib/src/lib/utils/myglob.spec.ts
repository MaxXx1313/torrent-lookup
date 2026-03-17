import { describe, test } from "bun:test";
import assert from 'node:assert';
import { MyGlob } from './myglob';


describe('MyGlob', () => {
    describe('match', () => {

        test('should match sample name', () => {
            assert.equal(MyGlob.match('/root/.npm/project/lib/somefile.js', '.npm'), true);
            assert.equal(MyGlob.match('/root/.npmz/project/lib/somefile.js', ".npm"), false);
            assert.equal(MyGlob.match('/root/no.npm/project/lib/somefile.js', ".npm"), false);
        });

        describe('posix', () => {

            test('linux path', () => {
                assert.equal(MyGlob.match('/root/.npm/project/lib/somefile.js', '/root/.npm'), true);
                assert.equal(MyGlob.match('/root/lib/.npm/project/lib/somefile.js', '/root/.npm'), false);
                assert.equal(MyGlob.match('/test/root/lib/.npm/project/lib/somefile.js', '/root/.npm'), false);
            });

            test('single wildcard', () => {
                assert.equal(MyGlob.match('/root/.npm/project/lib/somefile.js', '*.js'), true);
                assert.equal(MyGlob.match('/root/.npm/project/lib/somefile.js', '*.json'), false);
            });

            test('trailing slash in filename', function () {
                assert.equal(MyGlob.match('/root/.npm', '.npm'), true);
                assert.equal(MyGlob.match('/root/.npm/', '.npm'), true);
            });

            test('trailing slash in pattern', function () {
                assert.equal(MyGlob.match('/root/.npm', '.npm/'), true);
                assert.equal(MyGlob.match('/root/.npm/', '.npm'), true);
            });


            test('character case should matter', () => {
                assert.equal(MyGlob.match('/root/.NPM/project/lib/somefile.js', ".npm", {platform: 'posix'}), false);
                assert.equal(MyGlob.match('/root/.NPM/project/lib/somefile.js', ".NPM", {platform: 'posix'}), true);
            });


        });

        describe('windows', () => {
            test('windows example', function () {
                assert.equal(MyGlob.match('C:\\Windows\\system32\\myfile.js', '.swp', {platform: 'win32'}), false);
            });

            test('windows path', function () {
                assert.equal(MyGlob.match('C:\\Windows\\system32\\myfile.js', 'C:\\Windows', {platform: 'win32'}), true);
                assert.equal(MyGlob.match('C:\\Windows\\system32\\myfile.js', 'C:/Windows', {platform: 'win32'}), true);
                assert.equal(MyGlob.match('C:/Windows/system32/myfile.js', 'C:/Windows', {platform: 'win32'}), true);
                assert.equal(MyGlob.match('C:/Windows/system32/myfile.js', 'C:\\Windows', {platform: 'win32'}), true);
            });

            test('character case should not matter', () => {
                assert.equal(MyGlob.match('C:/Windows/system32/myfile.js', 'C:\\windows', {platform: 'win32'}), true);
                assert.equal(MyGlob.match('C:/WINDOWS/system32/myfile.js', 'C:\\windows', {platform: 'win32'}), true);
                assert.equal(MyGlob.match('C:/WiNdOwS/system32/myfile.js', 'C:\\windows', {platform: 'win32'}), true);
                assert.equal(MyGlob.match('C:/windows/system32/myfile.js', 'C:\\WINDOWS', {platform: 'win32'}), true);
                assert.equal(MyGlob.match('C:/windows/system32/myfile.js', 'C:\\WiNdOwS', {platform: 'win32'}), true);
            });
        });
    });
});
