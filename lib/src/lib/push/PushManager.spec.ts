import { PushManager } from './PushManager';
import { describe, it } from 'node:test';
import assert from 'node:assert';


/**
 * this test makes no sense
 */
describe('Pusher.spec', function () {

    let torrents = {};
    let i = 0;

    const pushManager = new PushManager({client: 't'});

    // fake push
    pushManager.client.push = function (location, saveTo) {
        torrents[location] = saveTo;
        return Promise.resolve({id: ++i, isNew: true});
    }


    it('_pushAll', function () {
        const input = [
            {
                "saveTo": "/tmp/download-1",
                "torrent": "/tmp/1.torrent"
            },
            {
                "saveTo": "/tmp/download-2",
                "torrent": "/tmp/2.torrent"
            },
        ];

        const expected = {
            "/tmp/1.torrent": "/tmp/download-1",
            "/tmp/2.torrent": "/tmp/download-2"
        };

        return pushManager._pushAll(input)
            .then(() => {
                assert.deepEqual(torrents, expected);
            })
    })


});
