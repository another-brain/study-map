import { relations } from 'drizzle-orm';
import { mysqlTable, tinyint, unique, varchar } from 'drizzle-orm/mysql-core';
import { TableName } from '../../consts/db';
import { fields } from './utils';
const { id, name, url, description, refId } = fields;

export const resource = mysqlTable(
    TableName.Resource,
    {
        id,
        name: varchar({ length: 100 }).notNull(),
        url,
        source: varchar({ length: 500 }).references(() => address.url),
        score: tinyint().notNull(),
        description
    },
    table => [unique().on(table.name, table.source)]
);

export const source = mysqlTable(TableName.Source, {
    id,
    name,
    description
});

export const address = mysqlTable(TableName.Address, {
    id,
    url,
    sourceId: refId(source.id)
});

export const resourceRelations = relations(resource, ({ one }) => ({
    source: one(address)
}));

export const sourceRelations = relations(source, ({ many }) => ({
    addresses: many(address)
}));

export const addressRelations = relations(address, ({ one }) => ({
    source: one(source)
}));
