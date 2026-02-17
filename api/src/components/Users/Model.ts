import { getKnexInstance, Knex } from '../../db';
import { User } from './Types';

export async function selectUserByEmail({ email }: { email: string }) {
  const db = await getKnexInstance();
  return await db('Users').select('*').where('email', email).first();
}

export async function insertUser({
  payload,
  trx,
}: {
  payload: Omit<User, 'id'>;
  trx: Knex.Transaction;
}) {
  const db = await getKnexInstance();

  const result = await db('Users')
    .insert(payload)
    .returning('*')
    .transacting(trx);
  return result[0];
}

export async function selectUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const db = await getKnexInstance();
  return await db('Users')
    .select('*')
    .where('email', email)
    .where('password', password)
    .first();
}
