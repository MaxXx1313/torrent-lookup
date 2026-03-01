import fs from 'node:fs';
import crypto from 'node:crypto';
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

const GLUE = '|';

function _calculateContentHash(data: BEncodeData): string {
    const dataParts = [
        data.base,
        data.encoding,
        data.info.name,
        data.info.length || 0,
    ];

    if (data.info.files) {
        const fileData: string[] = [];
        for (const fileInfo of data.info.files) {
            fileData.push(fileInfo.path.join('/') + GLUE + fileInfo.length);
        }

        const fileDataSorted = fileData
            .sort((a, b) => a.localeCompare(b));

        dataParts.push(...fileDataSorted);
    }
    const strData = JSON.stringify(dataParts);
    return generateStringChecksum(strData);
}


function generateStringChecksum(str: string) {
    return crypto
        .createHash('md5') // e.g., 'md5', 'sha1', 'sha256'
        .update(str, 'utf8')
        .digest('hex'); // e.g., 'hex', 'base64'
}