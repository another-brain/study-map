import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../models/orm/resource_management';
import { createConnection } from 'mysql2';

const connection = createConnection({
    host: process.env.TIDB_HOST!,
    port: Number(process.env.TIDB_PORT!),
    user: process.env.TIDB_USER!,
    password: process.env.TIDB_PASSWORD!,
    database: process.env.TIDB_DATABASE!
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
