import type { SourceSchema } from '~~/server/models/api/resource_management';

export default {
    create: async (body: SourceSchema) => {
        try {
            return await $fetch('/api/source', {
                method: 'POST',
                body
            });
        } catch (err) {
            return err as Error;
        }
    },
    update: async (id: number, body: SourceSchema) => {
        try {
            return await $fetch(`/api/source/${id}`, {
                method: 'PUT',
                body
            });
        } catch (err) {
            return err as Error;
        }
    },
    delete: async (id: number) => {
        try {
            return await $fetch(`/api/source/${id}`, {
                method: 'DELETE'
            });
        } catch (err) {
            return err as Error;
        }
    },
    parse: async (url: string) => {
        try {
            return await $fetch('/api/source/parser', {
                method: 'POST',
                body: { url }
            });
        } catch (err) {
            return err as Error;
        }
    }
};
