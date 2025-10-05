import { relations } from 'drizzle-orm';
import { mysqlTable, tinyint, unique, varchar } from 'drizzle-orm/mysql-core';
import { TableName } from '../../consts/db';
import { fields } from './utils';
const { id, name, url, logo, description, refId } = fields;

export const source = mysqlTable(TableName.Source, {
    id,
    name,
    url,
    description,
    logo
});

export const resource = mysqlTable(
    TableName.Resource,
    {
        id,
        name: varchar({ length: 100 }).notNull(),
        url,
        sourceId: refId(source.id),
        score: tinyint().notNull(),
        description
    },
    table => [unique().on(table.name, table.sourceId)]
);

export const resourceRelations = relations(resource, ({ one }) => ({
    source: one(source, {
        fields: [resource.sourceId],
        references: [source.id]
    })
}));

export const sourceRelations = relations(source, ({ many }) => ({
    resources: many(resource)
}));
