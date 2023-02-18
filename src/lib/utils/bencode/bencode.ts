/**s
 * @return {TorrentProcessingInfo}
 */
import * as fs from 'fs';
import * as bencode from 'bencode';
import { TorrentData } from './TorrentData';



/**
 * @param location
 */
export function bencodeReadSync(location): TorrentData {
    const content = fs.readFileSync(location);

    const data: TorrentData = bencode.decode(content/*, 'UTF-8'*/);
    delete data.info.pieces; // some binary data
    return data;
}
