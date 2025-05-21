import { CliOptions } from './CliOptions';
import { Info } from '../lib';



/**
 *
 */
export function cliInfoFiles(options: CliOptions): Promise<any> {
    const info = new Info(options);
    return info.getMapping().then((mapping) => {
        for (let i = 0; i < mapping.length; i++) {
            console.log('Save:', mapping[i].torrent);
            console.log('  to:', mapping[i].saveTo);
        }
        console.log('Total:', mapping.length);
    });
}
