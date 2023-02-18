export interface CliOptions {
    operation: 'find' | 'push' | 'info';
    verbose: boolean;
    help: boolean;

    /**
     * For 'scan' only
     */
    target: string; // TODO: []
    tmp: string;

    /**
     * for 'push' only
     */
    client: string;
    /**
     * for 'push' only
     */
    clientOptions: object;
}
