import { usePagination } from 'alova/client';
import { initialData } from '~/consts/query';
import type { ResourceQueryResp } from '~~/server/models/api/resource_management';

export const useListResourceOfSource = (sourceId: number, initialPageSize: number) => {
    return usePagination(
        (page, size) =>
            get('/api/resource', {
                page,
                size,
                sourceId
            }),
        {
            initialData,
            data: resp => (resp as SearchResponse<ResourceQueryResp>).data,
            initialPage: 1,
            initialPageSize,
            append: true,
            debounce: 1000
        }
    );
};
