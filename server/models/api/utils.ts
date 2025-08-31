import z from 'zod';

const name = z.string().min(1).max(100);
const url = z.url().max(500);
const description = z.string().optional();

export const fields = {
    name,
    url,
    description
};
