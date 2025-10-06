<template>
  <v-img :src="src" min-width="55" @error="handleError" />
</template>

<script lang="ts" setup>
const { url, origin } = defineProps<{ url: string; origin: string }>();
const src = ref(useImage(url));
const reload = ref(false);
function handleError() {
  if (!reload.value) {
    src.value = `${origin}/favicon.ico`;
    reload.value = true;
  }
}
</script>

<style></style>
