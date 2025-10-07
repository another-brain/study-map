<template>
  <v-card class="w-full">
    <template #title>
      <div class="text-wrap">{{ name }}</div>
    </template>
    <template #prepend>
      <slot name="logo" />
    </template>
    <template #subtitle>
      <nuxt-link :to="linkTarget" class="text-wrap">{{ linkText ?? linkTarget }}</nuxt-link>
    </template>
    <template #text>
      {{ description }}
    </template>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  linkText?: string;
  linkTarget: string;
  description: string;
}>();
</script>

<style></style>
