import { Analyzer } from './Analyzer';
import path from 'node:path';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import assert from 'node:assert';


describe('Analyzer.e2e', function () {

    // normalize path
    const workdir = path.resolve(__dirname + '/../../../test/analyzer');
    const assetsPath = path.resolve(__dirname + '/../../../test/fixtures');

    it('simple analyze', function () {
        const analyzer = new Analyzer({
            workdir: workdir,
        });

        let eventsExpected = [
            'Hashing data',
            'Matching files',
            'Hashing',
            'Analyzing',
            'Saving'
        ];

        let events = [];
        let addEvent = function (msg) {
            events.push(msg);
        };

        analyzer.opStatus.subscribe(addEvent);

        return analyzer.analyze()
            .then(() => {
                const dataExpected = fs.readFileSync(workdir + '/maps.expected.json');
                const data = fs.readFileSync(workdir + '/maps.json');

                const mapExpected = JSON.parse(dataExpected.toString());
                const mapActual = JSON.parse(data.toString());

                for (let i = 0; i < mapExpected.length; i++) {
                    expectChildPath(assetsPath, mapExpected[i].saveTo, mapActual[i].saveTo);
                    expectChildPath(assetsPath, mapExpected[i].torrent, mapActual[i].torrent);
                }
                assert.equal(mapExpected.length, mapActual.length);
            });
    });


    it('_loadTorrentFileSync - single file', async function () {

        const analyzer = new Analyzer();

        await analyzer.loadTorrentFile(assetsPath + '/t1/fixture1 - test1.txt.torrent');

        const expected = {
            'test1.txt:13': [{
                dir: '',
                base: 'test1.txt',
                length: 13,
                torrent: assetsPath + '/t1/fixture1 - test1.txt.torrent',
                match: [],
            }],
        };
        assert.deepEqual(analyzer._hash, expected);


    });


    it('_loadTorrentFileSync - many files', async function () {

        const analyzer = new Analyzer();

        await analyzer.loadTorrentFile(assetsPath + '/t2/fixture2 - sourcefolder.torrent');

        // console.log(data);
        const expectedFiles = {
            'file1.txt:13': [{
                base: 'file1.txt',
                dir: 'sourcefolder',
                length: 13,
                torrent: assetsPath + '/t2/fixture2 - sourcefolder.torrent',
                match: [],
            }],
            'file2.txt:14': [{
                base: 'file2.txt',
                dir: 'sourcefolder',
                length: 14,
                torrent: assetsPath + '/t2/fixture2 - sourcefolder.torrent',
                match: [],
            }],
            'file3.txt:14': [{
                base: 'file3.txt',
                dir: 'sourcefolder',
                length: 14,
                torrent: assetsPath + '/t2/fixture2 - sourcefolder.torrent',
                match: [],
            }]
        };

        assert.deepEqual(analyzer._hash, expectedFiles);
    });


    it('_loadTorrentFileSync - no file', function () {

        const analyzer = new Analyzer();

        analyzer.loadTorrentFile(assetsPath + '/t1/nonexistedFile.torrent')
            .then(() => {
                assert.fail('Should not succeed');
            })


    });


});

function expectChildPath(basepath: string, expected: string, actual: string) {
    if (!expected.startsWith(basepath)) {
        throw new Error(`Expected is not a subpath of "${basepath}": ${expected}`);
    }
    if (!actual.startsWith(basepath)) {
        throw new Error(`Actual is not a subpath of "${basepath}": ${actual}`);
    }
    const childExpected = expected.substr(basepath.length);
    const childActual = expected.substr(basepath.length);
    expect(childExpected).toBe(childActual);
}
