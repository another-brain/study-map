import type * as vNG from 'v-network-graph';

export const useBuildGraphData = (
    data: Ref<{ id: string; name: string; neighbors: Set<string> }[]>
) => {
    return computed(() => {
        const nodes = {} as Record<string, vNG.Node>;
        for (const item of data.value) {
            const { id, name } = item;
            nodes[id] = { name };
        }
        const edges = {} as Record<string, vNG.Edge>;
        for (const item of data.value) {
            const { id, neighbors } = item;
            for (const neighbor of neighbors) {
                edges[JSON.stringify([id, neighbor])] = {
                    source: id,
                    target: neighbor
                };
            }
        }
        return { nodes, edges };
    });
};
