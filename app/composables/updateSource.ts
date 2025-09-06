import type { SourceSchema } from '~~/server/models/api/resource_management';

export const useUpdateSource = (id: number, body: SourceSchema) => {
    return useAsyncData(() => {
        return $fetch(`/api/source/${id}`, {
            method: 'PUT',
            body
        });
    });
};
