import { OptionsParsed } from './cli-parse-option';



export interface CliOptions {
    operation: 'scan' | 'push' | 'info';
    verbose: boolean;
    help: boolean;

    /**
     * For 'scan' only
     */
    target: string[];
    tmp: string;

    /**
     * for 'push' only
     */
    client: string;
    /**
     * client options
     * for 'push' only
     */
    option: OptionsParsed;
}
