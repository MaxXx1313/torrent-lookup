import { describe, test, beforeEach } from "bun:test";
import { Analyzer } from './Analyzer';
import path from 'path';
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
                name: 'file1.txt',
                dir: 'sourcefolder',
                length: 13,
                torrentFileLocation: torrentLocation,
                match: [],
            },
            {
                name: 'file2.txt',
                dir: 'sourcefolder',
                length: 14,
                torrentFileLocation: torrentLocation,
                match: [],
            },
            {
                name: 'file3.txt',
                dir: 'sourcefolder',
                length: 14,
                torrentFileLocation: torrentLocation,
                match: [],
            },
        ];


        test('loadTorrentFileSync', function () {
            const expected = {
                'file1.txt:13': [inputArr[0]],
                'file2.txt:14': [inputArr[1]],
                'file3.txt:14': [inputArr[2]],
            };
            analyzer.__loadTorrentFile(torrentLocation);
            assert.deepEqual(analyzer._hash, expected);
        });


        test('matchFile', function () {
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


        test('analyzeCacheData', function () {

            analyzer.__loadTorrentFile(torrentLocation);
            for (const fileInfo of filesToMatch) {
                analyzer.__matchFile(fileInfo.name, fileInfo.size);
            }

            ///
            const expected = [
                {
                    torrent: torrentLocation,
                    saveTo: '/firstpath',
                    saveToOptions: [
                        '/firstpath',
                        '/secondpath'
                    ],
                },
            ];

            analyzer._makeDecision();
            assert.deepEqual(analyzer._decision, expected);
        });
    });

});
