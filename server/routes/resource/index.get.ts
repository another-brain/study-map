import { StatusCodes } from 'http-status-codes';
import { paginationSchema } from '~~/server/models/api/common';
import { resource } from '~~/server/models/orm/resource_management';
import { buildErrorResponse, buildQueryResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const validate = paginationSchema.safeParse(query);
    if (!validate.success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, validate.error);
    }
    try {
        const db = useDB();
        const { page, size } = validate.data;
        const { count, result } = await db.transaction(async tx => {
            const count = await tx.$count(resource);
            const result = await db.query.resource.findMany({
                limit: size > 0 ? size : count,
                offset: (page - 1) * size
            });
            return { count, result };
        });
        setResponseStatus(event, StatusCodes.OK);
        return buildQueryResponse(result, count);
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
