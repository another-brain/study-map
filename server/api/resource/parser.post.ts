import { StatusCodes } from 'http-status-codes';
import { parserSchema } from '~~/server/models/api/common';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { success, data, error } = parserSchema.safeParse(body);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const db = useDB();
        const result = await db.query.resource.findFirst({
            where: (resource, { eq }) => eq(resource.url, data.url)
        });
        setResponseStatus(event, StatusCodes.OK);
        return { id: result ? result.id : 0 };
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});
