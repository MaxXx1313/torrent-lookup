const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');

const Scanner = require('./lib/TorrentScanner').TorrentScanner;

const LopConsole = require('./lib/LopConsole');
let logger = new LopConsole();


const OPERATION_SCAN = 'scan';

/**
 *
 */
const optionDefinitions = [
  { name: 'operation', type: String, defaultOption: true , description:'Operation. one of \'scan\', TODO '},
  // { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'help', alias: 'h', type: Boolean, description:'print help' },

  // for scanner:
  { name: 'target', alias: 't', type: String, group:'scanner', description:'scan folder' },

  { name: 'data',   alias: 'd', type: String, group:'scanner',
    defaultValue: 'tmp/files.bin', description: 'file to save indexed content' },

  { name: 'tdata',              type: String, group:'scanner',
    defaultValue: 'tmp/torrents.bin'  , description: 'file to save torrent file list' },
];



const options = commandLineArgs(optionDefinitions);

// console.log(options);
if(options.help || !options._none.operation){
  usage();
  return;
}

switch(options._none.operation){

  case OPERATION_SCAN:
    startScan(options.scanner);
    break;

  default:
    console.error('Unknown operation: %s', options._none.operation);
}


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
      header: 'Options',
      optionList: optionDefinitions,
      group:'_none'
    },
    {
      header: 'Scanner options',
      optionList: optionDefinitions,
      group:'scanner'
    }
  ]
  const usageTxt = getUsage(sections);
  console.log(usageTxt);
}


/**
 *
 */
function startScan(options){

  if(!options.target){
    console.log('location must be set');
    return;
  }

  let scanner = new Scanner(options);

  scanner.scan(options.target);
  scanner.on('scan', function(location){
    logger.logLOP(location);
  });

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
  });
}