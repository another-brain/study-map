<template>
  <v-img
    ref="imgRef"
    :src="srcDisplay"
    min-width="55"
    class="bg-surface"
    rounded="lg"
    @error="handleError"
  >
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

const { url, origin } = defineProps<{
  url: string;
  origin: string | null;
}>();
const candidates = computed(() =>
  (url ? [url, useImage(url)] : []).concat(
    origin ? imgFileFormats.map(format => `${origin}/${defaultWebsiteIconName}.${format}`) : []
  )
);
const reloadCount = ref(0);
const src = computed(() => candidates.value[reloadCount.value]);
const srcDisplay = computed(() => {
  try {
    const url = new URL(src.value ?? '');
    const routes = url.pathname.split('/').filter(part => part !== '');
    if (routes.length > 0 && isDefaultWebsiteIconName(routes[routes.length - 1]!)) {
      url.search = '';
    }
    return url.toString();
  } catch {
    return '';
  }
});
const imgRef = ref<{ $el: { clientWidth: number; clientHeight: number } }>();
function handleError() {
  if (reloadCount.value < candidates.value.length) {
    reloadCount.value++;
  }
  nextTick(() => {
    const { clientHeight, clientWidth } = imgRef.value!.$el;
    if (clientHeight * clientWidth === 0 && reloadCount.value < candidates.value.length) {
      reloadCount.value++;
    }
  });
}
defineExpose({
  getSrc: () => src.value
});
</script>

<style></style>
