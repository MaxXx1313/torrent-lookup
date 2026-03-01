import fs from 'node:fs';
// import bencode from 'bencode/index.js';
import bencode from 'bencode';
import { BEncodeData } from './BEncodeData.interface';


/**
 */
export function bencodeReadSync(filepath: string): BEncodeData {
    const content = fs.readFileSync(filepath);
    const data: BEncodeData = bencode.decode(content, undefined, undefined, 'UTF-8');
    delete data.info.pieces; // some binary data
    // console.log(data);
    // console.log(data.info.files);
    return {...data, content_hash: _calculateContentHash(data)};
}

function _calculateContentHash(data: BEncodeData): string {
    throw new Error('incomplete');
    return 'TODO'; // TODO
}