import { debounce, tick } from "../lib/utils/tools";

import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import * as assert from 'assert';


import { TorrentScanner, TorrentScannerEntry } from "../TorrentScanner";
import { DEFAULT_WORKDIR_LOCATION } from "../lib/const";
import { Analyzer } from "../Analyzer";
import { Pusher } from "../lib/Pusher";

const LopConsole = require('../lib/LopConsole');
const logger = new LopConsole();


const OPERATION_SCAN = 'scan';

const OPERATION_ANALYZE = 'analyze';
const OPERATION_PUSH = 'push';


/**
 *
 */
interface CliOptions {
    operation: string;
    help: boolean;

    target: string;
    tmp: string;
    client: string;
    o: any[];
}


/**
 *
 */
const optionDefinitions = [
    {
        name: 'operation', type: String, defaultOption: true,
        description: 'Operation. one of \'scan\', \'analyze\' TODO '
    },

    // { name: 'verbose', alias: 'v', type: Boolean },
    {
        name: 'help', alias: 'h', type: Boolean,
        description: 'print help'
    },

    // for scanner:
    {
        name: 'target', alias: 't', type: String,
        multiple: true,
        description: 'scan folder'
    },

    {
        name: 'tmp', type: String,
        defaultValue: DEFAULT_WORKDIR_LOCATION, description: 'folder to save data'
    },

    {
        name: 'client', alias: 'c', type: String,
        description: 'client app to push torrents'
    },

    {
        name: 'option', alias: 'o', type: String,
        multiple: true,
        description: 'client app options (for ex.: "-o endpoint=localhost:8080"). Look into documentation for the client app for details '
    },
];


const options = commandLineArgs(optionDefinitions);
options.option = parseOptions(options.option || []);
// console.log(options);

if (options.help || !options.operation) {
    usage();
    process.exit(0);
}

switch (options.operation) {

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

////////////////////////////////////////////////////


/**
 * Print usage
 */
function usage() {
    const sections = [
        {
            header: 'Usage',
            content: '$ tlookup [bold]{operation} [bold]{--target|-t}=<DIR> [-d|-o|-h]'
        },
        {
            header: 'Description',
            content: 'Scan files and match torrent files'
        },
        {
            header: 'Operation',
            content: [
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
            content: [
                'Most clients require remote access to be enabled!',
                '',
                '[bold]{t} or [bold]{transmission} - Transmission app',
            ]
        },
        {
            header: 'Examples',
            content: '$ tlookup scan -t /home'
        },
    ];
    const usageTxt = commandLineUsage(sections);
    console.log(usageTxt);
}


/**
 * Parse options like "endpoint=localhost:8080" to key-value object
 */
function parseOptions(options:string[]): any {
    return options.map(o => {
        const m = o.match(/^([\w-]+)(?:=(.*))?$/);
        if(!m) {
            console.error('Cannot recognize option:', o);
        } else {
            return { name: m[1], value: m[2] || true};
        }
    }).reduce((res, item) => {
        if(res[item.name]) {
            console.error('Multiple values for option are not supported:', item.name);
        }
        res[item.name] = item.value;
        return res;
    }, {});
}

/**
 *
 */
function scanFiles(options: CliOptions) {

    assert.ok(options.target, 'target must be specified');


    let scanner = new TorrentScanner({
        target: options.target,
        workdir: options.tmp
    });

    // SCAN
    logger.startLOP('scanning');
    scanner.run()
        .subscribe(_onProgress, _onError, _onEnd);

    const logDebounced = debounce(function(entry) {
        logger.logLOP(entry.location);
    }, 1000);

    function _onProgress(entry: TorrentScannerEntry) {
        if (entry.isTorrent) {
            logger.log('Torrent file found:', entry.location);
        } else {
            // logger.logLOP(entry.location);
            logDebounced(entry);
        }
    }


    function _onError(e) {
        logger.stopLOP();
        console.error(e);
    }

    function _onEnd() {
        logger.stopLOP();
        logger.log('Finished in %s sec', logger.elapsedLOP());
        logger.log('  Scanned %s files, found %s torrent files', scanner.stats.files, scanner.stats.torrents);
    }

}

/**
 *
 */
function analyzeTorrents(options: CliOptions) {
    // assert.ok(options.data)
    // assert.ok(options.tdata)
    tick();
    const analyzer = new Analyzer({
        workdir: options.tmp
    });

    analyzer.opStatus.subscribe(status => {
        logger.log(status);
    });
    analyzer.analyze().then(() => {
        logger.log(' Done in %s ms', tick());
    });
}


/**
 *
 */
function pushTorrents(options: CliOptions) {
    // assert.ok(options.client, 'Client must be set. use -c|--client to make it');

    tick();
    const pusher = new Pusher(options);
    pusher.opStatus.subscribe(status => {
        logger.log(status);
    });
    pusher.pushAll().then(() => {
        logger.log(' Done in %s ms', tick());
    });
}





