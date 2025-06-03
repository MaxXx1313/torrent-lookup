import { CliOptions } from './CliOptions.js';
import { Analyzer } from '../lib/analyze/Analyzer.js';



/**
 *
 */
export function cliAnalyzeFiles(options: CliOptions): Promise<any> {
    const analyzer = new Analyzer({
        workdir: options.tmp
    });
    return analyzer.analyze();
}

