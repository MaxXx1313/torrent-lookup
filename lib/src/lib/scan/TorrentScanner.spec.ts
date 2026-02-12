import { describe, test } from "bun:test";
import { TorrentScanner } from './TorrentScanner';
import assert from 'node:assert';


describe('TorrentScanner', function () {

    test('isTorrentFile', function () {

        const scanner = new TorrentScanner();

        assert.equal(scanner.isTorrentFile('/some/path/test1.torrent'), true);
        assert.equal(scanner.isTorrentFile('/some/path/test1.torrent.txt'), false);
    });


    test('isExcluded', function () {

        const scanner = new TorrentScanner({
            exclude: ['.skippedfolder', 'node_modules'],
        });

        const tests: Array<[string, boolean]> = [
            ['/subfolder/.skippedfolder', true],
            ['/subfolder/node_modules/asd', true],
            ['/subfolder/nodemodules', false],
        ];

        for (const test of tests) {
            assert.equal(scanner.isExcluded(test[0]), test[1], 'path failed: ' + test[0]);
        }

    });

});

