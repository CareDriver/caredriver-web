export function isNullOrEmptyText(text: string | undefined | null): boolean {
  return text === null || text === undefined || text.trim().length <= 0;
}

export function isNumber(text: string): boolean {
  const num = Number(text);
  return Number.isInteger(num);
}
