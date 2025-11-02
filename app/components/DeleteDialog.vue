<template>
  <v-dialog v-model="dialog" max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn icon="mdi-trash-can" class="mx-1" color="error" v-bind="activatorProps" />
    </template>
    <v-card :title="`Delete ${objectType}`">
      <template #text>
        Are you sure to delete {{ objectType }} <v-chip color="primary">{{ name }}</v-chip> ?
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
  name: string;
  work: () => Promise<boolean>;
}>();
function handleClose() {
  dialog.value = false;
}
</script>

<style></style>
