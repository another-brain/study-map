import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './migrations',
    schema: './server/models/orm/resource_management.ts',
    dialect: 'mysql',
    dbCredentials: {
        host: process.env.TIDB_HOST!,
        port: Number(process.env.TIDB_PORT),
        user: process.env.TIDB_USER!,
        password: process.env.TIDB_PASSWORD!,
        database: process.env.TIDB_DATABASE!,
        ssl: {
            rejectUnauthorized: process.env.NODE_ENV !== 'development'
        }
    }
});
