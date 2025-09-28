import { usePagination } from 'alova/client';

export const useSearchResource = (keyword: Ref<string | undefined>, initialPageSize: number) => {
    return usePagination(
        (page, size) =>
            get('/api/resource/options', {
                page,
                size,
                keyword: keyword.value
            }),
        {
            initialData: {
                total: 0,
                data: []
            },
            data: resp => (resp as SearchResponse<string>).data,
            initialPage: 1,
            initialPageSize,
            append: true,
            debounce: 500,
            watchingStates: [keyword]
        }
    );
};
