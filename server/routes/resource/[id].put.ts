import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { idSchema } from '~~/server/models/api/common';
import { resourceSchema } from '~~/server/models/api/resource_management';
import { resource } from '~~/server/models/orm/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id')!;
    const validateId = idSchema.safeParse(id);
    if (!validateId.success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, validateId.error);
    }
    const body = await readBody(event);
    const validateBody = resourceSchema.safeParse(body);
    if (!validateBody.success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, validateBody.error);
    }
    try {
        const db = useDB();
        await db.update(resource).set(validateBody.data).where(eq(resource.id, validateId.data));
        setResponseStatus(event, StatusCodes.NO_CONTENT);
        return null;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
