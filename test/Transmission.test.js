
const assert = require('assert');
const Transmission = require('../lib/push/Transmission').Transmission;

describe('Transmission', function(){

  it('ping', function(){

    /*
    let expected = {
      arguments: {
         activeTorrentCount: 3,
         'cumulative-stats':
          {
            downloadedBytes: 300992964275,
            filesAdded: 5654,
            secondsActive: 22516515,
            sessionCount: 205,
            uploadedBytes: 455158229680
          },
         'current-stats': {
            downloadedBytes: 0,
            filesAdded: 0,
            secondsActive: 3297,
            sessionCount: 1,
            uploadedBytes: 0
          },
          downloadSpeed: 0,
          pausedTorrentCount: 234,
          torrentCount: 237,
          uploadSpeed: 0
      },
      result: 'success'
    };
    */

    let t = new Transmission();
    return t.rpcRequest('session-stats')
    .then(data=>{
      // console.log(data.body)
      assert.equal(data.body.result, "success");
      assert.ok(data.body.arguments);
    })

  });




});

describe('static', function(){

  it('ping', function(){

    let tests = [
      ["application/json; charset=UTF-8", 'application/json', "UTF-8"],
      ["application/json", 'application/json', null]
    ];

    tests.forEach(test=>{
      assert.equal( Transmission.getContentType(test[0]), test[1]);
      assert.equal( Transmission.getCharset(test[0]), test[2]);
    });

  });
});