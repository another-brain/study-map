import { createAlova, type Arg } from 'alova';
import adapterFetch from 'alova/fetch';
import nuxtHook from 'alova/nuxt';

const queryClient = createAlova({
    requestAdapter: adapterFetch(),
    responded: resp => resp.json(),
    statesHook: nuxtHook({
        nuxtApp: useNuxtApp
    }),
    cacheFor: null
});

export function get(path: string, params: Arg) {
    const queryString = buildQueryParams(params);
    return queryClient.Get(`${path}?${queryString}`);
}

function buildQueryParams(params: Arg) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            value.forEach(item => {
                searchParams.append(key, item);
            });
        } else if (value !== undefined && value !== null) {
            searchParams.set(key, String(value));
        }
    }
    return searchParams.toString();
}
