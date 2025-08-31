import type { StatusCodes } from 'http-status-codes';

export function buildErrorResponse(statusCode: StatusCodes, error: Error): Error {
    return createError({
        statusCode,
        message: error.message,
        data: { error }
    });
}

export function buildQueryResponse<T>(entries: T[], total: number) {
    return {
        total,
        entries
    };
}
