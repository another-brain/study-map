import type * as vNG from 'v-network-graph';

export type GraphNode = {
    id: string;
    name: string;
    url: string;
    neighbors: Set<string>;
};

export type VNGNode = vNG.Node & { name: string; url: string };

export const buildGraphData = (data: Ref<GraphNode[]>) => {
    return computed(() => {
        const nodes = {} as Record<string, VNGNode>;
        for (const item of data.value) {
            const { id, name, url } = item;
            nodes[id] = { name, url };
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
