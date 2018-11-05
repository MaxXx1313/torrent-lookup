
const path = require('path');
const os = require('os');

export const FN_DATA_FILE = 'files.bin';
export const FN_TORRENTS_FILE = 'torrents.bin';
export const FN_MAPS_FILE = 'maps.json';

export const DEFAULT_WORKDIR_LOCATION = path.join(os.tmpdir(), 'tlookup'); // '~/tmp'
export const TORRENT_EXTENSION = '.torrent';


export const SCAN_SKIP_DEFAULT = [
    // '.*',
    '.npm',
    'node_modules',
    'npm-cache',
    '/etc',
    'C:\\Windows', 
    'System Volume Information', 
];