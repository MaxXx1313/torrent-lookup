/**
 * extract filename only from full path
 */
export function getBaseName(fullPath: string) {
    // Handle both Unix (/) and Windows (\) path separators
    const normalizedPath = fullPath.replace(/\\/g, '/');
    const lastSlashIndex = normalizedPath.lastIndexOf('/');
    return normalizedPath.substring(lastSlashIndex + 1);
}