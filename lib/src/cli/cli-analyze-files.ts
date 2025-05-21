import { CliOptions } from './CliOptions';
import { Analyzer } from '../lib';



/**
 *
 */
export function cliAnalyzeFiles(options: CliOptions): Promise<any> {
    const analyzer = new Analyzer({
        workdir: options.tmp
    });
    analyzer.opStatus.subscribe(status => {
        console.log(status);
    });
    return analyzer.analyze();
}

