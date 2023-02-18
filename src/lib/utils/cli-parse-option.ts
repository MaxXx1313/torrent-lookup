
/**
 * Parse options like "endpoint=localhost:8080" to key-value object
 */
export function parseOptions(options: string[]): object {
    return options.map(o => {
        const m = o.match(/^([\w-]+)(?:=(.*))?$/);
        if (!m) {
            console.error('Cannot recognize option:', o);
        } else {
            return {name: m[1], value: m[2] || true};
        }
    }).reduce((res, item) => {
        if (res[item.name]) {
            console.error('Multiple values for option are not supported:', item.name);
        }
        res[item.name] = item.value;
        return res;
    }, {});
}
