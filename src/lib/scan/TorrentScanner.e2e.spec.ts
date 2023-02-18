import { TorrentScanner } from './TorrentScanner';
import { expect } from '@jest/globals';
import * as path from 'path';



describe('TorrentScanner.e2e', function () {

    // normalize path
    const target = path.resolve(__dirname + '/../../../test/fixtures');

    it('simple scan', function (done) {

        const expectedFiles = [
            target + "/t1/sourcefile/test1.txt",
            target + "/t2/sourcefolder/file1.txt",
            target + "/t2/sourcefolder/file2.txt",
            target + "/t2/sourcefolder/file3.txt",
        ];

        const expectedTorrents = [
            target + "/t1/fixture1 - test1.txt.torrent",
            target + "/t2/fixture2 - sourcefolder.torrent",
        ];
        const statsExpected = {
            files: 4,
            torrents: 2,
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
                    files.push(entry.location);
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
    for (const elem of actualArray) {
        expect(expectedArray).toContain(elem);
    }
    // make it easy to recognize error
    for (const elem of expectedArray) {
        expect(actualArray).toContain(elem);
    }
    expect(expectedArray.length).toEqual(actualArray.length);
}
