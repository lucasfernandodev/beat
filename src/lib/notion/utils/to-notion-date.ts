export function toNotionDate(dateString: Date) {
  const date = dateString

  const pad = (n: number) => String(n).padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())

  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  const offsetMinutes = date.getTimezoneOffset()
  const sign = offsetMinutes > 0 ? '-' : '+'

  const abs = Math.abs(offsetMinutes)
  const offsetH = pad(Math.floor(abs / 60))
  const offsetM = pad(abs % 60)

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetH}:${offsetM}`
}