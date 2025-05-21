import fs from 'node:fs';
// import bencode from 'bencode/index.js';
import bencode from 'bencode';
import { TorrentData } from './TorrentData.interface';

// TODO: nodejs is not working here
// const bencode ={
//     decode:()=>null,
// }as any;

/**
 */
export function bencodeReadSync(filepath: string): TorrentData {
    const content = fs.readFileSync(filepath);

    const data: TorrentData = bencode.decode(content, undefined, undefined, 'UTF-8');
    delete data.info.pieces; // some binary data
    return data;
}
