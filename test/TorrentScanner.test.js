
const TorrentScanner = require('../lib/TorrentScanner').TorrentScanner;
const assert = require('assert');
const path = require('path');

describe('TorrentScanner', function(){


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

