import type { SourceSchema } from '~~/server/models/api/resource_management';

export const useCreateSource = (body: SourceSchema) => {
    return useAsyncData(
        () => {
            return $fetch('/api/source', {
                method: 'POST',
                body
            });
        },
        { immediate: false }
    );
};
