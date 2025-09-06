export const useDeleteSource = (id: number) => {
    return useAsyncData(() => {
        return $fetch(`/api/source/${id}`, {
            method: 'DELETE'
        });
    });
};
