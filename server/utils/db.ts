import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../models/orm/resource_management';
import { createConnection } from 'mysql2';

const connection = createConnection({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!
});

const client = drizzle(connection, { schema, mode: 'default' });

export function useDB() {
    return client;
}

export function pager(page: number, size: number, count: number) {
    return {
        limit: size > 0 ? size : count,
        offset: (page - 1) * size
    };
}
