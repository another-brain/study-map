<template>
  <v-container class="w-full flex flex-col justify-center align-center" :height="height">
    <v-chip color="primary" class="w-full flex justify-center" label>{{ bar }}</v-chip>
    <v-network-graph
      ref="graph"
      v-model:layouts="layouts"
      :nodes="data.nodes"
      :edges="data.edges"
      :configs="configs"
      :event-handlers="eventHandlers"
    />
  </v-container>
</template>

<script lang="ts" setup>
import type * as vNG from 'v-network-graph';
import { createGraphConfig } from './config';
import { PageRoutes } from '~/consts/routes';
import type { VNGNode } from './utils';

const configs = ref(createGraphConfig());
const { data, load } = defineProps<{
  height: number;
  data: {
    nodes: Record<string, VNGNode>;
    edges: Record<string, vNG.Edge>;
  };
  load: (count: number) => Promise<boolean>;
}>();

const layouts = ref({ nodes: {} as Record<string, { x: number; y: number }> });
const viewBox = ref({ top: 0, bottom: 0, left: 0, right: 0 });
const graph = ref({ getViewBox: () => viewBox.value });
const bar = ref('');
const router = useRouter();
onMounted(() => {
  viewBox.value = graph.value.getViewBox();
});
const eventHandlers: vNG.EventHandlers = {
  'view:pan': () => {
    viewBox.value = graph.value.getViewBox();
  },
  'view:zoom': () => {
    viewBox.value = graph.value.getViewBox();
  },
  'node:click': ({ node }) => {
    router.push({ path: `${PageRoutes.ResourceManagement}/${node}` });
  },
  'node:pointerover': ({ node }) => {
    const { name, url } = data.nodes[node]!;
    bar.value = `${name} (${url}) `;
  },
  'node:pointerout': () => {
    bar.value = '';
  }
};
const nodeInViewCount = computed(
  () =>
    Object.values(layouts.value.nodes).filter(
      ({ x, y }) =>
        x >= viewBox.value.left &&
        x <= viewBox.value.right &&
        y <= viewBox.value.bottom &&
        y >= viewBox.value.top
    ).length
);
watch([nodeInViewCount], ([nodeInViewCount]) => {
  load(nodeInViewCount).then(refresh => {
    if (refresh) {
      configs.value = createGraphConfig();
    }
  });
});
</script>

<style></style>
