import { TorrentScanner } from './TorrentScanner';
import { FileScanner } from './FileScanner';
import { expect } from '@jest/globals';



describe('TorrentScanner', function () {

    it('isTorrentFile', function () {

        let scanner = new TorrentScanner({target: []});

        expect(scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.torrent')).toBe(true);
        expect(scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.txt')).toBe(false);
        expect(scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.torrent.txt')).toBe(false);
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
            expect(scanner.isExcluded(test[0])).toBe(test[1]);
        });

    });

});

