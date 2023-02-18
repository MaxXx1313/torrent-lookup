#!/usr/bin/env node

import { debounce, tick } from "../lib/utils/tools";

import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import * as assert from 'assert';

import { DEFAULT_WORKDIR_LOCATION } from "../lib/const";
import { Analyzer, Info, Pusher, TorrentScanner, TorrentScannerEntry } from "../lib";
import { CliOptions } from '../lib/cli/CliOptions';
import { parseOptions } from '../lib/utils/cli-parse-option';



const LopConsole = require('../lib/utils/LopConsole');
const logger = new LopConsole();

type OptionDefinition = commandLineArgs.OptionDefinition & { description?: string };

/**
 *
 */
const optionDefinitions: OptionDefinition[] = [
    {
        name: 'operation',
        type: String,
        defaultOption: true,
        description: "Operation. one of 'find', 'push', 'info'",
    },

    {
        name: 'verbose',
        alias: 'v',
        type: Boolean,
        defaultValue: false,
        description: 'verbose output',
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'print help',
    },

    // for scanner:
    {
        name: 'target',
        alias: 't',
        type: String,
        multiple: true,
        description: 'scan folder',
    },
    {
        name: 'tmp',
        type: String,
        defaultValue: DEFAULT_WORKDIR_LOCATION,
        description: 'folder to save data'
    },

    {
        name: 'client',
        alias: 'c',
        type: String,
        description: 'client app to push torrents (operation=push)'
    },
    {
        name: 'option',
        alias: 'o',
        type: String,
        multiple: true,
        description: 'client app options (for ex.: "-o endpoint=localhost:8080"). Look into documentation for the client app for details '
    },
];

// run main
(async function () {
    tick();

    const options = commandLineArgs(optionDefinitions, {stopAtFirstUnknown: true, partial: true});
    options.option = parseOptions(options.option || []);
    const argv = options._unknown || [];
    // console.log('options', options, argv);


    // // process options
    // if (options.help || !options.operation) {
    //     usage();
    //     process.exit(0);
    // }
    //
    // if (options.verbose) {
    //     console.log('Working directory:', options.tmp);
    // }
    //
    // switch (options.operation) {
    //     case OPERATION_FIND:
    //         const findDefinitions = [
    //             {name: 'target', defaultOption: true, multiple: true}
    //         ];
    //         const findCommand = commandLineArgs(findDefinitions, {argv});
    //         if (findCommand.target) {
    //             options.target = options.target || [];
    //             options.target.push.apply(options.target, findCommand.target);
    //         }
    //
    //         // console.log(options);
    //
    //         await scanFiles(options);
    //         await analyzeTorrents(options);
    //         break;
    //     case OPERATION_PUSH:
    //
    //         const pushDefinitions = [
    //             {name: 'client', defaultOption: true}
    //         ];
    //         const pushCommand = commandLineArgs(pushDefinitions, {argv});
    //         if (pushCommand.client) {
    //             options.client = pushCommand.client;
    //         }
    //
    //         await pushTorrents(options);
    //         break;
    //     case OPERATION_INFO:
    //         await info(options);
    //         break;
    //     default:
    //         console.error('Unknown operation: %s', options.operation);
    // }

    console.log('Done in %s ms', tick());
})();

////////////////////////////////////////////////////


/**
 * Print usage
 */
function usage() {
    const sections: commandLineUsage.Section[] = [
        {
            header: 'Usage',
            content: '$ tlookup [bold]{operation} [bold]{target}'
        },
        {
            header: 'Description',
            content: 'Scan files and match torrent files'
        },
        {
            header: 'Operation',
            content: [
                '[bold]{find} - scan files, find torrent files and it\'s downloads',
                '[bold]{push} - push torrents to client',
                '[bold]{info} - print scan info'
            ]
        },
        {
            header: 'Options',
            optionList: optionDefinitions,
        },
        {
            header: 'Clients',
            content: [
                'Most clients require remote access to be enabled!',
            ]
        },
        {
            content: [
                // TODO: load dynamically
                {name: 'transmission', alias: 't', summary: ' Transmission app'}
            ]
        },
        {
            header: 'Examples',
            content: [
                {desc: 'Scan home folders', example: '$ tlookup find "/home"'},
                {desc: 'Push result to transmission', example: '$ tlookup push transmission'},
            ]
        },
    ];
    const usageTxt = commandLineUsage(sections);
    console.log(usageTxt);
}


/**
 *
 */
function scanFiles(options: CliOptions): Promise<any> {
    assert.ok(options.target, 'target must be specified');

    const logDebounced = debounce(function (str) {
        logger.logLOP(str);
    }, 1000);

    function _onProgress(entry: TorrentScannerEntry) {
        if (entry.isTorrent) {
            logger.log('Torrent file found:', entry.location);
        } else {
            // logger.logLOP(entry.location);
            logDebounced(entry.location);
        }
    }


    //
    const scanner = new TorrentScanner({
        target: options.target,
        workdir: options.tmp
    });

    // SCAN
    scanner.onEntry.subscribe(_onProgress);

    logger.startLOP('scanning');
    return scanner.run().then(() => {
        logger.stopLOP();
        logger.log('Scanned %s files, found %s torrent files', scanner.stats.files, scanner.stats.torrents);
    }).catch((e) => {
        logger.stopLOP();
        throw e;
    });
}

/**
 *
 */
function analyzeTorrents(options: CliOptions): Promise<any> {
    const analyzer = new Analyzer({
        workdir: options.tmp
    });
    analyzer.opStatus.subscribe(status => {
        console.log(status);
    });
    return analyzer.analyze();
}


/**
 *
 */
function pushTorrents(options: CliOptions): Promise<any> {
    // assert.ok(options.client, 'Client must be set. use -c|--client to make it');

    const pusher = new Pusher({
        client: options.client,
        workdir: options.tmp,
        option: options.clientOptions,
    });
    pusher.opStatus.subscribe(status => {
        console.log(status);
    });
    return pusher.pushAll();
}


/**
 *
 */
function info(options: CliOptions): Promise<any> {
    const info = new Info(options);
    return info.getMapping().then((mapping) => {
        for (let i = 0; i < mapping.length; i++) {
            console.log('Save:', mapping[i].torrent);
            console.log('  to:', mapping[i].saveTo);
        }
        console.log('Total:', mapping.length);
    });
}


/**
 *
 */
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection:', reason);
    // application specific logging, throwing an error, or other logic here
    process.exit(1);
});
