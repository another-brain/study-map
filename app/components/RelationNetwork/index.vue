<template>
  <v-network-graph
    id="graph"
    :nodes="nodes"
    :edges="edges"
    :configs="configs"
    :event-handlers="eventHandlers"
  />
</template>

<script lang="ts" setup>
import type * as vNG from 'v-network-graph';
import { createGraphConfig } from './config';

defineProps<{
  nodes: Record<string, vNG.Node>;
  edges: Record<string, vNG.Edge>;
  eventHandlers: vNG.EventHandlers;
}>();
const configs = createGraphConfig();
</script>

<style></style>
