import { resourceSchema } from '~~/server/models/api/resource_management';
import { resource } from '~~/server/models/orm/resource_management';
import { StatusCodes } from 'http-status-codes';
import { buildErrorResponse } from '~~/server/utils/api';
import { TableName } from '~~/server/consts/db';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { success, data, error } = resourceSchema.safeParse(body);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        const result = await db.insert(resource).values(data);
        const id = result[0].insertId;
        const index = useIndex(TableName.Resource);
        index.add(id, data.name, [data.name, data.description ?? '']);
        setResponseStatus(event, StatusCodes.CREATED);
        return { id };
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
