import { StatusCodes } from 'http-status-codes';
import { paginationSchema } from '~~/server/models/api/common';
import { source } from '~~/server/models/orm/resource_management';
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
            const count = await tx.$count(source);
            const result = await tx.query.source.findMany({
                limit: size > 0 ? size : count,
                offset: (page - 1) * size,
                with: {
                    addresses: true
                }
            });
            return { count, result };
        });
        setResponseStatus(event, StatusCodes.OK);
        return buildQueryResponse(
            result.map(item => {
                const { id, name, description, addresses } = item;
                return {
                    id,
                    name,
                    description,
                    urls: addresses.map(address => address.url)
                };
            }),
            count
        );
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
