import { drizzle } from 'drizzle-orm/tidb-serverless';

const url = `mysql://${process.env.DB_USER!}:${process.env.DB_PASSWORD!}@${process.env
    .DB_HOST!}:${process.env.DB_PORT!}/${process.env.DB_DATABASE!}`;
export const db = drizzle(url);
