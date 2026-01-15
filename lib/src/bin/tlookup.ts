#!/usr/bin/env node

import { tick } from "../lib/utils/tools.js";

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import { DEFAULT_WORKDIR_LOCATION } from "../lib/const.js";
import { CliOptions } from '../cli/CliOptions.js';
import { parseOptions } from '../cli/cli-parse-option.js';
import { cliScanFiles } from '../cli/cli-scan-files.js';
import { cliAnalyzeFiles } from '../cli/cli-analyze-files.js';
import { cliPushFiles } from '../cli/cli-push-files.js';
import { cliInfoFiles } from '../cli/cli-info-files.js';


type OptionDefinition = commandLineArgs.OptionDefinition & { description?: string };

/**
 *
 */
const optionDefinitions: OptionDefinition[] = [
    {
        name: 'operation',
        type: String,
        defaultOption: true,
        description: "Operation. one of 'scan', 'push', 'info'",
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
    {
        name: 'tmp',
        type: String,
        defaultValue: DEFAULT_WORKDIR_LOCATION,
        description: 'folder to save data'
    },

    // for scanner:
    {
        name: 'target',
        alias: 't',
        type: String,
        multiple: true,
        description: '(scan) target folder(s)',
    },
    {
        name: 'fps',
        type: Number,
        defaultValue: 0,
        description: '(scan) files-per-second limit'
    },

    {
        name: 'client',
        alias: 'c',
        type: String,
        description: '(push) client app to push torrents'
    },
    {
        name: 'option',
        alias: 'o',
        type: String,
        multiple: true,
        description: '(push) client app options (for ex.: "-o endpoint=localhost:8080"). Look into documentation for the client app for details '
    },
];

// run main
(async function () {
    tick();

    const parsed = commandLineArgs(optionDefinitions, {stopAtFirstUnknown: true, partial: true, argv: process.argv});
    parsed.clientOptions = parseOptions(parsed.option || []);
    const argv = parsed._unknown || []; // rest options are here
    const options = parsed as CliOptions;

    // console.log('options', options, argv);


    // process options
    if (options.help || !options.operation) {
        usage();
        process.exit(0);
    }

    if (options.verbose) {
        console.log('Working directory:', options.tmp);
    }

    switch (options.operation) {

        case 'scan':
            const findDefinitions = [
                {name: 'target', defaultOption: true, multiple: true}
            ];
            const findCommand = commandLineArgs(findDefinitions, {argv});
            if (findCommand.target) {
                options.target = options.target || [];
                options.target.push.apply(options.target, findCommand.target);
            }

            // console.log(options);

            await cliScanFiles(options);
            await cliAnalyzeFiles(options);
            break;

        case 'push':
            const pushDefinitions = [
                {name: 'client', defaultOption: true}
            ];
            const pushCommand = commandLineArgs(pushDefinitions, {argv});
            if (pushCommand.client) {
                options.client = pushCommand.client;
            }

            await cliPushFiles(options);
            break;

        case 'info':
            await cliInfoFiles(options);
            break;
        default:
            console.error('Unknown operation: %s', options.operation);
    }

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
            content: '$ tlookup [{bold options}] {bold operation} {bold target}'
        },
        {
            header: 'Description',
            content: 'Scan files and match torrent files'
        },
        {
            header: 'Operation',
            content: [
                '{bold scan} - scan files, find torrent files and it\'s downloads',
                '{bold push} - push torrents to client',
                '{bold info} - print scan info'
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
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection:', reason);
    // application specific logging, throwing an error, or other logic here
    process.exit(1);
});
