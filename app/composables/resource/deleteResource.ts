export const useDeleteResource = (id: number) => {
    return useAsyncData(
        () => {
            return $fetch(`/api/resource/${id}`, {
                method: 'DELETE'
            });
        },
        { lazy: true }
    );
};
