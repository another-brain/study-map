import { StatusCodes } from 'http-status-codes';
import { parserSchema } from '../models/api/common';
import { extractObj } from '~~/shared/utils';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { success, data, error } = parserSchema.safeParse(body);
    if (!success) {
        throw buildErrorResponse(StatusCodes.BAD_REQUEST, error);
    }
    try {
        const query = new URLSearchParams();
        query.set('url', data.url);
        const resp = await fetch(`https://api.microlink.io?${query.toString()}`);
        if (!resp.ok) {
            throw new Error('http request failed');
        }
        const result = (await resp.json()) as MicroLinkApiResp;
        if (result.status !== 'success') {
            throw buildErrorResponse(
                result.statusCode,
                new Error(result.message ?? 'unknown error')
            );
        }
        setResponseStatus(event, StatusCodes.OK);
        return extractObj(result.data!, ['title', 'description', 'logo']) as WebsiteMetaData;
    } catch (err) {
        throw buildErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err as Error);
    }
});

type MicroLinkApiResp = {
    // https://microlink.io/docs/api/basics/format#status
    status: 'success' | 'fail' | 'error';
    statusCode: StatusCodes;
    // https://microlink.io/docs/api/getting-started/data-fields
    data?: WebsiteMetaData;
    message?: string;
};

type WebsiteMetaData = {
    title: string;
    description: string;
    logo: {
        url: string;
    };
};
