import z from 'zod';
import { fields } from './utils';
import { idSchema } from './common';
const { name, url, description } = fields;

export const resourceSchema = z.object({
    name,
    url,
    source: url,
    score: z.int().min(0).max(10),
    description
});

export type ResourceSchema = z.infer<typeof resourceSchema>;

export const resourceSchemaWithId = resourceSchema.extend({
    id: idSchema
});

export type ResourceFullSchema = Required<z.infer<typeof resourceSchemaWithId>>;

export type ResourceQueryResp = ResourceFullSchema extends infer T
    ? { [K in keyof T]: K extends 'id' ? T[K] : T[K] | undefined }
    : never;

export const sourceSchema = z.object({
    name,
    description,
    urls: z.array(url)
});

export type SourceSchema = z.infer<typeof sourceSchema>;

export const sourceSchemaWithId = sourceSchema.extend({
    id: idSchema
});

export type SourceSchemaWithId = z.infer<typeof sourceSchemaWithId>;
