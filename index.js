const commandLineArgs = require('command-line-args');

const Scanner = require('./lib/TorrentScanner').TorrentScanner;

const LopConsole = require('./lib/LopConsole');
let logger = new LopConsole();

const OPERATION_SCAN = 'scan';
const optionDefinitions = [
  { name: 'operation', type: String, defaultOption: true },
  // { name: 'verbose', alias: 'v', type: Boolean },

  // for scanner:
  { name: 'target', alias: 't', type: String, group:'Scanner' },
  { name: 'data',   alias: 'd', type: String, group:'Scanner' },
  { name: 'tdata',              type: String, group:'Scanner' },
];

const options = commandLineArgs(optionDefinitions);


switch(options.operation){

  case OPERATION_SCAN:
    startScan(options);
    break;

  default:
    console.error('Unknown operation:', options.operation);
}

/**
 *
 */
function startScan(options){
  if(!options.target){
    console.error('target must be set');
    return;
  }


  let scanner = new Scanner();

  logger.startLOP('scanning');
  scanner.scan(options.target);
  scanner.on('scan', function(location){
    logger.logLOP(location);
  });
  scanner.on('end', function(location){
    logger.stopLOP();
    logger.log('Finished in %s sec', logger.elapsedLOP() );
  });
}