import z from 'zod';
import { fields } from './utils';
const { name, url, description } = fields;

export const resourceSchema = z.object({
    name,
    url,
    source: url,
    score: z.int().min(0).max(10),
    description
});

export const sourceSchema = z.object({
    name,
    description,
    urls: z.array(url)
});
