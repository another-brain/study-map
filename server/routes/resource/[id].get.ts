import { StatusCodes } from 'http-status-codes';
import { idSchema } from '~~/server/models/api/common';
import type { ResourceSchemaWithId } from '~~/server/models/api/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id')!;
    const { success, data, error } = idSchema.safeParse(id);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        const result = await db.query.resource.findFirst({
            where: (resource, { eq }) => eq(resource.id, data)
        });
        if (!result) {
            throw buildErrorResponse(StatusCodes.NOT_FOUND, new Error(`resource ${id} not exist!`));
        }
        setResponseStatus(event, StatusCodes.OK);
        const resp: ResourceSchemaWithId & { description: string } = result;
        return resp;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
