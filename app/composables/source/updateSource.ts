import type { SourceSchema } from '~~/server/models/api/resource_management';

export const useUpdateSource = async (id: number, body: SourceSchema) => {
    try {
        return await $fetch(`/api/source/${id}`, {
            method: 'PUT',
            body
        });
    } catch (err) {
        return err as Error;
    }
};
