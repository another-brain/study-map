import type { ResourceSchemaWithId } from '~~/server/models/api/resource_management';

export const useUpdateResource = (data: ResourceSchemaWithId) => {
    return useAsyncData(() => {
        return $fetch(`/api/resource/${data.id}`, {
            method: 'PUT',
            body: data
        });
    });
};
