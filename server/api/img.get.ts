import { StatusCodes } from 'http-status-codes';
import { parserSchema } from '../models/api/common';

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const { success, data, error } = parserSchema.safeParse(query);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        return await fetch(data.url);
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
