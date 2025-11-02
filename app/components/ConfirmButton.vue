<template>
  <v-btn icon="mdi-check" color="primary" :loading="loading" @click="handleSubmit" />
</template>

<script lang="ts" setup>
const loading = ref(false);
const { exec } = defineProps<{
  exec: () => Promise<boolean>;
}>();
const emit = defineEmits(['ok']);
async function handleSubmit() {
  loading.value = true;
  try {
    if (await exec()) {
      emit('ok');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
