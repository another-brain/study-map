import { StatusCodes } from 'http-status-codes';
import { querySchema } from '~~/server/models/api/common';
import type { ResourceQueryResp } from '~~/server/models/api/resource_management';
import { resource } from '~~/server/models/orm/resource_management';
import { likeStr } from '~~/server/models/orm/utils';
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
        const db = useDB();
        const { page, size, keyword, fields } = data;
        const { count, result } = await db.transaction(async tx => {
            const count = await tx.$count(resource);
            const { limit, offset } = pager(page, size, count);
            const result = await db.query.resource.findMany({
                limit,
                offset,
                where: keyword ? (obj, { like }) => like(obj.name, likeStr(keyword)) : undefined,
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
