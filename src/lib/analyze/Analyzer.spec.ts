import { Analyzer } from './Analyzer';
import * as path from 'path';



/**
 * Maybe someday I'll review this, the approach is not correct
 */
describe('Analyzer', function () {

    // normalize path
    const workdir = path.resolve(__dirname + '/../../../test/analyzer');
    const assetsPath = path.resolve(__dirname + '/../../../test/fixtures');


    describe('Matching stuff', function () {

        let analyzer: Analyzer;
        beforeEach(() => {
            analyzer = new Analyzer();
        });

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
            analyzer.loadTorrentFileSync(torrentLocation);
            expect(analyzer._hash).toStrictEqual(expected);
        });


        it('matchFile', function () {
            analyzer.loadTorrentFileSync(torrentLocation);

            const filesToMatch = [
                {name: '/somepath/sourcefolder/file1.txt', size: 13},
                {name: '/secondpath/sourcefolder/file1.txt', size: 13},
                {name: '/otherpath/wrongfolder/file1.txt', size: 13},
            ];
            const expected = {
                ...inputArr[0],
                match: ['/somepath', '/secondpath'],
            };

            for (const fileInfo of filesToMatch) {
                analyzer.matchFile(fileInfo.name, fileInfo.size);
            }
            expect(analyzer._hash['file1.txt:13']).toStrictEqual([expected]);

        });


        it('analyzeCacheData', function () {

            analyzer.loadTorrentFileSync(torrentLocation);
            const filesToMatch = [
                {name: '/somepath/sourcefolder/file1.txt', size: 13},
                {name: '/somepath/sourcefolder/file2.txt', size: 14},
                {name: '/otherpath/sourcefolder/file1.txt', size: 13},
            ];
            for (const fileInfo of filesToMatch) {
                analyzer.matchFile(fileInfo.name, fileInfo.size);
            }

            ///
            const expected = [
                {
                    torrent: torrentLocation,
                    saveTo: '/somepath'
                },
            ];

            analyzer.analyzeCacheData();
            expect(analyzer._decision).toStrictEqual(expected);
        });
    });

});
