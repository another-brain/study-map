import { usePagination } from 'alova/client';
import { initialData } from '~/consts/query';
import type { SourceFullSchema } from '~~/server/models/api/resource_management';

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
            initialData,
            data: resp => (resp as SearchResponse<SourceFullSchema>).data,
            initialPage: 1,
            initialPageSize,
            append: true,
            debounce: 1000
        }
    );
};
