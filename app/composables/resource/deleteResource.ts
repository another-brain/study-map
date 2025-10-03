export const useDeleteResource = async (id: number) => {
    try {
        return await $fetch(`/api/resource/${id}`, {
            method: 'DELETE'
        });
    } catch (err) {
        return err as Error;
    }
};
