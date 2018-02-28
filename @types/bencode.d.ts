

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

}