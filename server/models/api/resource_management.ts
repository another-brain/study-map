import z from 'zod';
import { fields } from './utils';
import { idSchema } from './common';
const { name, url, description } = fields;

export const resourceSchema = z.object({
    name,
    url,
    sourceId: idSchema,
    score: z.int().min(0).max(10),
    description
});

export type ResourceSchema = z.infer<typeof resourceSchema>;

const _resourceSchemaWithId = resourceSchema.extend({
    id: idSchema
});

export type ResourceFullSchema = Required<z.infer<typeof _resourceSchemaWithId>>;

export type ResourceQueryResp = ResourceFullSchema extends infer T
    ? { [K in keyof T]: K extends 'id' ? T[K] : T[K] | undefined }
    : never;

export const sourceSchema = z.object({
    name,
    url,
    logo: url,
    description
});

export type SourceSchema = z.infer<typeof sourceSchema>;

const _sourceSchemaWithId = sourceSchema.extend({
    id: idSchema
});

export type SourceFullSchema = Required<z.infer<typeof _sourceSchemaWithId>>;

export type SourceQueryResp = SourceFullSchema extends infer T
    ? { [K in keyof T]: K extends 'id' ? T[K] : T[K] | undefined }
    : never;
