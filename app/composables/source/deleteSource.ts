export const useDeleteSource = async (id: number) => {
    try {
        return await $fetch(`/api/source/${id}`, {
            method: 'DELETE'
        });
    } catch (err) {
        return err as Error;
    }
};
