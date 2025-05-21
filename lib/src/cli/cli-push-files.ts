import { CliOptions } from './CliOptions.js';
import { PushManager } from '../lib/push/PushManager.js';



/**
 *
 */
export function cliPushFiles(options: CliOptions): Promise<any> {
    // assert.ok(options.client, 'Client must be set. use -c|--client to make it');

    const pusher = new PushManager({
        client: options.client,
        workdir: options.tmp,
        option: options.option,
    });
    pusher.opStatus.subscribe(status => {
        console.log(status);
    });
    return pusher.pushAll();
}
