import z from 'zod';

export const idSchema = z.int().min(1);
export const paginationSchema = z.object({
    page: z.int().min(1).default(1),
    size: z.int().min(0).default(10)
});
