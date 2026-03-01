/**
 *  bencoded data format (partial)
 */
export interface BEncodeData {
    /**
     * content_hash is used to maintain duplications
     */
    content_hash: string;
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

