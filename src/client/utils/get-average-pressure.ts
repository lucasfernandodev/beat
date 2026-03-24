export function getAveragePressure<T>(
  items: T[],
  selector: (item: T) => { systolic: number; diastolic: number } | null | undefined
): string {
  const values = items
    .map(selector)
    .filter(
      (v): v is { systolic: number; diastolic: number } => v != null
    );

  if (values.length === 0) return "0/0";

  if (values.length === 1) {
    const { systolic, diastolic } = values[0];
    return `${systolic}/${diastolic}`;
  }

  const total = values.reduce(
    (acc, v) => {
      acc.systolic += v.systolic;
      acc.diastolic += v.diastolic;
      return acc;
    },
    { systolic: 0, diastolic: 0 }
  );

  const avgSystolic = total.systolic / values.length;
  const avgDiastolic = total.diastolic / values.length;

  // opcional: arredondar
  return `${Math.round(avgSystolic)}/${Math.round(avgDiastolic)}`;
}