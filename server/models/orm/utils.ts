import { bigint, type MySqlColumn, text, varchar } from 'drizzle-orm/mysql-core';

const id = bigint({ mode: 'number', unsigned: true }).primaryKey().autoincrement();
const name = varchar({ length: 100 }).notNull().unique();
const url = varchar({ length: 500 }).notNull().unique();
const logo = varchar({ length: 500 }).notNull();
const description = text().notNull();
function refId(col: MySqlColumn) {
    return bigint({ mode: 'number', unsigned: true })
        .notNull()
        .references(() => col);
}

export const fields = {
    id,
    name,
    url,
    logo,
    description,
    refId
};

export function likeStr(keyword: string) {
    return `%${keyword}%`;
}
