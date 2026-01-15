import { Analyzer } from "../src/lib";

/**
 * Run with: 'npx bun analyzer-test.ts'
 */
(async function () {
    const analyzer = new Analyzer({
        workdir: './.tmp-tlookup',
    });
    const results = await analyzer.analyze();

    console.log(results);
})();