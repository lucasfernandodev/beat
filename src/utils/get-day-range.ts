export function getDayRange(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)

  const start = new Date(year, month - 1, day, 0, 0, 0)
  const end = new Date(year, month - 1, day, 23, 59, 59, 999)

  return { start, end }
}