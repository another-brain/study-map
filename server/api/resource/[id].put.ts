import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { TableName } from '~~/server/consts/db';
import { idSchema } from '~~/server/models/api/common';
import { resourceSchema } from '~~/server/models/api/resource_management';
import { resource } from '~~/server/models/orm/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const idParam = getRouterParam(event, 'id')!;
    const { success: rSuccess, data: id, error: rError } = idSchema.safeParse(idParam);
    if (!rSuccess) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, rError);
    }
    const body = await readBody(event);
    const { success, data, error } = resourceSchema.safeParse(body);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        await db.update(resource).set(data).where(eq(resource.id, id));
        const index = useIndex(TableName.Resource);
        index.update(id, data.name, [data.name, data.description ?? '']);
        setResponseStatus(event, StatusCodes.NO_CONTENT);
        return null;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
