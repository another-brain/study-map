import { eq, inArray } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { sourceSchemaWithId } from '~~/server/models/api/resource_management';
import { address, source } from '~~/server/models/orm/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const { success, data, error } = sourceSchemaWithId.safeParse({ id, ...body });
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        await db.transaction(async tx => {
            const sourceId = data.id;
            await tx.update(source).set(data).where(eq(source.id, sourceId));
            const oldAddresses = await tx.query.address.findMany({
                where: (address, { eq }) => eq(address.sourceId, sourceId)
            });
            const oldUrls = new Set(oldAddresses.map(address => address.url));
            const newUrls = new Set(data.urls);
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
