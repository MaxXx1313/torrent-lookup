

import { debounce, tick } from "../lib/utils/tools";

import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import * as assert from 'assert';


import * as LopConsole from '../lib/LopConsole';
const logger = new LopConsole();


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

    { name: 'o', type: String,
        description: 'client app options (for ex.: "-o endpoint=localhost:8080"). Look into documentation for the client app for details ' },
];


const options = commandLineArgs(optionDefinitions);

// console.log(options);
if(options.help || !options.operation){
    usage();
    process.exit(0);
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


// stubs!
class Scanner {_stats:any; constructor(...args){} scan(...args){} on(...args){}}
class Analyzer {constructor(...args){} analyze(...args):Promise<any>{return Promise.resolve(null)} on(...args){}}
class PushManager {constructor(...args){} pushAll(...args):Promise<any>{return Promise.resolve(null)} on(...args){}}

////////////////////////////////////////////////////

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
            header: 'Options',
            optionList: optionDefinitions,
            // group:'_none'
        },
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

        {
            header: 'Clients',
            content:[
                'Most clients require remote access to be enabled!',
                '',
                '[bold]{t} or [bold]{transmission} - Transmission app',
            ]
        },
    ];
    const usageTxt = commandLineUsage(sections);
    console.log(usageTxt);
}



/**
 *
 */
interface ScanCliOptions {
    /**
     * scan folder location
     */
    target: string;
}


/**
 *
 */
function scanFiles(options: ScanCliOptions) {

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

    return scanner;
}


/**
 *
 */
interface AnalyzeCliOptions {
    /**
     * project folder location
     */
    target: string;
}

/**
 *
 */
function analyzeTorrents(options: AnalyzeCliOptions){
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
interface PushCliOptions {
    /**
     * project folder location
     */
    target: string;
    client: string;
    o: any;
}


/**
 *
 */
function pushTorrents(options: PushCliOptions){
    assert.ok(options.client, 'Client must be set. use -c|--client to make it');

    tick();
    let client = new PushManager(options.client, options);
    _bindEventListeners(client);
    client.pushAll().then(()=>{
        logger.log(' Done in %s ms', tick() );
    });
}


/**
 * @param target
 * @private
 */
function _bindEventListeners(target){

    target.on('opStatus', function(status){
        logger.log('  ' + status);
    });

}




