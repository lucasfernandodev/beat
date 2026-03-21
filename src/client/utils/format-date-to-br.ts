export function formatDateToBr(dateString: string) {
  const date = new Date(dateString)

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false
  })

  const parts = formatter.formatToParts(date)

  const get = (type: string) =>
    parts.find(p => p.type === type)?.value

  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`
}