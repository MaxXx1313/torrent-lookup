import { TorrentScanner } from './TorrentScanner';
import { FileScanner } from './FileScanner';
import { describe, it } from 'node:test';
import assert from 'node:assert';


describe('TorrentScanner.spec', function () {

    it('isTorrentFile', function () {

        const scanner = new TorrentScanner({target: []});

        assert.equal(scanner.isTorrentFile('/some/path/test1.torrent'), true);
        assert.equal(scanner.isTorrentFile('/some/path/test1.torrent.txt'), false);
    });


    it('isExcluded', function () {

        const scanner = new FileScanner({
            exclude: ['.skippedfolder', 'node_modules'],
            cbFileFound: () => null,
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

