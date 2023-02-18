export interface OptionsParsed {
    [key: string]: string | boolean;
}

/**
 * Parse options like "endpoint=localhost:8080" to key-value object
 */
export function parseOptions(optionArr: string[]): OptionsParsed {
    const optionsParsed: OptionsParsed = {};
    for (const option of optionArr) {
        const m = option.match(/^([\w-]+)(?:=(.*))?$/);
        if (!m) {
            console.error('Cannot recognize option:', option);
        } else {
            const optName = m[1];
            const optValue = m[2] || true;

            if (optionsParsed[optName]) {
                console.error('Multiple values for option are not supported:', optName);
            }
            optionsParsed[optName] = optValue;
        }
    }
    return optionsParsed;
}
