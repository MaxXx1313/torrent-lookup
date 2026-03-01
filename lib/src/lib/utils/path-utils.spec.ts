import { describe, test } from "bun:test";
import assert from 'node:assert';
import { PathUtils } from "./path-utils";
import os from "node:os";


describe('PathUtils', () => {
    describe('normalizePath', () => {

        test('should keep character case', () => {
            assert.equal(PathUtils.normalizePath('/lowercase/UPPERCASE/CamelCase'), '/lowercase/UPPERCASE/CamelCase');
        });

        describe('windows', () => {

            test('fix windows drive root: trailing slash is needed to correctly handle the path', () => {
                assert.equal(PathUtils.normalizePath('c:'), 'c:\\');
                assert.equal(PathUtils.normalizePath('C:'), 'C:\\');
                assert.equal(PathUtils.normalizePath('g:'), 'g:\\');
                assert.equal(PathUtils.normalizePath('G:'), 'G:\\');
            });
            test('accept already normalized windows drive', () => {
                assert.equal(PathUtils.normalizePath('c:\\'), 'c:\\');
            });

            test('sample path', () => {
                assert.equal(PathUtils.normalizePath('c:\\windows\\system32'), 'c:\\windows\\system32');
                assert.equal(PathUtils.normalizePath('c:\\windows\\system32\\'), 'c:\\windows\\system32\\');
            });


        });

        describe('linux+mac', () => {
            test('should resolve pure home path. trailing slash can present', () => {
                assert.equal(PathUtils.normalizePath('~'), os.homedir());
            });
            test('should resolve combined home path', () => {
                assert.equal(PathUtils.normalizePath('~/my/inner/folder'), os.homedir() + '/my/inner/folder');
            });
            test('trailing slash can present', () => {
                assert.equal(PathUtils.normalizePath('/test'), '/test');
                assert.equal(PathUtils.normalizePath('/test/'), '/test/');
            });
        });
    });

    describe('extractBasePath', () => {
        const isWindows = process.platform === "win32";


        describe.if(!isWindows)('posix', () => {

            test('Should work with empty', () => {
                assert.equal(PathUtils.extractBasePath('/folder1/folder2/folder3', ''), '/folder1/folder2/folder3');
            });

            test('Should extract base path', () => {
                assert.equal(PathUtils.extractBasePath('/folder1/folder2/folder3', 'folder2/folder3'), '/folder1');
                assert.equal(PathUtils.extractBasePath('/folder1/folder2/file1.txt', 'file1.txt'), '/folder1/folder2');

                // more deep examples
                assert.equal(PathUtils.extractBasePath('/f1/f2/f3/f4/f5/f6', 'f6'), '/f1/f2/f3/f4/f5');
                assert.equal(PathUtils.extractBasePath('/f1/f2/f3/f4/f5/f6', 'f5/f6'), '/f1/f2/f3/f4');
                assert.equal(PathUtils.extractBasePath('/f1/f2/f3/f4/f5/f6', 'f4/f5/f6'), '/f1/f2/f3');
            });

            describe('Should return null', () => {
                test('if not a subfolder', () => {
                    assert.equal(PathUtils.extractBasePath('/folder1/folder2/folder3', 'folder2/folder4'), null);
                });
                test('if not exact match', () => {
                    assert.equal(PathUtils.extractBasePath('/f1/f2/f3/f4/f5/f6', 'f4/f6'), null);
                    assert.equal(PathUtils.extractBasePath('/f1/f2/f3/f4/f5/f6', 'f4/g5/f6'), null);
                });
            });
        });

    });
});
