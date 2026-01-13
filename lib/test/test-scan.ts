import { Analyzer, TorrentScanner } from "../src/lib";

/**
 * Run with: 'npx bun test-scan.ts'
 */
(async function () {

    const scanner = new TorrentScanner({
        workdir: './.tmp-tlookup',
        target: '.',
        onEntry: entry => console.log(entry.location),
    });
    const results = await scanner.run();

    console.log(results);
})();