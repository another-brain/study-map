import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { idSchema } from '~~/server/models/api/common';
import { address, source } from '~~/server/models/orm/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id')!;
    const { success, data, error } = idSchema.safeParse(id);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        await db.transaction(async tx => {
            await tx.delete(address).where(eq(address.sourceId, data));
            await tx.delete(source).where(eq(source.id, data));
        });
        setResponseStatus(event, StatusCodes.NO_CONTENT);
        return null;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
