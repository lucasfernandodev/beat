import { notion } from "../client.ts"

export async function checkEditPermission(databaseId: string) {
  try {
    await notion.databases.update({
      database_id: databaseId,
      title: [{ text: { content: "Beat-database" } }]
    })

    return true
  } catch (err: any) {
    if (err.code === 'unauthorized') {
      throw new Error('Sem permissão de edição no database')
    }

    throw err
  }
}