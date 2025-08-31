import { StatusCodes } from 'http-status-codes';
import { idSchema } from '~~/server/models/api/common';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id')!;
    const validate = idSchema.safeParse(id);
    if (!validate.success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, validate.error);
    }
    try {
        const db = useDB();
        const result = await db.query.resource.findFirst({
            where: (resource, { eq }) => eq(resource.id, validate.data)
        });
        if (!result) {
            throw buildErrorResponse(StatusCodes.NOT_FOUND, new Error(`resource ${id} not exist!`));
        }
        setResponseStatus(event, StatusCodes.OK);
        return result;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
