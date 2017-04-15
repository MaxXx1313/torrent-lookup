
const TorrentScanner = require('../lib/TorrentScanner').TorrentScanner;
const assert = require('assert');
const path = require('path');


describe('TorrentScanner', function(){

  it('simple scan', function(done){
    let target = __dirname + '/fixtures';

    let expectedTagets = [
      __dirname+ '/fixtures',
      __dirname+ '/fixtures/t1'
    ];
    let expectedFiles = [
      __dirname+ "/fixtures/Sheltered [rutracker.org].t5364696.torrent:41955",
      __dirname+ "/fixtures/[NNM-Club.me]_Q3 2015.torrent:97896",
      __dirname+ "/fixtures/gog_sheltered_2.1.0.2.sh:271816803",
      __dirname+ "/fixtures/t1/test1.txt:1"
    ];
    let expectedFolders = [
      __dirname+ "/fixtures/t1:-1"
    ];

    let expectedTorrents = [
      __dirname+ "/fixtures/Sheltered [rutracker.org].t5364696.torrent",
      __dirname+ "/fixtures/[NNM-Club.me]_Q3 2015.torrent",
    ];

    let targets = [];
    let files = [];
    let torrents = [];
    let folders = [];

    let scanner = new TorrentScanner();
    scanner.scan(target);

    scanner.on('scan', function(location){
      // console.log('scan', location);
      targets.push(location);
    });
    scanner.on('file', function(location, stats){
      // console.log('file', location, stats);
      files.push(location + ':' + stats.size);
    });
    scanner.on('torrentfile', function(location, stats){
      // console.log('file', location, stats);
      torrents.push(location);
    });
    scanner.on('folder', function(location, stats){
      // console.log('folder', location, stats);
      folders.push(location + ':' + '-1');
    });


    scanner.on('end', _onEnd);

    function _onEnd(){
      scanner.off('end', _onEnd);
      scanner.on('end', _onEndTwice);

      assert.deepEqual(targets, expectedTagets, 'match scan targets');
      assert.deepEqual(files, expectedFiles, 'match files');
      assert.deepEqual(torrents, expectedTorrents, 'match torrent files');
      assert.deepEqual(folders, expectedFolders, 'match folders');

      done();
    }
    function _onEndTwice(){
      asser.fail('"end" event fired more than once');
    }

  });



  it('isTorrentFile', function(){

    let scanner = new TorrentScanner();

    assert.equal( scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.torrent'), true );
    assert.equal( scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.txt'), false );
    assert.equal( scanner.isTorrentFile('/fixtures/[NNM-Club.me]_Q3 2015.torrent.txt'), false );
  });


  it('shiftRelative', function(){

    let scanner = new TorrentScanner();

    assert.equal( scanner.shiftRelative('/a/b/c1.txt'), '/a/b/c1.txt', 'first item should be absolute path' );
    assert.equal( scanner.shiftRelative('/a/b/c2.txt'), 'c2.txt' );
    assert.equal( scanner.shiftRelative('/a/c3.txt'),   '../c3.txt' );
    assert.equal( scanner.shiftRelative('/a/b/c4.txt'), 'b/c4.txt' );

  });

});

