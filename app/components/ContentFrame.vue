<template>
  <div class="w-full h-full flex justify-center align-center">
    <iframe
      v-show="!loading && !error"
      class="h-full w-full"
      :src="src"
      @load="handleLoad"
      @error="handleError"
    />
    <v-progress-circular v-show="loading" color="info" indeterminate size="x-large" />
    <PageError
      v-show="error"
      err-type="Loading Error"
      message="Fetch page failed"
      :detail="`Load page from ${src} failed`"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ src: string }>();
const loading = ref(true);
function handleLoad() {
  loading.value = false;
}
const error = ref(false);
function handleError() {
  error.value = true;
}
</script>

<style></style>
