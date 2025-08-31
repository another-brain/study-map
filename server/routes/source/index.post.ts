import { StatusCodes } from 'http-status-codes';
import { sourceSchema } from '~~/server/models/api/resource_management';
import { address, source } from '~~/server/models/orm/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const validate = sourceSchema.safeParse(body);
    if (!validate.success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, validate.error);
    }
    try {
        const db = useDB();
        const [id] = await db.transaction(async tx => {
            const { name, description, urls } = validate.data;
            const result = await tx.insert(source).values({ name, description });
            const sourceId = result[0].insertId;
            const addresses = urls.map(url => ({ url, sourceId }));
            await tx.insert(address).values(addresses);
            return [sourceId];
        });
        setResponseStatus(event, StatusCodes.CREATED);
        return { id };
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
