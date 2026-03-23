import { BadRequest } from "../../../infra/errors/bad-request.ts"
import { notion } from "../client.ts"

export const getDatabase = async (databaseId: string) => {
  try {
    const db = await notion.databases.retrieve({
      database_id: databaseId
    })

    return db
  } catch (err: any) {
    if (err.code === 'object_not_found') {
      throw new BadRequest('Database não encontrado ou não compartilhado com a integração')
    }

    throw err
  }
}