export function parseNumberList(value: string, min = 1, max = 33): number[] {
  const trimmed = value.trim();
  if (!trimmed) return [];

  const numbers = trimmed
    .split(/[，,\s]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item >= min && item <= max);

  return [...new Set(numbers)];
}
