import { addProperties } from "../../lib/notion/utils/add-properties.ts";
import { checkEditPermission } from "../../lib/notion/utils/check-permission.ts";
import { getDatabase } from "../../lib/notion/utils/get-database.ts"

export class SetupNotionForUserService {
  public execute = async (databaseId: string) => {
    await getDatabase(databaseId);
    await checkEditPermission(databaseId)
    await addProperties(databaseId)
  }
}