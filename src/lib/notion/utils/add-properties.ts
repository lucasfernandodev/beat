import { notionSchema } from "../../../infra/database/notion/database-schema.ts";
import { BadRequest } from "../../../infra/errors/bad-request.ts";
import { notion } from "../client.ts";
import { getDatabase } from "./get-database.ts";

export const addProperties = async (databaseId: string) => {
  try {
    const db = await getDatabase(databaseId) as any
    const data_source_id = db.data_sources[0].id


    await notion.dataSources.update({
      data_source_id: data_source_id,
      properties: notionSchema
    });
  } catch (error) {
    console.log("addProperties Error:\n", error)
    throw new BadRequest("Não foi possível criar o schema do banco de dados")
  }
}