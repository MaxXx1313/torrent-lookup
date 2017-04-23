
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
      return analyzer.analyze()
        .then(()=>{

        });
  });


  it('_loadTorrentFile - single file', function(){

      var analyzer = new Analyzer();

      var data = analyzer._loadTorrentFile(__dirname + '/fixtures/t1' + '/Sheltered [rutracker.org].t5364696.torrent');

      var expected = [{
        dir: '',
        base: 'gog_sheltered_2.1.0.2.sh',
        length: 271816803,
        torrent: __dirname + '/fixtures/t1/Sheltered [rutracker.org].t5364696.torrent'
      }];
      // console.log(data);
      assert.deepEqual( data, expected );


  });


  it('_loadTorrentFile - no file', function(){

      var analyzer = new Analyzer();

      assert.throws(function(){

        analyzer._loadTorrentFile(__dirname + '/fixtures/t1' + '/nonexistedFile.torrent');
        // console.log(e);

      }, function(e) {
        assert.equal( e.code, 'ENOENT' );
        return true;
      });



  });


  it('_loadTorrentFile - many files', function(){

      var analyzer = new Analyzer();

      var data = analyzer._loadTorrentFile(__dirname + '/fixtures/t1' + '/[NNM-Club.me]_Q3 2015.torrent');

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

    let location = '/test/sometorrent.torrent';
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

  it('pushRelative', function(){

    var analyzer = new Analyzer();

    assert.equal( analyzer.pushRelative('/a/b/c1.txt'), '/a/b/c1.txt', 'first item should be absolute path' );
    assert.equal( analyzer.pushRelative('c2.txt'),      '/a/b/c2.txt' );
    assert.equal( analyzer.pushRelative('../c3.txt'),   '/a/c3.txt' );
    assert.equal( analyzer.pushRelative('b/c4.txt'),    '/a/b/c4.txt' );

  });


  describe('Matching stuff', function(){

    var analyzer = new Analyzer();

    let torrentLocation = '/test/sometorrent.torrent';
    let inputArr = [{
        dir:'folder1/Russian/mods/russian/scripts/screens',
        base:'UpdateRussianDialog.lua',
        length: 11160987,
        torrent: torrentLocation
      }, {
        dir:'',
        base: "gog_sheltered_2.1.0.2.sh",
        length: 271816803,
        torrent: torrentLocation
      }, {
        dir:'folder1/Азия и Закавказье',
        base:'aze20151005.nm7',
        length: 26458135,
        torrent: torrentLocation
      }];



    let filesToMatch = [
      ['/home/maksim/Projects/tlookup3/test/fixtures/t1/gog_sheltered_2.1.0.2.sh', 271816803],
      ['/home/maksim/Downloads/Q3 2015/Содружество и Скандинавия/earth20151005.nm7', 1717822],
      ['/home/maksim/somenonexisted', 123]
    ];

    let foundItems = [
      inputArr[0],
      {
        dir:'',
        base: "gog_sheltered_2.1.0.2.sh",
        length: 271816803,
        torrent: torrentLocation,

        // next is added:
        match:[
          path.dirname( filesToMatch[0][0] )
        ]
      },
      inputArr[2]
    ];


    it('_addToHash', function(){

      let expected = {
        'UpdateRussianDialog.lua:11160987': [inputArr[0]],
        'gog_sheltered_2.1.0.2.sh:271816803': [inputArr[1]],
        'aze20151005.nm7:26458135': [inputArr[2]]
      };

      inputArr.forEach(input=>{
        analyzer._addToHash(input);
      });
      assert.deepEqual(analyzer._hash, expected);

    });


    it('_matchFile', function(){

      let expected = {
        'UpdateRussianDialog.lua:11160987': [foundItems[0]],
        'gog_sheltered_2.1.0.2.sh:271816803': [foundItems[1]],
        'aze20151005.nm7:26458135': [foundItems[2]]
      };



      // console.log(analyzer._hash);
      filesToMatch.forEach(file=>{
        analyzer._matchFile(file[0], file[1]);
      });
      assert.deepEqual(analyzer._hash, expected);

    });



    it('_regroupHash', function(){

      let expected = {};
      expected[torrentLocation] = foundItems;

      analyzer._regroupHash();
      assert.deepEqual(analyzer._mapping, expected);
    });


    it('_makeDecision #1', function(){
      let expected = [{
        torrent:torrentLocation,
        saveTo : '/home/maksim/Projects/tlookup3/test/fixtures/t1'
      }];


      let maps = analyzer._makeDecision();
      assert.deepEqual(maps, expected);

    });


    it('_makeDecision #2', function(){
      let mapping = {
        '/downloads/torrent1.torrent' : [
            {
              dir:'dir1',
              base: "file1.txt",
              length: 1,
              torrent: '/downloads/torrent1.torrent',

              match:[
                '/downloads/data1',
                '/downloads/data2'
              ]
            }, {
              dir:'dir2',
              base: "file2.txt",
              length: 1,
              torrent: '/downloads/torrent1.torrent',

              match:[
                '/downloads/data2'
              ]
            }
        ],
        '/downloads/torrent2.torrent' : [
          // no matter
        ]
      };

      let expected = [{
        torrent : '/downloads/torrent1.torrent',
        saveTo: '/downloads/data2'
      },{
        torrent : '/downloads/torrent2.torrent',
        saveTo: undefined
      }];

      let a = new Analyzer();
      a._mapping = mapping;
      let maps = a._makeDecision();
      assert.deepEqual(maps, expected);

    });

  });


  it('_saveJson', function(){
    let a = new Analyzer();
    a._decision = [1,2,3];
    return a.saveTo(target+'/decision.json');
  });



});

