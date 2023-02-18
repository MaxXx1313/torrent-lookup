import { TorrentScanner } from './TorrentScanner';
import { expect } from '@jest/globals';



describe('TorrentScanner.e2e', function () {

    let target = __dirname + '/../../../test/fixtures/t1';

    it('simple scan', function (done) {

        const expectedFiles = [
            target + "/subfolder/test1.txt:1"
        ];

        const expectedTorrents = [
            target + "/Sheltered [rutracker.org].t5364696.torrent",
            target + "/[NNM-Club.me]_Q3 2015.torrent",
        ];
        const statsExpected = {
            files: 2,
            torrents: 2
        };

        let files = [];
        let torrents = [];

        const scanner = new TorrentScanner({
            target: [target],
        });

        const sub = scanner.onEntry.subscribe((entry) => {
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
