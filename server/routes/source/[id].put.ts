import { eq, inArray } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { idSchema } from '~~/server/models/api/common';
import { sourceSchema } from '~~/server/models/api/resource_management';
import { address, source } from '~~/server/models/orm/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id');
    const validateId = idSchema.safeParse(id);
    if (!validateId.success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, validateId.error);
    }
    const body = await readBody(event);
    const validateBody = sourceSchema.safeParse(body);
    if (!validateBody.success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, validateBody.error);
    }
    try {
        const db = useDB();
        await db.transaction(async tx => {
            const sourceId = validateId.data;
            const { name, description } = validateBody.data;
            await tx.update(source).set({ name, description }).where(eq(source.id, sourceId));
            const oldAddresses = await tx.query.address.findMany({
                where: (address, { eq }) => eq(address.sourceId, sourceId)
            });
            const oldUrls = new Set(oldAddresses.map(address => address.url));
            const newUrls = new Set(validateBody.data.urls);
            const addressesToInsert = Array.from(newUrls.difference(oldUrls)).map(url => ({
                url,
                sourceId
            }));
            await tx
                .delete(address)
                .where(inArray(address.url, Array.from(oldUrls.difference(newUrls))));
            await tx.insert(address).values(addressesToInsert);
        });
        setResponseStatus(event, StatusCodes.NO_CONTENT);
        return null;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
