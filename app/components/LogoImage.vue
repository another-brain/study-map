<template>
  <v-img :src="srcDisplay" min-width="55" class="bg-surface" rounded="lg" @error="handleError">
    <template #placeholder>
      <v-sheet
        height="55"
        width="55"
        color="surface"
        rounded="lg"
        class="d-flex align-center justify-center"
      >
        <v-progress-circular color="info" indeterminate size="40" />
      </v-sheet>
    </template>
  </v-img>
</template>

<script lang="ts" setup>
import { defaultWebsiteIconName, imgFileFormats } from '~/consts/routes';

const { url, origin } = defineProps<{ url: string; origin: string }>();
const candidates = computed(() =>
  [url, useImage(url)].concat(
    imgFileFormats.map(format => `${origin}/${defaultWebsiteIconName}.${format}`)
  )
);
const reloadCount = ref(0);
const src = computed(() => candidates.value[reloadCount.value]);
const srcDisplay = computed(() => {
  if (!src.value) {
    return '';
  }
  const url = new URL(src.value);
  const routes = url.pathname.split('/').filter(part => part !== '');
  if (routes.length > 0 && isDefaultWebsiteIconName(routes[routes.length - 1]!)) {
    url.search = '';
  }
  return url.toString();
});
function handleError() {
  if (reloadCount.value < candidates.value.length) {
    reloadCount.value++;
  }
}
defineExpose({
  getSrc: () => src.value
});
</script>

<style></style>
