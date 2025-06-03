export interface TLFileInfo {
    location: string;
    size: number;
}

/**
 *
 */
export class FileMatcher {

    static combineFileInfo(fileInfoStr: TLFileInfo): string {
        // why endline appears in filename?
        return fileInfoStr.location.replace(/[\r\n]/g, '') + ':' + fileInfoStr.size;
    }

    static explodeFileInfo(fileInfoStr: string): TLFileInfo {
        // parse filepath and size
        const [m, pathAbsolute, size] = fileInfoStr.match(/^(.*):([-\d]+)$/) || [null, null, null];
        if (!m) {
            return null;
        }

        return {
            location: pathAbsolute,
            size: parseInt(size, 10),
        };
    }
}
