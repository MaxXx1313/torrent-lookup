
const assert = require('assert');
const PushManager = require('../lib/Pusher').PushManager;

describe('Pusher', function(){

  let torrents = {};
  let i = 0;

  let m = new PushManager('t');
  // fake push
  m._client.torrentAdd = function(location, saveTo){
    torrents[location] = saveTo;
    return Promise.resolve({id: ++i});
  }


  it('_pushAll', function(){
    let input = [
      {
        "saveTo": "/home/maksim/Downloads/1",
        "torrent": "/home/1.torrent"
      },
      {
        "saveTo": "/home/maksim/Downloads/2",
        "torrent": "/home/2.torrent"
      },
    ];

    let expected = {
      "/home/1.torrent":"/home/maksim/Downloads/1",
      "/home/2.torrent":"/home/maksim/Downloads/2"
    };

    return m._pushAll(input)
      .then(result=>{

        assert.deepEqual(torrents, expected);
      })
  })


});
