<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn icon="mdi-pencil" class="mx-1" color="primary" v-bind="activatorProps" />
    </template>
    <v-card :title="`Edit ${objectType}`">
      <template #text>
        <slot name="form" />
      </template>
      <template #actions>
        <CancelButton @click="handleClose" />
        <ConfirmButton :exec="work" @ok="handleClose" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const dialog = ref(false);
const { work } = defineProps<{
  objectType: string;
  work: () => Promise<boolean>;
}>();
function handleClose() {
  dialog.value = false;
}
</script>

<style></style>
