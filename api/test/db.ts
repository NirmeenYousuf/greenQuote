import { getKnexInstance } from '../src/db';

export async function select<T>(
  table: string,
  where?: Record<string, any>,
): Promise<T[]> {
  const db = await getKnexInstance();

  const query = db(table).select('*');
  if (where) {
    query.where(where);
  }

  const result = await query;

  return result as T[];
}

export async function insert<T>(table: string, data: any) {
  const db = await getKnexInstance();

  const result = await db(table).insert(data).returning('*');

  return result as T[];
}

export async function deleteData<T>(
  table: string,
  where: Record<string, any>,
): Promise<T[]> {
  const db = await getKnexInstance();

  await db(table).del().where(where);
  const result = await db(table).select('*');
  return result as T[];
}
