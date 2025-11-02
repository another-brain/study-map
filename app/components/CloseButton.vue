<template>
  <v-btn icon="mdi-close" variant="text" color="error" @click="click" />
</template>

<script lang="ts" setup>
const emit = defineEmits(['click']);
const click = () => emit('click');
</script>

<style></style>
