const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const assert = require('assert');

const Scanner = require('./lib/TorrentScanner').TorrentScanner;
const Analyzer = require('./lib/Analyzer').Analyzer;
const debounce = require('./lib/tools').debounce;
const PushManager = require('./lib/push/PushManager').PushManager;

const LopConsole = require('./lib/LopConsole');
let logger = new LopConsole();


const OPERATION_SCAN = 'scan';
const OPERATION_ANALYZE = 'analyze';
const OPERATION_PUSH = 'push';

/**
 *
 */
const optionDefinitions = [
  { name: 'operation', type: String, defaultOption: true ,
    description:'Operation. one of \'scan\', \'analyze\' TODO '},
  // { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'help', alias: 'h', type: Boolean,
    description:'print help' },

  // for scanner:
  { name: 'target', alias: 't', type: String,
    description:'scan folder' },

  { name: 'data',   alias: 'd', type: String,
    defaultValue: '/tmp', description: 'folder to save data' },

  { name: 'client',   alias: 'c', type: String,
    description: 'client app to push torrents' },

  { name: 'host',   alias: 'w', type: String,
    description: 'client app endpoint (vary from clients' },
];



/**
 * Print usage
 */
function usage(){
  const sections = [
    {
      header: 'tlookup',
      content: 'Scan files and match torrent files'
    },
    {
      header: 'Operation',
      content:[
        '[bold]{scan} - scan files',
        '[bold]{analyze} - analyze the result files',
        '[bold]{push} - push torrents to app'
      ]
    },
    {
      header: 'Clients',
      content:[
        'Most clients require remote access to be enabled!',
        '',
        '[bold]{t} or [bold]{transmission} - Transmission app',
      ]
    },
    {
      header: 'Options',
      optionList: optionDefinitions,
      // group:'_none'
    }
    // {
    //   header: 'Scanner options',
    //   optionList: optionDefinitions,
    //   group:'scanner'
    // },
    // {
    //   header: 'Analyzer options',
    //   optionList: optionDefinitions,
    //   group:'analyzer'
    // }
  ]
  const usageTxt = getUsage(sections);
  console.log(usageTxt);
}


let _tic_time = 0;
function tick(){
  let t = _tic_time;
  _tic_time = Date.now();
  return _tic_time - t;
}

////////////////////////////////////////////////////


const options = commandLineArgs(optionDefinitions);

// console.log(options);
if(options.help || !options.operation){
  usage();
  return;
}

switch(options.operation){

  case OPERATION_SCAN:
    scanFiles(options);
    break;

  case OPERATION_ANALYZE:
    analyzeTorrents(options);
    break;

  case OPERATION_PUSH:
    pushTorrents(options);
    break;

  default:
    console.error('Unknown operation: %s', options.operation);
}



/**
 *
 */
function scanFiles(options){

  assert.ok(options.target);

  let scanner = new Scanner(options);


  scanner.scan(options.target);
  scanner.on('scan', debounce(function(location){
      logger.logLOP(location);
  }, 1000));

  // TODO: if progress:
  scanner.on('start', function(){
    logger.startLOP('scanning');
  });
  scanner.on('torrentfile', function(location){
    logger.log('Torrent file found:', location);
  });
  scanner.on('end', function(){
    logger.stopLOP();
  });


  scanner.on('end', function(){
    logger.log('Finished in %s sec', logger.elapsedLOP() );
    logger.log('  Scanned %s files, found %s torrent files', scanner._stats.files, scanner._stats.torrents );
  });
}



/**
 *
 */
function analyzeTorrents(options){
  // assert.ok(options.data)
  // assert.ok(options.tdata)
  tick();
  var analyzer = new Analyzer(options);
  _bindEventListeners(analyzer);
  analyzer.analyze().then(()=>{

    logger.log(' Done in %s ms', tick() );
  });
}




/**
 *
 */

function pushTorrents(options){
  assert.ok(options.client, 'Client must be set. use -c|--client to make it');

  tick();
  let client = new PushManager(options.client, options);
  _bindEventListeners(client);
  client.pushAll().then(()=>{
    logger.log(' Done in %s ms', tick() );
  });
}




function _bindEventListeners(target){

  target.on('opStatus', function(status){
    logger.log('  ' + status);
  });

}

