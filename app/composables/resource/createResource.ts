import type { ResourceSchema } from '~~/server/models/api/resource_management';

export const useCreateResource = async (body: ResourceSchema) => {
    try {
        return await $fetch('/api/resource', {
            method: 'POST',
            body
        });
    } catch (err) {
        return err as Error;
    }
};
