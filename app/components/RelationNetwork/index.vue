<template>
  <v-network-graph
    ref="graph"
    v-model:layouts="layouts"
    :nodes="data.nodes"
    :edges="data.edges"
    :configs="configs"
    :event-handlers="eventHandlers"
  />
</template>

<script lang="ts" setup>
import type * as vNG from 'v-network-graph';
import { createGraphConfig } from './config';

const configs = ref(createGraphConfig());
const { load } = defineProps<{
  data: {
    nodes: Record<string, vNG.Node>;
    edges: Record<string, vNG.Edge>;
  };
  load: (count: number) => void;
}>();

const layouts = ref({ nodes: {} as Record<string, { x: number; y: number }> });
const viewBox = ref({ top: 0, bottom: 0, left: 0, right: 0 });
const graph = ref({ getViewBox: () => viewBox.value });
onMounted(() => {
  viewBox.value = graph.value.getViewBox();
});
const eventHandlers = {
  'view:pan': () => {
    viewBox.value = graph.value.getViewBox();
  },
  'view:zoom': () => {
    viewBox.value = graph.value.getViewBox();
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
  load(nodeInViewCount);
  configs.value = createGraphConfig();
});
</script>

<style></style>
