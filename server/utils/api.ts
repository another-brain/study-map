import type { StatusCodes } from 'http-status-codes';
import type { SearchResponse } from '~~/shared/types/query';
import { consola } from 'consola';

export function buildErrorResponse(statusCode: StatusCodes, error: Error): Error {
    consola.error(error.message);
    return createError({
        statusCode,
        statusMessage: error.message,
        data: { error }
    });
}

export function buildQueryResponse<T>(data: T[], total: number): SearchResponse<T> {
    return {
        total,
        data
    };
}
