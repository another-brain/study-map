import type { ResourceSchema } from '~~/server/models/api/resource_management';

export const useUpdateResource = async (id: number, body: ResourceSchema) => {
    try {
        return await $fetch(`/api/resource/${id}`, {
            method: 'PUT',
            body
        });
    } catch (err) {
        return err as Error;
    }
};
