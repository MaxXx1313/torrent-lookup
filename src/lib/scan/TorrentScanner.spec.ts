import { TorrentScanner } from './TorrentScanner';
import { FileScanner } from './FileScanner';
import { expect } from '@jest/globals';



describe('TorrentScanner', function () {

    const target = __dirname + '/fixtures/t1';

    it('simple scan', function (done) {

        let expectedFiles = [
            target + "/Sheltered [rutracker.org].t5364696.torrent:41955",
            target + "/[NNM-Club.me]_Q3 2015.torrent:97896",
            target + "/gog_sheltered_2.1.0.2.sh:271816803",
            target + "/subfolder/test1.txt:1"
        ];
        let expectedFolders = [
            target + "/subfolder:-1"
        ];

        let expectedTorrents = [
            target + "/Sheltered [rutracker.org].t5364696.torrent",
            target + "/[NNM-Club.me]_Q3 2015.torrent",
        ];
        let statsExpected = {
            files: 2,
            torrents: 2
        };

        let files = [];
        let torrents = [];

        let scanner = new TorrentScanner({target: [target]});

        let sub = scanner.onEntry.subscribe((entry) => {
            // console.log('scan', location);
            if (entry.type === 'file') {
                if (entry.isTorrent) {
                    torrents.push(entry.location);
                } else {
                    files.push(location);
                }
            }
        });

        scanner.run().then(() => {
            sub.unsubscribe();

            assertArray(files, expectedFiles);

            expect(scanner.stats).toEqual(statsExpected);

            done();
        });
    });


    it('isTorrentFile', function () {

        let scanner = new TorrentScanner({target: []});

        expect(scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.torrent')).toBe(true);
        expect(scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.txt')).toBe(false);
        expect(scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.torrent.txt')).toBe(false);
    });


    it('_isExcluded', function () {

        let scanner = new FileScanner({cbFileFound: () => null});

        let tests: Array<[string, boolean]> = [
            ['/home/maksim/Projects/tlookup3/test/fixtures/t1/.skippedfolder', true],
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

function assertArray(expectedArray: any[], actualArray: any[]) {
    expect(expectedArray.length).toEqual(actualArray.length);
    for (const elem of actualArray) {
        expect(expectedArray).toContain(elem);
    }
}
