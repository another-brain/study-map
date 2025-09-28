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
        const { limit, offset } = pager(page, size, ids.length);
        const result = ids
            .slice(offset)
            .slice(0, limit)
            .map(id => index.getName(id)!);
        setResponseStatus(event, StatusCodes.OK);
        return buildQueryResponse(result, ids.length);
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
