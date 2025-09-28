import { inArray } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { TableName } from '~~/server/consts/db';
import { querySchema } from '~~/server/models/api/common';
import type { ResourceQueryResp } from '~~/server/models/api/resource_management';
import { resource } from '~~/server/models/orm/resource_management';
import { buildErrorResponse, buildQueryResponse } from '~~/server/utils/api';
import { pager } from '~~/server/utils/db';
import { mergeObj } from '~~/shared/utils';

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const { success, data, error } = querySchema.safeParse(query);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const { keyword, page, size, fields } = data;
        const index = useIndex(TableName.Resource);
        const ids = (await index.search(keyword, false)).map(id => Number(id));
        const db = useDB();
        const { count, result } = await db.transaction(async tx => {
            const count = await tx.$count(resource, inArray(resource.id, ids));
            const { limit, offset } = pager(page, size, count);
            const result = await db.query.resource.findMany({
                limit,
                offset,
                where: (obj, { inArray }) => inArray(obj.id, ids),
                columns: fields ? fields.map(f => ({ [f]: true })).reduce(mergeObj, {}) : undefined
            });
            return { count, result };
        });
        setResponseStatus(event, StatusCodes.OK);
        return buildQueryResponse<ResourceQueryResp>(result, count);
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
