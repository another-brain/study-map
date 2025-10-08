<template>
  <v-dialog v-model="editDialog" persistent max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn icon="mdi-pencil" class="mx-1" color="primary" v-bind="activatorProps" />
    </template>
    <v-card :title="`Edit ${objectType}`">
      <template #text>
        <slot name="form" />
      </template>
      <template #actions>
        <v-btn icon="mdi-close" variant="plain" @click="cancelChange" />
        <v-btn icon="mdi-check" color="error" :loading="changing" @click="doChange" />
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteDialog" max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn icon="mdi-trash-can" class="mx-1" color="error" v-bind="activatorProps" />
    </template>
    <v-card :title="`Delete ${objectType}`">
      <template #text>
        Are you sure to delete {{ objectType }} <v-chip color="primary">{{ name }}</v-chip> ?
      </template>
      <template #actions>
        <v-btn icon="mdi-close" variant="plain" @click="cancelDelete" />
        <v-btn icon="mdi-check" color="error" :loading="deleting" @click="doDelete" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const editDialog = ref(false);
const deleteDialog = ref(false);
const { change, remove } = defineProps<{
  objectType: string;
  name: string;
  change: () => Promise<boolean>;
  remove: () => Promise<boolean>;
}>();

function cancelChange() {
  editDialog.value = false;
}
const changing = ref(false);
async function doChange() {
  changing.value = true;
  const ok = await change();
  changing.value = false;
  if (ok) {
    cancelChange();
  }
}

function cancelDelete() {
  deleteDialog.value = false;
}
const deleting = ref(false);
async function doDelete() {
  deleting.value = true;
  const ok = await remove();
  deleting.value = false;
  if (ok) {
    cancelDelete();
  }
}
</script>

<style></style>
