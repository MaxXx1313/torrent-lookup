import { TorrentScanner } from './TorrentScanner';
import { FileScanner } from './FileScanner';
import { expect } from '@jest/globals';



describe('TorrentScanner.e2e', function () {

    let target = __dirname + '/../../../test/fixtures/t1';

    it('simple scan', function (done) {

        let expectedFiles = [
            target + "/Sheltered [rutracker.org].t5364696.torrent:41955",
            target + "/[NNM-Club.me]_Q3 2015.torrent:97896",
            target + "/gog_sheltered_2.1.0.2.sh:271816803",
            target + "/subfolder/test1.txt:1"
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

        const scanner = new TorrentScanner({target: [target]});

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
            assertArray(torrents, expectedTorrents);

            expect(scanner.stats).toEqual(statsExpected);

            done();
        });
    });


});

function assertArray(expectedArray: any[], actualArray: any[]) {
    expect(expectedArray.length).toEqual(actualArray.length);
    for (const elem of actualArray) {
        expect(expectedArray).toContain(elem);
    }
}
