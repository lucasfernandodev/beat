export function getAverage<T>(
  items: T[],
  selector: (item: T) => number | null | undefined
): number {
  const values = items
    .map(selector)
    .filter((v): v is number => v != null);

  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];

  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}