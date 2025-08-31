import z from 'zod';

export const idSchema = z.int64().min(1n);
