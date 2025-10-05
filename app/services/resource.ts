import type { ResourceSchema } from '~~/server/models/api/resource_management';

export default {
    create: async (body: ResourceSchema) => {
        try {
            return await $fetch('/api/resource', {
                method: 'POST',
                body
            });
        } catch (err) {
            return err as Error;
        }
    },
    update: async (id: number, body: ResourceSchema) => {
        try {
            return await $fetch(`/api/resource/${id}`, {
                method: 'PUT',
                body
            });
        } catch (err) {
            return err as Error;
        }
    },
    delete: async (id: number) => {
        try {
            return await $fetch(`/api/resource/${id}`, {
                method: 'DELETE'
            });
        } catch (err) {
            return err as Error;
        }
    },
    parse: async (url: string) => {
        try {
            return await $fetch('/api/resource/parser', {
                method: 'POST',
                body: { url }
            });
        } catch (err) {
            return err as Error;
        }
    }
};
