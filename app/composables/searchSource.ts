import { usePagination } from 'alova/client';

export const useSearchSource = (keyword: Ref<string | undefined>, initialPageSize: number) => {
    return usePagination(
        (page, size) =>
            get('/api/source/options', {
                page,
                size,
                keyword: keyword.value
            }),
        {
            initialData: {
                total: 0,
                data: []
            },
            data: resp => (resp as SearchResponse<{ id: number; name: string }>).data,
            initialPage: 1,
            initialPageSize,
            append: true,
            debounce: 500,
            watchingStates: [keyword]
        }
    );
};
