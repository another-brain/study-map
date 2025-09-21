import type { StatusCodes } from 'http-status-codes';
import type { SearchResponse } from '~~/shared/types/query';

export function buildErrorResponse(statusCode: StatusCodes, error: Error): Error {
    return createError({
        statusCode,
        message: error.message,
        data: { error }
    });
}

export function buildQueryResponse<T>(data: T[], total: number): SearchResponse<T> {
    return {
        total,
        data
    };
}
