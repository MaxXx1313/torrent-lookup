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
});
