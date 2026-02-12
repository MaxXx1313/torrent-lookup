import { TorrentScanner } from './TorrentScanner';
import * as path from 'node:path';
import { describe, it } from 'bun:test';
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
            target + "/t2-alt/sourcefolder/file1.txt",
        ];

        const expectedTorrents = [
            target + "/t1/fixture1 - test1.txt.torrent",
            target + "/t2/fixture2 - sourcefolder.torrent",
        ];
        const statsExpected = {
            files: 5,
            torrents: 2,
        };

        let files = [];
        let torrents = [];

        const scanner = new TorrentScanner();
        const sub = scanner.onEntry.subscribe((entry) => {
            console.log('scan', entry.location);
            if (entry.isTorrent) {
                torrents.push(entry.location);
            } else {
                files.push(entry.location);
            }
        });

        scanner.run(target).then(() => {
            console.log('scan finished');
            sub.unsubscribe();

            assertArray(files, expectedFiles);
            assertArray(torrents, expectedTorrents);

            assert.deepEqual({
                files: scanner.stats.files,
                torrents: scanner.stats.torrents,
            }, statsExpected);

            done();
        });
    });


});

/**
 *
 */
function assertArray(expectedArray: any[], actualArray: any[]) {
    for (const elem of actualArray) {
        assert.equal(expectedArray.includes(elem), true, `Element not expected: ${elem}`);
    }
    for (const elem of expectedArray) {
        assert.equal(actualArray.includes(elem), true, `Element not found: ${elem}`);
    }
    assert.equal(expectedArray.length, actualArray.length);
}
