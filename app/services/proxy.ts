export default {
    parse: async (url: string) => {
        try {
            return await $fetch('/api/parser', {
                method: 'POST',
                body: { url }
            });
        } catch (err) {
            return err as Error;
        }
    }
};
