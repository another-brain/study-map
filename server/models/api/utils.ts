import z from 'zod';

const name = z.string().min(1).max(100);
export const url = z.preprocess(val => {
    if (typeof val !== 'string') {
        return val;
    }
    let i = 0;
    while (i < val.length && val[i] === '/') {
        i++;
    }
    let j = val.length - 1;
    while (j >= 0 && val[j] === '/') {
        j--;
    }
    return val.slice(i, j + 1);
}, z.url().max(500));
const description = z.string().optional();

export const fields = {
    name,
    url,
    description
};

export const keyword = z.string().optional();
