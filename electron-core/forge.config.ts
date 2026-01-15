import * as path from 'node:path';
import type { ForgeConfig } from '@electron-forge/shared-types';
// import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import AutoUnpackNativesPlugin from "@electron-forge/plugin-auto-unpack-natives";

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        // This tells the packager to copy the actual files
        // instead of just the symlink reference.
        derefSymlinks: true,
        // icon: './resources/torrent-icon-256.png', // Electron Forge will automatically add the correct extension (.ico or .icns)
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({
            setupIcon: path.join(__dirname, './resources/torrent-icon-96.ico'), // Icon for the setup.exe installer
            productName: 'TLookup', // < it's exist!
            // setupExe: 'TLookup-1.0.0.exe',
        }),
        // new MakerZIP({}, ['darwin']),
        // new MakerZIP({}),
    ],
    plugins: [
        new AutoUnpackNativesPlugin({}),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;
