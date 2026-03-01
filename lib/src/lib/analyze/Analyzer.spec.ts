import { beforeEach, describe, test } from "bun:test";
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

        const torrentFile1 = assetsPath + '/t1/fixture1 - test1.txt.torrent';
        const torrentFile1Copy = assetsPath + '/t1/fixture1 - test1.txt-copy.torrent';
        const torrentFile2 = assetsPath + '/t2/fixture2 - sourcefolder.torrent';

        const torrent1Hash = '38f94a70451b361e7e83af8888447aad';
        const torrent2Hash = 'afc459db274e2b15c88af762a258ab44';

        const inputArr = [
            {
                tFilename: 'file1.txt',
                tFolder: ['sourcefolder'],
                tSize: 13,
                torrentFileLocation: torrentFile2,
                torrentContentHash: torrent2Hash,
                pathMatch: [],
            },
            {
                tFilename: 'file2.txt',
                tFolder: ['sourcefolder'],
                tSize: 14,
                torrentFileLocation: torrentFile2,
                torrentContentHash: torrent2Hash,
                pathMatch: [],
            },
            {
                tFilename: 'file3.txt',
                tFolder: ['sourcefolder'],
                tSize: 14,
                torrentFileLocation: torrentFile2,
                torrentContentHash: torrent2Hash,
                pathMatch: [],
            },
        ];


        test('loadTorrentFileSync', function () {
            const expected = {
                'file1.txt:13': [inputArr[0]],
                'file2.txt:14': [inputArr[1]],
                'file3.txt:14': [inputArr[2]],
            };
            analyzer.__loadTorrentFile(torrentFile2);
            assert.deepEqual(analyzer._hashByFileSize, expected);
        });


        test('matchFile', function () {
            analyzer.__loadTorrentFile(torrentFile2);
            const expected = {
                ...inputArr[0],
                pathMatch: [
                    {
                        basepath: '/firstpath',
                        filepath: 'sourcefolder/file1.txt'
                    },
                    {
                        basepath: '/secondpath',
                        filepath: 'sourcefolder/file1.txt'
                    },
                ],
            };

            for (const fileInfo of filesToMatch) {
                analyzer.__matchFile(fileInfo.name, fileInfo.size);
            }
            assert.deepEqual(analyzer._hashByFileSize['file1.txt:13'][0], expected);

        });


        test('analyzeCacheData', function () {

            analyzer.__loadTorrentFile(torrentFile1);
            analyzer.__loadTorrentFile(torrentFile1Copy);
            analyzer.__loadTorrentFile(torrentFile2);
            for (const fileInfo of filesToMatch) {
                analyzer.__matchFile(fileInfo.name, fileInfo.size);
            }

            ///
            const expected1 = {
                torrentContentHash: torrent1Hash,
                torrentLocation: torrentFile1,
                torrentsDuplicatedLocation: [torrentFile1Copy],
                saveTo: undefined,
                saveToOptions: [],
            };

            const expected2 = {
                torrentContentHash: torrent2Hash,
                torrentLocation: torrentFile2,
                torrentsDuplicatedLocation: [],

                saveTo: {
                    saveTo: '/firstpath',
                    score: 1,
                    filesWanted: [
                        'sourcefolder/file1.txt',
                    ],
                    filesUnwanted: [
                        'sourcefolder/file2.txt',
                        'sourcefolder/file3.txt'
                    ],
                },
                saveToOptions: [
                    {
                        saveTo: '/firstpath',
                        score: 1,
                        filesWanted: [
                            'sourcefolder/file1.txt',
                        ],
                        filesUnwanted: [
                            'sourcefolder/file2.txt',
                            'sourcefolder/file3.txt'
                        ],
                    },
                    {
                        saveTo: '/secondpath',
                        score: 1,
                        filesWanted: [
                            'sourcefolder/file1.txt',
                        ],
                        filesUnwanted: [
                            'sourcefolder/file2.txt',
                            'sourcefolder/file3.txt'
                        ],
                    },
                ],
            };

            analyzer._makeDecision();

            // console.log(analyzer._decision[0]);

            //
            const mapping2Result = analyzer._decision.find(d => d.torrentLocation === torrentFile2);
            assert.deepEqual(mapping2Result.saveToOptions, expected2.saveToOptions);
            assert.deepEqual(mapping2Result, expected2);

            //
            const mapping1Result = analyzer._decision.find(d => d.torrentLocation === torrentFile1);
            assert.deepEqual(mapping1Result, expected1);
        });
    });

});
