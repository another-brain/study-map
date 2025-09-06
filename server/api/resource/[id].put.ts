import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { resourceSchemaWithId } from '~~/server/models/api/resource_management';
import { resource } from '~~/server/models/orm/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id')!;
    const body = await readBody(event);
    const { success, data, error } = resourceSchemaWithId.safeParse({ id, ...body });
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        await db.update(resource).set(data).where(eq(resource.id, data.id));
        setResponseStatus(event, StatusCodes.NO_CONTENT);
        return null;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
