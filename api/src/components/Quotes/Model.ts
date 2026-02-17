import { getKnexInstance, Knex } from '../../db';
import { Quote, QuoteListResponse } from './Types';

export async function insertQuote({
  payload,
  trx,
}: {
  payload: Omit<Quote, 'id'>;
  trx: Knex.Transaction;
}) {
  const db = await getKnexInstance();

  const result = await db('Quotes')
    .insert(payload)
    .returning('*')
    .transacting(trx);
  return result[0];
}

export async function selectQuoteById({ id }: { id: number }) {
  const db = await getKnexInstance();
  return await db('Quotes').select('*').where('id', id).first();
}

export async function selectQuotesByUserId({ userId }: { userId: number }) {
  const db = await getKnexInstance();
  return await db('Quotes').select('*').where('userId', userId);
}

export async function selectQuotes() {
  const db = await getKnexInstance();
  return await db('Quotes').select('*');
}

export async function selectQuotesForList({
  name,
  email,
  userId,
  pageNumber,
  pageSize,
}: {
  name?: string;
  email?: string;
  userId?: number;
  pageNumber: number;
  pageSize: number;
}): Promise<{ results: QuoteListResponse[]; totalCount: number }> {
  const db = await getKnexInstance();
  const baseQuery = db
    .from({ q: 'Quotes' })
    .select(
      'q.id',
      'q.userId',
      'q.monthlyConsumptionKwh',
      'q.systemSizeKw',
      'q.riskBand',
      'q.monthlyPaymentAmount5Years',
      'q.monthlyPaymentAmount10Years',
      'monthlyPaymentAmount15Years',
      'q.createdAt',
      'u.name',
      'u.email',
    )
    .join({ u: 'Users' }, 'u.id', 'q.userId');

  if (userId) {
    baseQuery.where('q.userId', userId);
  }

  if (name) {
    baseQuery.where('u.name', 'like', `%${name}%`);
  }

  if (email) {
    baseQuery.where('u.email', 'like', `%${email}%`);
  }

  const countQuery = baseQuery
    .clone()
    .clearSelect()
    .clearOrder()
    .count({ count: '*' })
    .first();

  const listQuery = baseQuery
    .clone()
    .orderBy('q.createdAt', 'desc')
    .limit(pageSize)
    .offset((pageNumber - 1) * pageSize);

  const [countResult, listResult] = await Promise.all([countQuery, listQuery]);

  return { results: listResult, totalCount: Number(countResult?.count || 0) };
}
