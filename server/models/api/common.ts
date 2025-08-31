import z from 'zod';

export const idSchema = z.int64().min(1n);
export const paginationSchema = z.object({
    page: z.int().min(1).default(1),
    size: z.int().min(0).default(10)
});
