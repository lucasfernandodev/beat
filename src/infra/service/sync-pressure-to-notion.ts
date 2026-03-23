
import { notion } from "../../lib/notion/client.ts"
import { getDatabase } from "../../lib/notion/utils/get-database.ts"
import { toNotionDate } from "../../lib/notion/utils/to-notion-date.ts"
import { prisma } from "../../lib/prisma/client.ts"
import { dayPeriodToPtBr } from "../../utils/day-period-to-ptbr.ts"
import { getDayPeriod } from "../../utils/get-day-period.ts"

interface ExecuteProps {
  patientId: string
}

export class SyncPressureToNotion {

  public execute = async ({ patientId }: ExecuteProps) => {

    const isExistPatient = await prisma.patient.findFirst({
      where: {
        id: patientId
      }
    })

    if (!isExistPatient) return;

    const records = await prisma.measurementSession.findMany({
      where: {
        patientId: patientId,
        syncStatus: "PENDING"
      },
      include: {
        pressures: true
      }
    })

    const database = await getDatabase(isExistPatient.cloudDatabaseId) as any;

    if (!database) return;

    const data_source_id = database.data_sources[0].id

    for (const record of records) {

      try {

        const avgSystolic =
          record.pressures.length > 0
            ? record.pressures.reduce((sum, p) => sum + p.systolic, 0) / record.pressures.length
            : 0

        const avgDystolic =
          record.pressures.length > 0
            ? record.pressures.reduce((sum, p) => sum + p.diastolic, 0) / record.pressures.length
            : 0

        const heartRates = record.pressures.filter(p => p.heartRate != null);

        const mHeart =
          heartRates.length > 0
            ? heartRates.reduce((sum, p) => sum + (p.heartRate as any), 0) / heartRates.length
            : 0;

        const result = await notion.pages.create({
          parent: {
            data_source_id
          },
          properties: {
            "Name": {
              title: [{ text: { content: record.id } }]
            },
            "Systolic": {
              "number": avgSystolic
            },
            "Diastolic": {
              "number": avgDystolic
            },
            "Heart Rate": {
              "number": mHeart
            },
            "Measured At": {
              "date": {
                "start": toNotionDate(record.measuredAt)
              }
            },
            "Period": {
              "select": {
                "name": dayPeriodToPtBr(getDayPeriod(record.measuredAt))
              }
            },
            "Annotation": {
              "rich_text": [
                {
                  "text": {
                    "content": record.annotation || ''
                  }
                }
              ]
            },
            "ExternalId": {
              "rich_text": [
                {
                  "text": {
                    "content": record.id
                  }
                }
              ]
            }
          }
        })

        await prisma.measurementSession.update({
          where: {
            id: record.id
          },
          data: {
            syncedAt: new Date(),
            externalId: result.id,
            syncStatus: 'SYNCED'
          }
        })
      } catch (error) {
        console.error(`Sync ${record.id} failed`)
        await prisma.measurementSession.update({
          where: {
            id: record.id
          },
          data: {
            syncStatus: 'FAILED'
          }
        })
        continue
      }
    }

  }
}