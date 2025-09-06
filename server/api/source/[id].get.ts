import { StatusCodes } from 'http-status-codes';
import { idSchema } from '~~/server/models/api/common';
import type { SourceSchemaWithId } from '~~/server/models/api/resource_management';
import { buildErrorResponse } from '~~/server/utils/api';

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id');
    const { success, data, error } = idSchema.safeParse(id);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        const result = await db.query.source.findFirst({
            where: (source, { eq }) => eq(source.id, data),
            with: {
                addresses: true
            }
        });
        if (!result) {
            throw buildErrorResponse(StatusCodes.NOT_FOUND, new Error(`source ${id} not exist!`));
        }
        setResponseStatus(event, StatusCodes.OK);
        const resp: SourceSchemaWithId & { description: string } = {
            id: result.id,
            name: result.name,
            description: result.description,
            urls: result.addresses.map(address => address.url)
        };
        return resp;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
