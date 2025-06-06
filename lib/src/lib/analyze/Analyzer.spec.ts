import { Analyzer } from './Analyzer';
import path from 'path';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';


/**
 * Maybe someday I'll review this, the approach is not correct
 */
describe('Analyzer.spec', function () {

    // normalize path
    const workdir = path.resolve(__dirname + '/../../../test/analyzer');
    const assetsPath = path.resolve(__dirname + '/../../../test/fixtures');


    describe('Matching stuff', function () {

        let analyzer: Analyzer;
        beforeEach(() => {
            analyzer = new Analyzer();
        });


        const filesToMatch = [
            {name: '/firstpath/sourcefolder/file1.txt', size: 13},
            {name: '/secondpath/sourcefolder/file1.txt', size: 13},
            {name: '/otherpath/wrongfolder/file1.txt', size: 13},
        ];

        const torrentLocation = assetsPath + '/t2/fixture2 - sourcefolder.torrent';
        const inputArr = [
            {
                base: 'file1.txt',
                dir: 'sourcefolder',
                length: 13,
                torrent: torrentLocation,
                match: [],
            },
            {
                base: 'file2.txt',
                dir: 'sourcefolder',
                length: 14,
                torrent: torrentLocation,
                match: [],
            },
            {
                base: 'file3.txt',
                dir: 'sourcefolder',
                length: 14,
                torrent: torrentLocation,
                match: [],
            },
        ];


        it('loadTorrentFileSync', function () {
            const expected = {
                'file1.txt:13': [inputArr[0]],
                'file2.txt:14': [inputArr[1]],
                'file3.txt:14': [inputArr[2]],
            };
            analyzer.__loadTorrentFile(torrentLocation);
            assert.deepEqual(analyzer._hash, expected);
        });


        it('matchFile', function () {
            analyzer.__loadTorrentFile(torrentLocation);
            const expected = {
                ...inputArr[0],
                match: ['/firstpath', '/secondpath'],
            };

            for (const fileInfo of filesToMatch) {
                analyzer.__matchFile(fileInfo.name, fileInfo.size);
            }
            assert.deepEqual(analyzer._hash['file1.txt:13'], [expected]);

        });


        it('analyzeCacheData', function () {

            analyzer.__loadTorrentFile(torrentLocation);
            for (const fileInfo of filesToMatch) {
                analyzer.__matchFile(fileInfo.name, fileInfo.size);
            }

            ///
            const expected = [
                {
                    torrent: torrentLocation,
                    saveTo: '/firstpath'
                },
            ];

            analyzer._makeDecision();
            assert.deepEqual(analyzer._decision, expected);
        });
    });

});
