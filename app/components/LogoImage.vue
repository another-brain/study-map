<template>
  <v-img :src="srcDisplay" min-width="55" @error="handleError" />
</template>

<script lang="ts" setup>
import { defaultWebsiteIconName, imgFileFormats } from '~/consts/routes';

const { url, origin } = defineProps<{ url: string; origin: string }>();
const src = ref(url);
const srcDisplay = computed(() => {
  const url = new URL(src.value);
  const routes = url.pathname.split('/').filter(part => part !== '');
  if (routes.length > 0 && isDefaultWebsiteIconName(routes[routes.length - 1]!)) {
    url.search = '';
    return url.toString();
  }
  return useImage(src.value);
});
const reloadCount = ref(0);
function handleError() {
  if (reloadCount.value < imgFileFormats.length) {
    src.value = `${origin}/${defaultWebsiteIconName}.${imgFileFormats[reloadCount.value++]}`;
  }
}
defineExpose({
  getSrc: () => src.value
});
</script>

<style></style>
