import * as path from 'node:path';
import * as os from 'node:os';

export const FN_DATA_FILE = 'files.txt';
export const FN_TORRENTS_FILE = 'torrents.txt';
export const FN_MAPS_FILE = 'maps.json';

export const DEFAULT_WORKDIR_LOCATION = path.join(os.tmpdir(), 'tlookup'); // '~/tmp'
export const TORRENT_EXTENSION = '.torrent';


export const SCAN_EXCLUDE_DEFAULT = [
    // '.*',
    // all platforms
    '.npm',
    'node_modules',
    'npm-cache',
    '.cache',
    '.gradle',
    '.nuget',
    '.nvm',
    '.mozilla',
    '.vscode',
    '.zoom',
    '.pub-cache',
    '.git',
    '.dartServer',
    '.grails',
    '.local',
    '.config',

    // linux specific
    '/etc',

    // windows specific
    'C:\\Windows', 
    'System Volume Information',

    // mac specific
    '.cocoapods',
    'Xcode',
    '*.app',
    '*.ipa',
];
