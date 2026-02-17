import { knex, Knex } from 'knex';
export { Knex };

let _instance: Knex;

export async function __privateSetupKnexInstance({
  database,
  host,
  password,
  port,
  user,
  ssl,
}: {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: { rejectUnauthorized: boolean };
}) {
  const instance = knex({
    client: 'pg',
    connection: {
      host,
      port,
      database,
      user,
      password,
      ssl,
    },
    pool: {
      min: 0,
      max: 10,
    },
  });

  return instance;
}

export async function getKnexInstance() {
  const config = {
    database: process.env.DB_NAME || 'greenQuote',
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'candidate',
    password: process.env.DB_PASSWORD || 'candidate',
    port: 5432,
  };
  if (!_instance) {
    const { database, host, password, port, user } = config;
    _instance = await __privateSetupKnexInstance({
      database,
      host,
      password,
      port,
      user,
    });
  }

  return _instance;
}

export async function knexTransaction(
  callback: (trx: Knex.Transaction) => Promise<void>,
) {
  const db = await getKnexInstance();

  return await db.transaction(async (trx) => {
    return callback(trx);
  });
}
