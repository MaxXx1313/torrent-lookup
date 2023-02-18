import { Pusher } from './Pusher';



/**
 * this test makes no sense
 */
describe('Pusher', function () {

    let torrents = {};
    let i = 0;

    const pushManager = new Pusher({client: 't'});

    // fake push
    pushManager.client.push = function (location, saveTo) {
        torrents[location] = saveTo;
        return Promise.resolve({id: ++i, isNew: true});
    }


    it('_pushAll', function () {
        const input = [
            {
                "saveTo": "/home/maksim/Downloads/1",
                "torrent": "/home/1.torrent"
            },
            {
                "saveTo": "/home/maksim/Downloads/2",
                "torrent": "/home/2.torrent"
            },
        ];

        const expected = {
            "/home/1.torrent": "/home/maksim/Downloads/1",
            "/home/2.torrent": "/home/maksim/Downloads/2"
        };

        return pushManager._pushAll(input)
            .then(() => {
                expect(torrents).toStrictEqual(expected);
            })
    })


});
