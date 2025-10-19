import { and, eq, inArray } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { TableName } from '~~/server/consts/db';
import { searchSchema } from '~~/server/models/api/common';
import type { ResourceQueryResp } from '~~/server/models/api/resource_management';
import { resource } from '~~/server/models/orm/resource_management';
import { buildErrorResponse, buildQueryResponse } from '~~/server/utils/api';
import { pager } from '~~/server/utils/db';

const querySchema = searchSchema.extend({
    sourceId: z.coerce.number().min(1).optional()
});

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const { success, data, error } = querySchema.safeParse(query);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const { keyword, page, size, sourceId } = data;
        const index = useIndex(TableName.Resource);
        const ids = (await index.search(keyword, false)).map(id => Number(id));
        const db = useDB();
        const { count, result } = await db.transaction(async tx => {
            const count = await tx.$count(
                resource,
                and(
                    keyword ? inArray(resource.id, ids) : undefined,
                    sourceId ? eq(resource.sourceId, sourceId) : undefined
                )
            );
            const { limit, offset } = pager(page, size, count);
            const result = await db.query.resource.findMany({
                limit,
                offset,
                where: (obj, { inArray, eq, and }) =>
                    and(
                        keyword ? inArray(obj.id, ids) : undefined,
                        sourceId ? eq(obj.sourceId, sourceId) : undefined
                    ),
                with: { source: true }
            });
            return { count, result };
        });
        setResponseStatus(event, StatusCodes.OK);
        return buildQueryResponse(result as ResourceQueryResp[], count);
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
