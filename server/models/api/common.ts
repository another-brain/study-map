import z from 'zod';

export const idSchema = z.coerce.number().min(1);
export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(0).default(10)
});
export const searchSchema = paginationSchema.extend({
    keyword: z.string().optional(),
    fields: z.array(z.string()).optional()
});
