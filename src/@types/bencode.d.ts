

declare module "bencode" {

    type Buffer = any;  // quick fix

    type Encodable = Buffer|Array<any>|String|Object|Number|Boolean;

    /**
     * Encodes data in bencode
     * @param data
     * @param buffer
     * @param offset
     */
    export function encode(data:Encodable, buffer?:Buffer, offset?:number): Buffer;

    /**
     * Decodes bencoded data
     * @param data
     * @param start
     * @param end
     * @param encoding
     */
    export function decode(data:Buffer, start?:number, end?:number, encoding?:string): Encodable;

    /**
     * Determines the amount of bytes
     * needed to encode the given value
     * @param value
     */
    export function byteLength(value:Encodable): number;
    export {byteLength as encodingLength};


    /**
     *  bencoded data format (partial)
     */
    export interface TorrentData {
        base: string; // file name + extension
        encoding: string;
        info: {
            pieces: string; // some binary data

            /**
             * ONE FILE: file size
             * MILTIPLE FILES: none
             */
            length?: number;

            /**
             * ONE FILE: file name
             * MILTIPLE FILES: folder name or none
             */
            name?: string;


            /**
             * ONE FILE: none
             * MILTIPLE FILES: files info
             */
            files?: Array<{
                path: Array<string>; // array of path components. the last piece is the filename
                length: number;
            }>;
        };
    }

}