
const Analyzer = require('../lib/Analyzer').Analyzer;
const assert = require('assert');
const path = require('path');


describe('Analyzer', function(){
  this.timeout(5000);

  let target = __dirname + '/fixtures/t2';


  it('simple analyze', function(){
      var analyzer = new Analyzer({
        data:  target+ '/files.bin',
        tdata: target+ '/torrents.bin',
      });
      return analyzer.analyze();
  });


  it('loadTorrentFile - single file', function(){

      var analyzer = new Analyzer();

      var data = analyzer.loadTorrentFile(__dirname + '/fixtures/t1' + '/Sheltered [rutracker.org].t5364696.torrent');

      var expected = [{
        dir: '',
        base: 'gog_sheltered_2.1.0.2.sh',
        length: 271816803,
        torrent: __dirname + '/fixtures/t1/Sheltered [rutracker.org].t5364696.torrent'
      }];
      // console.log(data);
      assert.deepEqual( data, expected );


  });


  it('loadTorrentFile - no file', function(){

      var analyzer = new Analyzer();

      assert.throws(function(){

        analyzer.loadTorrentFile(__dirname + '/fixtures/t1' + '/nonexistedFile.torrent');
        // console.log(e);

      }, function(e) {
        assert.equal( e.code, 'ENOENT' );
        return true;
      });



  });


  it('loadTorrentFile - many files', function(){

      var analyzer = new Analyzer();

      var data = analyzer.loadTorrentFile(__dirname + '/fixtures/t1' + '/[NNM-Club.me]_Q3 2015.torrent');

      // console.log(data);
      var expected_first_three = [
        {
          base: 'arm20151003.nm7',
          dir: 'Q3 2015/Азия и Закавказье',
          length: 11160987,
          torrent: __dirname+ '/fixtures/t1/[NNM-Club.me]_Q3 2015.torrent' },
        { base: 'aze20151005.nm7',
          dir: 'Q3 2015/Азия и Закавказье',
          length: 26458135,
          torrent: __dirname+ '/fixtures/t1/[NNM-Club.me]_Q3 2015.torrent' },
        { base: 'chn20151005.nm7',
          dir: 'Q3 2015/Азия и Закавказье',
          length: 22553042,
          torrent: __dirname+ '/fixtures/t1/[NNM-Club.me]_Q3 2015.torrent' }
      ];

      assert.deepEqual( data.slice(0,3), expected_first_three );
  });



  it('_grabTorrentData', function(){
    var analyzer = new Analyzer();
    var getData = analyzer._grabTorrentData; // fn

    let location = '/test';
    let input1 = {
      "encoding": "UTF-8",
      "info": {
        "length": 271816803,
        "name": "gog_sheltered_2.1.0.2.sh"
      }
    };

    let expected1 = [{
      dir:'',
      base:'gog_sheltered_2.1.0.2.sh',
      length: 271816803,
      torrent: location
    }];

    let input2 = {
      "encoding": "UTF-8",
      "info": {
        "length": 271816803,
        "name": "folder1",
        "files":[
          {
            "length": 11160987,
            "path": [
              "Russian",
              "mods",
              "russian",
              "scripts",
              "screens",
              "UpdateRussianDialog.lua"
            ]
          },
          {
            "length": 26458135,
            "path": [
              "Азия и Закавказье",
              "aze20151005.nm7"
            ]
          }
        ]
      }
    }

    let expected2 = [{
      dir:'folder1/Russian/mods/russian/scripts/screens',
      base:'UpdateRussianDialog.lua',
      length: 11160987,
      torrent: location
    },
    {
      dir:'folder1/Азия и Закавказье',
      base:'aze20151005.nm7',
      length: 26458135,
      torrent: location
    }];


    assert.deepEqual( getData(input1, location), expected1, 'single file');
    assert.deepEqual( getData(input2, location), expected2, 'multiple files');

  });



});

