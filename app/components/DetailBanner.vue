<template>
  <v-card class="w-full">
    <template #title>
      <div class="text-wrap">{{ name }}</div>
    </template>
    <template #prepend>
      <slot name="logo" />
    </template>
    <template #subtitle>
      <v-chip color="primary" variant="flat" prepend-icon="mdi-link-variant" class="h-auto py-1">
        <nuxt-link :to="linkTarget" class="text-wrap">
          {{ linkText ?? linkTarget }}
        </nuxt-link>
      </v-chip>
    </template>
    <template #text>
      {{ description }}
    </template>
    <template v-if="xs" #actions>
      <slot name="actions" />
    </template>
    <template v-else #append>
      <slot name="actions" />
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
const { xs } = useDisplay();
</script>

<style></style>
