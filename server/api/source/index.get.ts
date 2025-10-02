import { StatusCodes } from 'http-status-codes';
import { paginationSchema } from '~~/server/models/api/common';
import type { SourceFullSchema } from '~~/server/models/api/resource_management';
import { source } from '~~/server/models/orm/resource_management';
import { buildErrorResponse, buildQueryResponse } from '~~/server/utils/api';
import { pager } from '~~/server/utils/db';

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const { success, data, error } = paginationSchema.safeParse(query);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        const { page, size } = data;
        const { count, result } = await db.transaction(async tx => {
            const count = await tx.$count(source);
            const { limit, offset } = pager(page, size, count);
            const result = await tx.query.source.findMany({
                limit,
                offset,
                with: {
                    addresses: true
                }
            });
            return { count, result };
        });
        setResponseStatus(event, StatusCodes.OK);
        return buildQueryResponse<SourceFullSchema & { description: string }>(
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
