import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { idSchema } from '~~/server/models/api/common';
import { sourceSchema } from '~~/server/models/api/resource_management';
import { source } from '~~/server/models/orm/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const idParam = getRouterParam(event, 'id');
    const { success: rSuccess, data: id, error: rError } = idSchema.safeParse(idParam);
    if (!rSuccess) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, rError);
    }
    const body = await readBody(event);
    const { success, data, error } = sourceSchema.safeParse(body);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        await db.update(source).set(data).where(eq(source.id, id));
        setResponseStatus(event, StatusCodes.NO_CONTENT);
        return null;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
