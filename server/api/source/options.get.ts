import { like } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { searchSchema } from '~~/server/models/api/common';
import { source } from '~~/server/models/orm/resource_management';
import { likeStr } from '~~/server/models/orm/utils';

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const { success, data, error } = searchSchema.safeParse(query);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const { keyword, page, size } = data;
        const matchText = likeStr(keyword ?? '');
        const db = useDB();
        const { count, result } = await db.transaction(async tx => {
            const count = await tx.$count(source, like(source.name, matchText));
            const { limit, offset } = pager(page, size, count);
            const result = await db.query.source.findMany({
                limit,
                offset,
                where: (obj, { like }) => like(obj.name, matchText),
                columns: {
                    id: true,
                    name: true
                }
            });
            return { count, result };
        });
        setResponseStatus(event, StatusCodes.OK);
        return buildQueryResponse(result, count);
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
