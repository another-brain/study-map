import z from 'zod';
import { keyword } from './utils';

export const idSchema = z.coerce.number().min(1);
export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(0).default(10)
});
export const querySchema = paginationSchema.extend({
    keyword,
    fields: z.array(z.string()).optional()
});
