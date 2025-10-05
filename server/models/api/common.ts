import z from 'zod';
import { keyword, url } from './utils';

export const idSchema = z.coerce.number().min(1);

export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(0).default(10)
});

export const searchSchema = paginationSchema.extend({
    keyword
});

export const parserSchema = z.object({
    url
});
