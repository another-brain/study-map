import { StatusCodes } from 'http-status-codes';
import { idSchema } from '~~/server/models/api/common';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id');
    const validate = idSchema.safeParse(id);
    if (!validate.success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, validate.error);
    }
    try {
        const db = useDB();
        const result = await db.query.source.findFirst({
            where: (source, { eq }) => eq(source.id, validate.data),
            with: {
                addresses: true
            }
        });
        if (!result) {
            throw buildErrorResponse(StatusCodes.NOT_FOUND, new Error(`source ${id} not exist!`));
        }
        setResponseStatus(event, StatusCodes.OK);
        return {
            id: result.id,
            name: result.name,
            description: result.description,
            urls: result.addresses.map(address => address.url)
        };
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
