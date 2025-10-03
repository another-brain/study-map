import { usePagination } from 'alova/client';
import type { SourceQueryResp } from '~~/server/models/api/resource_management';

export const useListSource = (
    keyword: Ref<string | undefined>,
    initialPageSize: number,
    fields?: string[]
) => {
    return usePagination(
        (page, size) =>
            get('/api/source', {
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
            data: resp => (resp as SearchResponse<SourceQueryResp>).data,
            initialPage: 1,
            initialPageSize,
            append: true,
            debounce: 1000
        }
    );
};
