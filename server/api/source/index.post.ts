import { StatusCodes } from 'http-status-codes';
import { sourceSchema } from '~~/server/models/api/resource_management';
import { source } from '~~/server/models/orm/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { success, data, error } = sourceSchema.safeParse(body);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        data.url = new URL(data.url).origin;
        const result = await db.insert(source).values(data);
        const id = result[0].insertId;
        setResponseStatus(event, StatusCodes.CREATED);
        return { id };
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
