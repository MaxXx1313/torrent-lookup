interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
}


export interface AppConfiguration {
    targets?: string[];
    exclude?: string[];
}