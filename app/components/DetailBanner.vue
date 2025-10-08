<template>
  <v-card class="w-full">
    <template #title>
      <div class="text-wrap">{{ name }}</div>
    </template>
    <template #prepend>
      <slot name="logo" />
    </template>
    <template #subtitle>
      <v-chip color="primary" variant="flat" prepend-icon="mdi-link-variant">
        <nuxt-link :to="linkTarget" class="text-wrap">
          {{ linkText ?? linkTarget }}
        </nuxt-link>
      </v-chip>
    </template>
    <template #text>
      {{ description }}
    </template>
    <template v-if="xs" #actions>
      <ActionButtons :object-type="objectType" :name="name" :change="change" :remove="remove">
        <template #form>
          <slot name="edit" />
        </template>
      </ActionButtons>
    </template>
    <template v-else #append>
      <ActionButtons :object-type="objectType" :name="name" :change="change" :remove="remove">
        <template #form>
          <slot name="edit" />
        </template>
      </ActionButtons>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  linkText?: string;
  linkTarget: string;
  description: string;
  objectType: string;
  change: () => Promise<boolean>;
  remove: () => Promise<boolean>;
}>();
const { xs } = useDisplay();
</script>

<style></style>
