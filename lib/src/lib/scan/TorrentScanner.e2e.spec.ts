import { TorrentScanner } from './TorrentScanner';
import * as path from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert';


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

            assert.equal(scanner.stats, statsExpected);

            // done();
        });
    });


});

/**
 *
 */
function assertArray(expectedArray: any[], actualArray: any[]) {
    for (const elem of actualArray) {
        assert.equal(expectedArray.includes(elem), true);
    }
    // make it easy to recognize error
    for (const elem of expectedArray) {
        assert.equal(actualArray.includes(elem), true);
    }
    assert.equal(expectedArray.length, actualArray.length);
}
