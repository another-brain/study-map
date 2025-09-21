import { usePagination } from 'alova/client';
import { get } from '~/utils/query';
import type { ResourceQueryResp } from '~~/server/models/api/resource_management';
import type { SearchResponse } from '~~/shared/types/query';

export const useListResource = (
    keyword: Ref<string | undefined>,
    fields?: string[],
    pageSize?: number
) => {
    return usePagination(
        (page, size) =>
            get('/api/resource', {
                page,
                size,
                keyword: keyword.value,
                fields
            }),
        {
            initialData: {
                total: 0,
                data: []
            },
            data: resp => (resp as SearchResponse<ResourceQueryResp>).data,
            initialPage: 1,
            initialPageSize: pageSize ?? 10,
            append: true,
            watchingStates: [keyword],
            debounce: 500
        }
    );
};
