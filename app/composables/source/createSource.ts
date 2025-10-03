import type { SourceSchema } from '~~/server/models/api/resource_management';

export const useCreateSource = async (body: SourceSchema) => {
    try {
        return await $fetch('/api/source', {
            method: 'POST',
            body
        });
    } catch (err) {
        return err as Error;
    }
};
