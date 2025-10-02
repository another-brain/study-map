import type { ResourceSchema } from '~~/server/models/api/resource_management';

export const useUpdateResource = (id: number, body: ResourceSchema) => {
    return useAsyncData(
        () => {
            return $fetch(`/api/resource/${id}`, {
                method: 'PUT',
                body
            });
        },
        { lazy: true }
    );
};
