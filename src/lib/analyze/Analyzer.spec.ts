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

        const torrentLocation = '/test/sometorrent.torrent';
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

        const filesToMatch: Array<[string, number]> = [
            ['/some/folder/file1', 13],
        ];

        const foundItems = [
            {
                base: 'file1.txt',
                dir: 'sourcefolder',
                length: 13,
                torrent: torrentLocation,

                // next is added:
                match: [],
            },
            {
                base: 'file2.txt',
                dir: 'sourcefolder',
                length: 14,
                torrent: torrentLocation,

                // next is added:
                match: [],
            },
            // {
            //     base: 'file3.txt',
            //     dir: 'sourcefolder',
            //     length: 14,
            //     torrent: torrentLocation,
            //
            //     // next is added:
            //     match: [],
            // },
        ];


        it('_addToHash', function () {

            const expected = {
                'file1.txt:13': [inputArr[0]],
                'file2.txt:14': [inputArr[1]],
                'file3.txt:14': [inputArr[2]],
            };

            inputArr.forEach(input => {
                analyzer._addToHash(input);
            });
            expect(analyzer._hash).toStrictEqual(expected);

        });


        it('_matchFile', function () {

            inputArr.forEach(input => {
                analyzer._addToHash(input);
            });

            const expected = {
                'file1.txt:13': [foundItems[0]],
            };


            // console.log(analyzer._hash);
            filesToMatch.forEach(file => {
                analyzer.matchFile(file[0], file[1]);
            });
            expect(analyzer._hash['file1.txt:13']).toStrictEqual(expected['file1.txt:13']);

        });


        it('_regroupHash', function () {

            inputArr.forEach(input => {
                analyzer._addToHash(input);
            });
            filesToMatch.forEach(file => {
                analyzer.matchFile(file[0], file[1]);
            });

            //
            const expected = {
                [torrentLocation]: inputArr,
            };

            analyzer._regroupHash();
            expect(analyzer._mapping).toStrictEqual(expected);
        });


        it.skip('_makeDecision #1', function () {

            inputArr.forEach(input => {
                analyzer._addToHash(input);
            });
            filesToMatch.forEach(file => {
                analyzer.matchFile(file[0], file[1]);
            });
            analyzer._regroupHash();

            ///
            const expected = [
                {
                    torrent: torrentLocation,
                    saveTo: '/home/maksim/Projects/tlookup3/test/fixtures/t1'
                },
            ];

            analyzer._makeDecision();
            expect(analyzer._decision).toStrictEqual(expected);

        });
        //
        //
        // it('_makeDecision #2', function () {
        //     let mapping = {
        //         '/downloads/torrent1.torrent': [
        //             {
        //                 dir: 'dir1',
        //                 base: "file1.txt",
        //                 length: 1,
        //                 torrent: '/downloads/torrent1.torrent',
        //
        //                 match: [
        //                     '/downloads/data1',
        //                     '/downloads/data2'
        //                 ]
        //             }, {
        //                 dir: 'dir2',
        //                 base: "file2.txt",
        //                 length: 1,
        //                 torrent: '/downloads/torrent1.torrent',
        //
        //                 match: [
        //                     '/downloads/data2'
        //                 ]
        //             }
        //         ],
        //         '/downloads/torrent2.torrent': [
        //             // no matter
        //         ]
        //     };
        //
        //     let expected = [{
        //         torrent: '/downloads/torrent1.torrent',
        //         saveTo: '/downloads/data2'
        //     }, {
        //         torrent: '/downloads/torrent2.torrent',
        //         saveTo: undefined
        //     }];
        //
        //     let a = new Analyzer();
        //     a._mapping = mapping;
        //     let maps = a._makeDecision();
        //     assert.deepEqual(maps, expected);
        //
        // });

    });


    // it('_saveJson', function () {
    //     let a = new Analyzer();
    //     a._decision = [1, 2, 3];
    //     return a.saveTo(target + '/decision.json');
    // });

});
