<template>
  <v-img :src="srcDisplay" min-width="55" @error="handleError" />
</template>

<script lang="ts" setup>
import { defaultWebsiteIconPath } from '~/consts/routes';

const { url, origin } = defineProps<{ url: string; origin: string }>();
const src = ref(url);
const srcDisplay = computed(() => {
  const url = new URL(src.value);
  const routes = url.pathname.split('/').filter(part => part !== '');
  if (routes.length > 0 && routes[routes.length - 1] === defaultWebsiteIconPath) {
    url.search = '';
    return url.toString();
  }
  return useImage(src.value);
});
const reload = ref(false);
function handleError() {
  if (!reload.value) {
    src.value = `${origin}/${defaultWebsiteIconPath}`;
    reload.value = true;
  }
}
defineExpose({
  getSrc: () => src.value
});
</script>

<style></style>
