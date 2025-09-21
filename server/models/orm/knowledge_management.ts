import { mysqlTable } from 'drizzle-orm/mysql-core';
import { TableName } from '../../consts/db';
import { fields } from './utils';
const { id, name, description } = fields;

export const tag = mysqlTable(TableName.Tag, {
    id,
    name,
    description
});
