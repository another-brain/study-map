import { StatusCodes } from 'http-status-codes';
import { TableName } from '~~/server/consts/db';
import { searchSchema } from '~~/server/models/api/common';

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const { success, data, error } = searchSchema.safeParse(query);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const { keyword, page, size } = data;
        const index = useIndex(TableName.Resource);
        const ids = (await index.search(keyword, true)).map(id => Number(id));
        const db = useDB();
        const records = await db.query.resource.findMany({
            where: (resource, { inArray }) => inArray(resource.id, ids),
            columns: { name: true }
        });
        const { limit, offset } = pager(page, size, records.length);
        const result = records
            .slice(offset)
            .slice(0, limit)
            .map(({ name }) => name);
        setResponseStatus(event, StatusCodes.OK);
        return buildQueryResponse(result, records.length);
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
