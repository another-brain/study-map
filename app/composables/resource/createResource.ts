import type { ResourceSchema } from '~~/server/models/api/resource_management';

export const useCreateResource = (body: ResourceSchema) => {
    return useAsyncData(() => {
        return $fetch('/api/resource', {
            method: 'POST',
            body
        });
    });
};
