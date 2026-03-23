export const notionSchema = {
  Systolic: { number: {} },
  Diastolic: { number: {} },
  "Heart Rate": { number: {} },
  "Measured At": { date: {} },
  Period: {
    select: {
      options: [
        { name: 'Madrugada' },
        { name: 'Manhã' },
        { name: 'Tarde' },
        { name: 'Noite' }
      ]
    }
  },
  Annotation: { rich_text: {} },
  ExternalId: { rich_text: {} }
}