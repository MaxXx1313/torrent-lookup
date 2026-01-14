import * as path from 'node:path';
import * as os from 'node:os';

export const FILE_DATA = 'files.txt';
export const FILE_TORRENTS = 'torrents.txt';
export const FILES_MAPS = 'maps.json';

export const DEFAULT_WORKDIR_LOCATION = path.join(os.tmpdir(), 'tlookup'); // '~/tmp'
export const TORRENT_EXTENSION = '.torrent';


export const SCAN_EXCLUDE_DEFAULT = [
// General
    '*.swp',
    '*.swo',
    '*~',
    '.DS_Store',
    '.Spotlight-V100',
    '.Trashes',
    '$RECYCLE.BIN',

// Visual Studio Code
    '.vscode',
    '.history',

// JetBrains IDEs
    '.idea',
    '.idea_modules',

// Eclipse
    '.metadata',
    '/tmp',
    '.settings',
    '.recommenders',
    '.externalToolBuilders',

// Visual Studio
    '.vs',
    '.builds',

// Xcode
    'DerivedData',
    'xcuserdata',

// Android Studio
    '.gradle',
    'externalNativeBuild',
    '.\\#*',

// Atom
    '.atom',

// Custom, all platforms
    '.npm',
    '.yarn',
    'node_modules',
    'jspm_packages',
    'npm-cache',
    '.nvm',
    '.nuxt',
    '.vuepress',
    '.docusaurus',
    '.dynamodb',
    '.fusebox',
    '.cache',
    '.gradle',
    '.nuget',
    '.mozilla',
    '.vscode',
    '.zoom',
    '.pub-cache',
    '.git',
    '.dartServer',
    '.grails',
    '.local',
    '.config',
    '.pyenv',
    '.venv',
    '.idea',
    '.docker',
    '.ssh',
    '.ionic',
    '__pycache__',
    '__pypackages__',
    '.pybuilder',
    'kubernetes',
    'google-cloud-sdk',
    'WebstormProjects',


    // Unit test / coverage reports
    'htmlcov',
    '.tox',
    '.nox',

    // linux specific
    '/etc',
    '/proc',
    '/site',
    '/tmp',
    '/temp',
    '.directory',
    '.Trash-*',
    '.zsh_sessions',

    // windows specific
    'C:\\Windows',
    'System Volume Information',

    // mac specific
    '.DS_Store',
    '.AppleDouble',
    '.DocumentRevisions-V100',
    '.Spotlight-V100',
    'Network Trash Folder',
    'Temporary Items',
    '~/Library',
    '.cocoapods',
    'Xcode',
    '*.app',
    '*.ipa',
    '*.photoslibrary',
];
