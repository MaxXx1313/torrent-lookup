import { CliOptions } from './CliOptions.js';
import { Analyzer } from '../lib/analyze/Analyzer.js';



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

