import { TorrentScanner } from './TorrentScanner';
import { FileScanner } from './FileScanner';
import { describe, it } from 'node:test';
import * as assert from 'node:assert';



describe('TorrentScanner', function () {

    it('isTorrentFile', function () {

        let scanner = new TorrentScanner({target: []});

        assert.equal(scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.torrent'), true);
        assert.equal(scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.txt'), false);
        assert.equal(scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.torrent.txt'), false);
    });


    it('isExcluded', function () {

        let scanner = new FileScanner({
            exclude: ['.skippedfolder'],
            cbFileFound: () => null,
        });

        let tests: Array<[string, boolean]> = [
            ['/home/user/Projects/tlookup3/test/fixtures/t1/.skippedfolder', true],
            ['/subfolder/.config/asd', true],
            ['/subfolder/asd.config/asd', false],

            ['/subfolder/node_modules/asd', true],
            ['/subfolder/nodemodules', false],

        ];

        tests.forEach(test => {
            assert.equal(scanner.isExcluded(test[0]), test[1]);
        });

    });

});

