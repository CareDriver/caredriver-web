export const MAX_LENGTH_FOR_NAMES_DISPLAY = 27;
export const MAX_LENGTH_FOR_NAMES = 50;
export const MAX_LENGTH_FOR_DESCRIPTION = 150;

export function cutTextByLength(text: string, length: number): string {
  if (length > 0 && text.length <= length) {
    return text;
  }

  return text.slice(0, length - 1);
}

export function cutTextWithDotsByLength(text: string, length: number): string {
  if (length > 0 && text.length <= length) {
    return text;
  }

  let dots = "...";
  let lenghtWithDots = length - 1 - dots.length;

  return text.slice(0, lenghtWithDots).concat(dots);
}
