export function isNullOrEmptyText(text: string | undefined | null): boolean {
    return text === null || text === undefined || text.trim().length <= 0;
}
